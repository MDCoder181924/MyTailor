import { useEffect, useState } from "react";
import { getMyProducts, updateProduct, deleteProduct } from "../../../utils/productUtils";
import { Edit, Trash2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";

const FABRICS = ["Silk", "Wool", "Linen", "Cashmere", "Cotton", "Velvet"];
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const CATEGORIES = ["Suits", "Shirts", "Trousers", "Jackets", "Coats", "Accessories", "Other"];

const fallbackImage = "https://picsum.photos/800/600?tailor";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isNaN(numericPrice) ? "Price on request" : `$${numericPrice}`;
};

export default function FabricsGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingProduct, setCurrentEditingProduct] = useState(null);
  const [editingForm, setEditingForm] = useState({
    productName: "",
    description: "",
    category: "Suits",
    price: "",
    stock: "",
    fabrics: [],
    sizes: [],
    image: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const tailorProducts = await getMyProducts();

        if (isMounted) {
          setProducts(tailorProducts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load products");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleEditClick = (product) => {
    setCurrentEditingProduct(product);
    setEditingForm({
      productName: product.productName || "",
      description: product.description || "",
      category: product.category || "Suits",
      price: product.price || "",
      stock: product.stock || "",
      fabrics: Array.isArray(product.fabrics) ? product.fabrics : [],
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      image: product.image || "",
    });
    setImgPreview(product.image || null);
    setImgFile(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEditingProduct(null);
    setImgFile(null);
    setImgPreview(null);
  };

  const handleFormChange = (field, value) => {
    setEditingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleFabric = (f) => {
    setEditingForm((prev) => {
      const exists = prev.fabrics.includes(f);
      return {
        ...prev,
        fabrics: exists ? prev.fabrics.filter((x) => x !== f) : [...prev.fabrics, f],
      };
    });
  };

  const toggleSize = (s) => {
    setEditingForm((prev) => {
      const exists = prev.sizes.includes(s);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((x) => x !== s) : [...prev.sizes, s],
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImgFile(file);
        setImgPreview(URL.createObjectURL(file));
      } else {
        toast.error("Please upload a valid image file (JPG, PNG, etc.)");
      }
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) {
        resolve("");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingForm.productName.trim()) {
      toast.error("Please enter product name.");
      return;
    }

    if (editingForm.price === "" || Number(editingForm.price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (editingForm.stock === "" || Number(editingForm.stock) < 0) {
      toast.error("Please enter valid stock quantity.");
      return;
    }

    try {
      setIsSubmitting(true);

      let imageBase64 = editingForm.image;
      if (imgFile) {
        imageBase64 = await fileToBase64(imgFile);
      }

      const res = await updateProduct(currentEditingProduct._id, {
        productName: editingForm.productName.trim(),
        description: editingForm.description.trim(),
        category: editingForm.category,
        price: Number(editingForm.price),
        stock: Number(editingForm.stock),
        fabrics: editingForm.fabrics,
        sizes: editingForm.sizes,
        image: imageBase64,
      });

      toast.success("Product updated successfully");
      
      // Update local state list
      setProducts((prev) =>
        prev.map((p) => (p._id === currentEditingProduct._id ? res.product : p))
      );

      closeEditModal();
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="bg-theme-bg px-8 py-10 text-center text-theme-text-muted">Loading your products...</div>;
  }

  if (error) {
    return <div className="bg-theme-bg px-8 py-10 text-center text-red-500">{error}</div>;
  }

  if (!products.length) {
    return <div className="bg-theme-bg px-8 py-10 text-center text-theme-text-muted italic">No products added yet.</div>;
  }

  return (
    <div className="bg-theme-bg p-8 text-theme-text">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((item) => (
          <div
            key={item._id}
            className="group overflow-hidden rounded-xl bg-theme-panel shadow-lg border border-theme-border transition hover:scale-[1.02] duration-300"
          >
            <div className="relative">
              <img
                src={item.image || fallbackImage}
                alt={item.productName}
                className="h-48 w-full object-cover"
              />

              <span className="absolute left-2 top-2 rounded bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                {item.category || "Tailor Product"}
              </span>

              {Number(item.stock) <= 5 ? (
                <span className="absolute right-2 top-2 rounded bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  LOW STOCK
                </span>
              ) : null}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-tight text-theme-text">{item.productName}</h3>
                <span className="font-bold text-theme-accent">{formatPrice(item.price)}</span>
              </div>

              {item.description ? (
                <p className="mt-3 line-clamp-2 text-xs text-theme-text-muted font-light">{item.description}</p>
              ) : null}

              <p className="mt-3 text-xs text-theme-text-muted font-light">Stock: {item.stock ?? 0}</p>

              {/* Edit and Delete Actions */}
              <div className="mt-4 flex items-center gap-2 border-t border-theme-border pt-4">
                <button
                  type="button"
                  onClick={() => handleEditClick(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-theme-panel border border-theme-border py-2 text-xs font-semibold text-theme-text-muted hover:bg-theme-accent-muted hover:text-theme-accent transition cursor-pointer"
                >
                  <Edit size={13} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="flex items-center justify-center gap-2 rounded bg-red-600/10 border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-600 hover:text-white transition cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && currentEditingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-theme-panel p-6 shadow-2xl border border-theme-border text-theme-text max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold font-serif">Edit Product</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-theme-text-muted hover:text-theme-text cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1 font-bold">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingForm.productName}
                  onChange={(e) => handleFormChange("productName", e.target.value)}
                  className="w-full rounded border border-theme-border bg-theme-bg p-3 text-theme-text outline-none text-sm focus:border-theme-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1 font-bold">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingForm.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    className="w-full rounded border border-theme-border bg-theme-bg p-3 text-theme-text outline-none text-sm focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1 font-bold">Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingForm.stock}
                    onChange={(e) => handleFormChange("stock", e.target.value)}
                    className="w-full rounded border border-theme-border bg-theme-bg p-3 text-theme-text outline-none text-sm focus:border-theme-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1 font-bold">Category</label>
                <select
                  value={editingForm.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="w-full rounded border border-theme-border bg-theme-bg p-3 text-theme-text outline-none text-sm focus:border-theme-accent"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-theme-panel text-theme-text">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1 font-bold">Description</label>
                <textarea
                  rows="3"
                  value={editingForm.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className="w-full rounded border border-theme-border bg-theme-bg p-3 text-theme-text outline-none text-sm focus:border-theme-accent"
                />
              </div>

              {/* Fabrics Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-2 font-bold">Fabrics</label>
                <div className="flex flex-wrap gap-2">
                  {FABRICS.map((f) => {
                    const active = editingForm.fabrics.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFabric(f)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                          active
                            ? "bg-theme-accent text-white border-theme-accent"
                            : "bg-transparent border-theme-border text-theme-text-muted hover:border-theme-accent hover:text-theme-accent"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-2 font-bold">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => {
                    const active = editingForm.sizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`rounded px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          active
                            ? "bg-theme-accent text-white border border-theme-accent"
                            : "bg-transparent border border-theme-border text-theme-text-muted hover:border-theme-accent hover:text-theme-accent"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1 font-bold">Product Image</label>
                <div className="flex items-center gap-4">
                  {imgPreview && (
                    <img
                      src={imgPreview}
                      alt="Preview"
                      className="h-16 w-16 rounded-lg object-cover border border-theme-border"
                    />
                  )}
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-theme-border bg-theme-bg px-4 py-6 text-sm text-theme-text-muted hover:border-theme-accent hover:text-theme-accent transition">
                    <Upload size={18} />
                    <span>Upload new image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 border-t border-theme-border pt-4 justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded border border-theme-border bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-theme-text-muted hover:bg-theme-accent-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-theme-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
