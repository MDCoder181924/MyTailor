import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const statusColors = {
  PENDING: "bg-white/[0.06] text-gray-300",
  ACCEPTED: "bg-white/[0.08] text-white",
  SHIPPED: "bg-white/[0.08] text-white",
  CANCELLED: "bg-white/[0.04] text-gray-400",
};

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-xs text-gray-500 uppercase tracking-wider flex-shrink-0 pt-0.5">{label}</span>
    <span className="text-sm text-white text-right">{value || "—"}</span>
  </div>
);

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/api/admin/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        toast.error("Failed to load order details");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) return null;

  const measurements = order.customMeasurements;
  const hasMeasurements = measurements && typeof measurements === "object" && Object.keys(measurements).length > 0;

  return (
    <AdminLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/orders")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white font-mono">{order.orderNo}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-white/[0.04] text-gray-400"}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Created: {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
            {order.updatedAt !== order.createdAt && (
              <p className="text-xs text-gray-600 mt-0.5">
                Updated: {new Date(order.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">${order.price || 0}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
              order.paymentStatus === "paid" ? "bg-white/[0.08] text-white" : "bg-white/[0.04] text-gray-400"
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Stage", value: order.stage },
          { label: "Stage Index", value: order.stageIndex },
          { label: "Delivery", value: order.deliveryMethod },
          { label: "Category", value: order.category },
        ].map((s) => (
          <div key={s.label} className="bg-[#111116] border border-white/[0.08] rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-white capitalize">{s.value || "—"}</p>
            <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Info */}
        <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Customer</h3>
            {order.user?._id && (
              <button
                onClick={() => navigate(`/admin/users/${order.user._id}`)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                View Profile →
              </button>
            )}
          </div>
          <div className="space-y-3">
            <InfoItem label="Name" value={order.user?.userFullName || order.customerName} />
            <InfoItem label="Email" value={order.user?.userEmail} />
            <InfoItem label="Phone" value={order.user?.userMobileNumber} />
            <InfoItem label="Delivery Name" value={order.deliveryName} />
            <InfoItem label="Delivery Address" value={order.deliveryAddress} />
          </div>
        </div>

        {/* Tailor Info */}
        <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Tailor</h3>
            {order.tailor?._id && (
              <button
                onClick={() => navigate(`/admin/tailors/${order.tailor._id}`)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                View Profile →
              </button>
            )}
          </div>
          <div className="space-y-3">
            <InfoItem label="Name" value={order.tailor?.tailorName || order.tailorName} />
            <InfoItem label="Email" value={order.tailor?.tailorEmail} />
            <InfoItem label="Phone" value={order.tailor?.tailorMobileNumber} />
            <InfoItem label="Shop" value={order.tailor?.shopName} />
            <InfoItem label="Shop Address" value={order.tailor?.shopAddress} />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product Details</h3>
        <div className="flex flex-col sm:flex-row gap-6">
          {(order.productImage || order.product?.image) && (
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.04] border border-white/[0.08]">
              <img
                src={order.productImage || order.product?.image}
                alt={order.productName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          )}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoItem label="Product Name" value={order.product?.productName || order.productName} />
            <InfoItem label="Category" value={order.productCategory || order.product?.category} />
            <InfoItem label="Fabric" value={order.selectedFabric} />
            <InfoItem label="Size" value={order.selectedSize} />
            <InfoItem label="Brand" value={order.selectedBrand} />
            <InfoItem label="Clothing Type" value={order.clothingType} />
            <InfoItem label="Payment Method" value={order.paymentMethod} />
            <InfoItem label="Est. Completion" value={order.estCompletion} />
            <InfoItem label="Work Started" value={order.workStarted ? "Yes" : "No"} />
            <InfoItem label="Reviewed" value={order.isReviewed ? "Yes" : "No"} />
          </div>
        </div>
      </div>

      {/* Custom Measurements */}
      {hasMeasurements && (
        <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Custom Measurements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(measurements).map(([key, val]) => (
              <div key={key} className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.06]">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-0.5">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-sm text-white font-medium">{val || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancellation Info */}
      {order.status === "CANCELLED" && (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Cancellation Information</h3>
          <div className="space-y-3">
            <InfoItem label="Cancelled By" value={order.cancelledBy || "—"} />
            <InfoItem label="Reason" value={order.cancellationReason || "No reason specified"} />
            <InfoItem label="Details" value={order.cancellationDetails || "No details provided"} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderDetail;
