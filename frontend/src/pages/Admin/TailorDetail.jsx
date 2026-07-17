import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const statusColors = {
  PENDING: "bg-white/[0.06] text-gray-300",
  ACCEPTED: "bg-white/[0.08] text-white",
  SHIPPED: "bg-white/[0.08] text-white",
  CANCELLED: "bg-white/[0.04] text-gray-400",
};

const TailorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tailor, setTailor] = useState(null);
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/api/admin/tailors/${id}`);
        setTailor(res.data.tailor);
        setStats(res.data.stats);
        setOrders(res.data.orders);
        setProducts(res.data.products || []);
      } catch (err) {
        toast.error("Failed to load tailor details");
        navigate("/admin/tailors");
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

  if (!tailor) return null;

  return (
    <AdminLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/tailors")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Tailors
      </button>

      {/* Profile Header */}
      <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {tailor.profilePhoto ? (
              <img src={tailor.profilePhoto} alt={tailor.tailorName} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              tailor.tailorName?.charAt(0)?.toUpperCase() || "T"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{tailor.tailorName}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                tailor.identityStatus === "Verified" ? "bg-white/[0.08] text-white border border-white/[0.1]" : "bg-white/[0.04] text-gray-400 border border-white/[0.06]"
              }`}>
                {tailor.identityStatus || "Verified"}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">{tailor.professionalTitle || "MASTER TAILOR & DESIGNER"}</p>
            {tailor.shopName && (
              <p className="text-sm text-gray-500">{tailor.shopName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        {[
          { label: "Total Orders", value: stats.totalOrders || 0 },
          { label: "Pending", value: stats.pendingOrders || 0 },
          { label: "Accepted", value: stats.acceptedOrders || 0 },
          { label: "Shipped", value: stats.shippedOrders || 0 },
          { label: "Cancelled", value: stats.cancelledOrders || 0 },
          { label: "Products", value: stats.totalProducts || 0 },
          { label: "Revenue", value: `$${(stats.totalRevenue || 0).toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="bg-[#111116] border border-white/[0.08] rounded-xl p-4 text-center hover:border-white/[0.15] transition-all">
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact Information</h3>
          <div className="space-y-3">
            {[
              { label: "Email", value: tailor.tailorEmail },
              { label: "Phone", value: tailor.tailorMobileNumber },
              { label: "Shop Address", value: tailor.shopAddress || "—" },
              { label: "Experience", value: `${tailor.yearsOfExperience || 0} years` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-start gap-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider flex-shrink-0 pt-0.5">{item.label}</span>
                <span className="text-sm text-white text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111116] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Shop Details</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Description</span>
              <p className="text-sm text-gray-300 mt-1">{tailor.shopDescription || "No description provided"}</p>
            </div>
            {tailor.specializations?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Specializations</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tailor.specializations.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs bg-white/[0.06] text-gray-300 rounded-lg border border-white/[0.08]">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {tailor.keySkills?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Key Skills</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tailor.keySkills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs bg-white/[0.06] text-gray-300 rounded-lg border border-white/[0.08]">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {tailor.disabledSizes?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Disabled Sizes</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tailor.disabledSizes.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs bg-white/[0.04] text-gray-400 rounded-lg border border-white/[0.06]">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Joined Date */}
      <div className="mb-6">
        <p className="text-xs text-gray-500">Joined: {new Date(tailor.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111116] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Orders ({orders.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Order No</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Customer</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Product</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Payment</th>
                <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Price</th>
                <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500 text-sm">No orders yet</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => navigate(`/admin/orders/${o._id}`)}>
                    <td className="px-6 py-3.5 text-sm text-white font-mono">{o.orderNo}</td>
                    <td className="px-6 py-3.5 text-sm text-white">{o.user?.userFullName || o.customerName || "—"}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-400">{o.product?.productName || o.productName || "—"}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || "bg-white/[0.04] text-gray-400"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        o.paymentStatus === "paid" ? "bg-white/[0.08] text-white" : "bg-white/[0.04] text-gray-400"
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white text-right font-medium">${o.price || 0}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-500 text-right">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TailorDetail;
