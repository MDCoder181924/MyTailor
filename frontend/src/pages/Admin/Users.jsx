import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) =>
    u.userFullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    u.userMobileNumber?.includes(search)
  );

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({
      userFullName: user.userFullName || "",
      userEmail: user.userEmail || "",
      userMobileNumber: user.userMobileNumber || "",
      deliveryAddress: user.deliveryAddress || "",
      preferredStyle: user.preferredStyle || "",
      bodyNotes: user.bodyNotes || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/api/admin/users/${editUser._id}`, editForm);
      toast.success("User updated");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success("User deleted");
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} total users</p>
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#12121a] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Name</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Email</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Phone</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Address</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Joined</th>
                  <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500 text-sm">No users found</td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-xs font-bold" style={{color: '#ffffff'}}>
                            {u.userFullName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span onClick={() => navigate(`/admin/users/${u._id}`)} className="text-sm font-medium hover:underline cursor-pointer" style={{color: '#ffffff'}}>{u.userFullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{u.userEmail}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{u.userMobileNumber || "—"}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400 max-w-[200px] truncate">{u.deliveryAddress || "—"}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => navigate(`/admin/users/${u._id}`)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-white/[0.12] border border-white/[0.15]" style={{color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)'}}>
                            View
                          </button>
                          <button onClick={() => openEdit(u)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-white/[0.08] border border-white/[0.1]" style={{color: '#d1d5db', backgroundColor: 'rgba(255,255,255,0.04)'}}>
                            Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(u._id)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-white/[0.06] border border-white/[0.1]" style={{color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.03)'}}>
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
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditUser(null)}>
          <div className="bg-[#16161e] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Edit User</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "userFullName", type: "text" },
                { label: "Email", key: "userEmail", type: "email" },
                { label: "Phone", key: "userMobileNumber", type: "text" },
                { label: "Delivery Address", key: "deliveryAddress", type: "text" },
                { label: "Preferred Style", key: "preferredStyle", type: "text" },
                { label: "Body Notes", key: "bodyNotes", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">{label}</label>
                  <input
                    type={type}
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdate} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all">
                Save Changes
              </button>
              <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 bg-white/[0.06] text-gray-400 rounded-xl text-sm font-semibold hover:bg-white/[0.1] transition-all">
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
            <h3 className="text-lg font-bold text-white mb-2">Delete User?</h3>
            <p className="text-sm text-gray-400 mb-6">This action cannot be undone. All data for this user will be permanently removed.</p>
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

export default Users;
