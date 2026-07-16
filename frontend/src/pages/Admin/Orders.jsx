import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-400",
  ACCEPTED: "bg-blue-500/10 text-blue-400",
  SHIPPED: "bg-green-500/10 text-green-400",
  CANCELLED: "bg-red-500/10 text-red-400",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/admin/orders");
      setOrders(res.data.orders);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNo?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.userFullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.tailor?.tailorName?.toLowerCase().includes(search.toLowerCase()) ||
      o.productName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openEdit = (order) => {
    setEditOrder(order);
    setEditForm({
      status: order.status || "PENDING",
      paymentStatus: order.paymentStatus || "unpaid",
      paymentMethod: order.paymentMethod || "card",
      deliveryMethod: order.deliveryMethod || "delivery",
      stage: order.stage || "MEASURING",
      stageIndex: order.stageIndex || 0,
      estCompletion: order.estCompletion || "IN PROGRESS",
      category: order.category || "active",
      deliveryName: order.deliveryName || "",
      deliveryAddress: order.deliveryAddress || "",
      price: order.price || 0,
    });
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/api/admin/orders/${editOrder._id}`, editForm);
      toast.success("Order updated");
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/orders/${id}`);
      toast.success("Order deleted");
      setDeleteConfirm(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="SHIPPED">Shipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Order No</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Customer</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Tailor</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Product</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Payment</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Delivery</th>
                  <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Price</th>
                  <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-8 text-gray-500 text-sm">No orders found</td></tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5 text-sm text-purple-400 font-mono">{o.orderNo}</td>
                      <td className="px-6 py-3.5 text-sm text-white">{o.user?.userFullName || o.customerName || "—"}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{o.tailor?.tailorName || o.tailorName || "—"}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{o.product?.productName || o.productName || "—"}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || "bg-gray-500/10 text-gray-400"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          o.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-400 capitalize">{o.deliveryMethod}</td>
                      <td className="px-6 py-3.5 text-sm text-white text-right font-medium">${o.price || 0}</td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(o)} className="px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(o._id)} className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditOrder(null)}>
          <div className="bg-[#16161e] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Edit Order</h3>
            <p className="text-sm text-purple-400 font-mono mb-4">{editOrder.orderNo}</p>
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              {/* Payment Status */}
              <div>
                <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Payment Status</label>
                <select
                  value={editForm.paymentStatus}
                  onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {/* Delivery Method */}
              <div>
                <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Delivery Method</label>
                <select
                  value={editForm.deliveryMethod}
                  onChange={(e) => setEditForm({ ...editForm, deliveryMethod: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none"
                >
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                </select>
              </div>
              {/* Category */}
              <div>
                <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="archive">Archive</option>
                  <option value="drafts">Drafts</option>
                </select>
              </div>
              {/* Other fields */}
              {[
                { label: "Stage", key: "stage", type: "text" },
                { label: "Stage Index", key: "stageIndex", type: "number" },
                { label: "Est. Completion", key: "estCompletion", type: "text" },
                { label: "Delivery Name", key: "deliveryName", type: "text" },
                { label: "Delivery Address", key: "deliveryAddress", type: "text" },
                { label: "Price", key: "price", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">{label}</label>
                  <input
                    type={type}
                    value={editForm[key] ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdate} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all">
                Save Changes
              </button>
              <button onClick={() => setEditOrder(null)} className="flex-1 py-2.5 bg-white/[0.06] text-gray-400 rounded-xl text-sm font-semibold hover:bg-white/[0.1] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-[#16161e] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Order?</h3>
            <p className="text-sm text-gray-400 mb-6">This will permanently delete this order and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-500 transition-all">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/[0.06] text-gray-400 rounded-xl text-sm font-semibold hover:bg-white/[0.1] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
