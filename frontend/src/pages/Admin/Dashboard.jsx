import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";

const StatCard = ({ label, value, icon, gradient }) => (
  <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers || 0}
          gradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
          icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
        />
        <StatCard
          label="Total Tailors"
          value={stats?.totalTailors || 0}
          gradient="bg-gradient-to-br from-purple-500/20 to-violet-500/20"
          icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-3.06a.75.75 0 010-1.28l5.1-3.06a.75.75 0 01.76 0l5.1 3.06a.75.75 0 010 1.28l-5.1 3.06a.75.75 0 01-.76 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.95 17L12 21.5l8.05-4.5" /></svg>}
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts || 0}
          gradient="bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
          icon={<svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders || 0}
          gradient="bg-gradient-to-br from-amber-500/20 to-orange-500/20"
          icon={<svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>}
        />
        <StatCard
          label="Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          gradient="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
          icon={<svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-yellow-400">{stats?.pendingOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-blue-400">{stats?.activeOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Active</p>
        </div>
        <div className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-green-400">{stats?.shippedOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Shipped</p>
        </div>
        <div className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-red-400">{stats?.cancelledOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Cancelled</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Order</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Customer</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Tailor</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Product</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Payment</th>
                <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500 text-sm">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-sm text-purple-400 font-mono">{order.orderNo}</td>
                    <td className="px-6 py-3.5 text-sm text-white">{order.user?.userFullName || "—"}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-400">{order.tailor?.tailorName || "—"}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-400">{order.product?.productName || order.productName || "—"}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400" :
                        order.status === "ACCEPTED" ? "bg-blue-500/10 text-blue-400" :
                        order.status === "SHIPPED" ? "bg-green-500/10 text-green-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white text-right font-medium">${order.price || 0}</td>
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

export default Dashboard;
