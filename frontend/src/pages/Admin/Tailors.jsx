import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const Tailors = () => {
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editTailor, setEditTailor] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTailors = async () => {
    try {
      const res = await api.get("/api/admin/tailors");
      setTailors(res.data.tailors);
    } catch {
      toast.error("Failed to fetch tailors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTailors(); }, []);

  const filtered = tailors.filter((t) =>
    t.tailorName?.toLowerCase().includes(search.toLowerCase()) ||
    t.tailorEmail?.toLowerCase().includes(search.toLowerCase()) ||
    t.tailorMobileNumber?.includes(search) ||
    t.shopName?.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (tailor) => {
    setEditTailor(tailor);
    setEditForm({
      tailorName: tailor.tailorName || "",
      tailorEmail: tailor.tailorEmail || "",
      tailorMobileNumber: tailor.tailorMobileNumber || "",
      professionalTitle: tailor.professionalTitle || "",
      shopName: tailor.shopName || "",
      shopAddress: tailor.shopAddress || "",
      shopDescription: tailor.shopDescription || "",
      yearsOfExperience: tailor.yearsOfExperience || 0,
      identityStatus: tailor.identityStatus || "Verified",
    });
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/api/admin/tailors/${editTailor._id}`, editForm);
      toast.success("Tailor updated");
      setEditTailor(null);
      fetchTailors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/tailors/${id}`);
      toast.success("Tailor deleted");
      setDeleteConfirm(null);
      fetchTailors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tailors</h1>
          <p className="text-sm text-gray-500 mt-1">{tailors.length} total tailors</p>
        </div>
        <input
          type="text"
          placeholder="Search tailors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-purple-500/40"
        />
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
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Tailor</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Email</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Phone</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Shop</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Experience</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500 text-sm">No tailors found</td></tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center text-purple-400 text-xs font-bold">
                            {t.tailorName?.charAt(0)?.toUpperCase() || "T"}
                          </div>
                          <div>
                            <span className="text-sm text-white font-medium">{t.tailorName}</span>
                            <p className="text-[11px] text-gray-500">{t.professionalTitle || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{t.tailorEmail}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{t.tailorMobileNumber}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{t.shopName || "—"}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{t.yearsOfExperience || 0} yrs</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.identityStatus === "Verified" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {t.identityStatus || "Verified"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(t)} className="px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(t._id)} className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors">
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
      {editTailor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditTailor(null)}>
          <div className="bg-[#16161e] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Edit Tailor</h3>
            <div className="space-y-4">
              {[
                { label: "Name", key: "tailorName", type: "text" },
                { label: "Email", key: "tailorEmail", type: "email" },
                { label: "Phone", key: "tailorMobileNumber", type: "text" },
                { label: "Professional Title", key: "professionalTitle", type: "text" },
                { label: "Shop Name", key: "shopName", type: "text" },
                { label: "Shop Address", key: "shopAddress", type: "text" },
                { label: "Shop Description", key: "shopDescription", type: "text" },
                { label: "Years of Experience", key: "yearsOfExperience", type: "number" },
                { label: "Identity Status", key: "identityStatus", type: "text" },
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
              <button onClick={() => setEditTailor(null)} className="flex-1 py-2.5 bg-white/[0.06] text-gray-400 rounded-xl text-sm font-semibold hover:bg-white/[0.1] transition-all">
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Tailor?</h3>
            <p className="text-sm text-gray-400 mb-6">This will permanently delete this tailor and cannot be undone.</p>
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

export default Tailors;
