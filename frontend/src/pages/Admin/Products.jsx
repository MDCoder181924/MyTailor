import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/admin/products");
      setProducts(res.data.products);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter((p) =>
    p.productName?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.tailor?.tailorName?.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({
      productName: product.productName || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || 0,
      stock: product.stock || 0,
      image: product.image || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/api/admin/products/${editProduct._id}`, editForm);
      toast.success("Product updated");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/products/${id}`);
      toast.success("Product deleted");
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} total products</p>
        </div>
        <input
          type="text"
          placeholder="Search products..."
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
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Product</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Category</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Tailor</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Price</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Stock</th>
                  <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Fabrics</th>
                  <th className="text-right text-xs text-gray-500 font-semibold uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500 text-sm">No products found</td></tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover border border-white/[0.06]" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                              {p.productName?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                          )}
                          <span className="text-sm text-white font-medium">{p.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] text-gray-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{p.tailor?.tailorName || "—"}</td>
                      <td className="px-6 py-3.5 text-sm text-white font-medium">${p.price}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{p.stock}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-500 max-w-[150px] truncate">{p.fabrics?.join(", ") || "—"}</td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(p)} className="px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(p._id)} className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors">
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
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditProduct(null)}>
          <div className="bg-[#16161e] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Edit Product</h3>
            <div className="space-y-4">
              {[
                { label: "Product Name", key: "productName", type: "text" },
                { label: "Description", key: "description", type: "text" },
                { label: "Category", key: "category", type: "text" },
                { label: "Price", key: "price", type: "number" },
                { label: "Stock", key: "stock", type: "number" },
                { label: "Image URL", key: "image", type: "text" },
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
              <button onClick={() => setEditProduct(null)} className="flex-1 py-2.5 bg-white/[0.06] text-gray-400 rounded-xl text-sm font-semibold hover:bg-white/[0.1] transition-all">
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-400 mb-6">This will permanently delete this product.</p>
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

export default Products;
