import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { createProduct } from "../../../utils/productUtils";
import { toast } from "react-hot-toast";
import { CATEGORIES } from "../../../data/sizeData";

const FABRICS = ["Silk", "Wool", "Linen", "Cashmere", "Cotton", "Velvet"];

export default function UploadProduct() {
  const { tailor } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imgStore , setimgStore] = useState(null);
  const [description, setDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Suits");
  const [prise, setPrise] = useState("");
  const [stock, setStock] = useState("");
  const [selectedFabrics, setSelectedFabrics] = useState(["Silk"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);

  const hasPhone = tailor?.tailorMobileNumber && tailor.tailorMobileNumber.trim();
  const hasAddress = tailor?.shopAddress && tailor.shopAddress.trim();
  const needsProfileSetup = !hasPhone || !hasAddress;

  if (needsProfileSetup) {
    return (
      <div
        style={{
          background: "var(--theme-bg)",
          minHeight: "80vh",
          color: "var(--theme-text)",
        }}
        className="px-6 py-20 transition-colors duration-300 flex items-center justify-center"
      >
        <div className="max-w-md w-full bg-theme-panel border border-theme-border rounded-2xl p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold">Profile Setup Required</h2>
            <p className="text-sm text-theme-text-muted leading-relaxed font-light">
              Before you can upload products, please add your <strong>phone number</strong> and <strong>shop address</strong> in your settings so customers can contact you and receive orders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/TailorSettings")}
            className="w-full py-3.5 rounded-xl bg-theme-accent text-theme-bg font-bold shadow-lg hover:opacity-90 transition uppercase tracking-wider text-xs cursor-pointer"
          >
            Go to Profile Settings
          </button>
        </div>
      </div>
    );
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (file.type.startsWith("image/")) {
      setimgStore(file);
      setMediaPreview(URL.createObjectURL(file));
    }
    else {
      toast.error("Please upload a valid image file (JPG, PNG, etc.)");
    }
  };

  const toggleFabric = (f) =>
    setSelectedFabrics((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

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

  const resetForm = () => {
    setimgStore(null);
    setDescription("");
    setProductName("");
    setCategory("Suits");
    setPrise("");
    setStock("");
    setSelectedFabrics(["Silk"]);
    setMediaPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tailor?._id) {
      toast.error("Please login as tailor first.");
      return;
    }

    if (!productName.trim()) {
      toast.error("Please enter product name.");
      return;
    }

    if (prise === "" || Number(prise) < 0) {
      toast.error("Please enter valid price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      toast.error("Please enter valid stock.");
      return;
    }

    try {
      setIsSubmitting(true);

      const image = await fileToBase64(imgStore);
      await createProduct({
        productName: productName.trim(),
        description: description.trim(),
        category,
        price: Number(prise),
        stock: Number(stock),
        fabrics: selectedFabrics,
        image,
      });

      toast.success("Product saved successfully");
      resetForm();
    } catch (err) {
      toast.error(err.message || "Server error while saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--theme-bg)",
        minHeight: "100vh",
        color: "var(--theme-text)",
      }}
      className="px-6 py-10 transition-colors duration-300"
    >

      <div className="max-w-5xl mx-auto mb-10">
        <p className="text-xs font-bold tracking-[0.2em] mb-2 text-theme-accent uppercase">
          CURATION
        </p>
        <h1 className="text-5xl font-serif font-bold mb-3">
          Upload New Product
        </h1>
        <p className="text-theme-text-muted text-sm max-w-md font-light">
          Introduce a new masterpiece to your digital gallery.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="space-y-6">

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{
              backgroundColor: "var(--theme-panel)",
              border: "2px dashed",
              borderColor: dragging ? "var(--theme-accent)" : "var(--theme-border)",
              boxShadow: dragging
                ? "0 0 15px var(--theme-accent-muted)"
                : "none",
              minHeight: 260,
            }}
            className="rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            />

            {mediaPreview ? (
              <img src={mediaPreview} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <>
                <p className="font-semibold text-lg mb-1 text-center text-theme-text">
                  Drag and drop garment imagery
                </p>
                <p className="text-theme-text-muted text-xs text-center px-6">
                  JPG, PNG up to 50MB
                </p>

                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-semibold text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent-muted transition-colors"
                >
                  Browse Media
                </button>
              </>
            )}
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe craftsmanship..."
            className="w-full h-40 bg-theme-panel border border-theme-border rounded-xl p-4 text-sm outline-none focus:border-theme-accent transition-colors text-theme-text placeholder:text-theme-text-muted/50 resize-none leading-relaxed"
          />

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* Card */}
          <div className="bg-theme-panel border border-theme-border p-5 rounded-xl shadow-lg">
            <h2 className="mb-4 font-serif font-bold text-theme-text">Product Details</h2>

            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              required
              className="w-full mb-3 bg-theme-bg border border-theme-border p-2.5 rounded-xl outline-none focus:border-theme-accent transition-colors text-theme-text placeholder:text-theme-text-muted/50"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-theme-bg border border-theme-border p-2.5 rounded-xl outline-none focus:border-theme-accent transition-colors text-theme-text"
            >
              {CATEGORIES.map((c) => (
                <option key={c} className="bg-theme-panel text-theme-text">{c}</option>
              ))}
            </select>
          </div>

          {/* Economics */}
          <div className="bg-theme-panel border border-theme-border p-5 rounded-xl shadow-lg">
            <h2 className="mb-4 font-serif font-bold text-theme-text">Economics & Material</h2>

            <div className="flex gap-3 mb-4">
              <input
                value={prise}
                onChange={(e) => setPrise(e.target.value)}
                placeholder="$0.00"
                type="number"
                min="0"
                required
                className="w-1/2 bg-theme-bg border border-theme-border p-2.5 rounded-xl outline-none focus:border-theme-accent transition-colors text-theme-text placeholder:text-theme-text-muted/50"
              />
              <input
                value={stock}
                onChange={(e) => { setStock(e.target.value); }}
                placeholder="Stock"
                type="number"
                min="0"
                required
                className="w-1/2 bg-theme-bg border border-theme-border p-2.5 rounded-xl outline-none focus:border-theme-accent transition-colors text-theme-text placeholder:text-theme-text-muted/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {FABRICS.map((f) => {
                const active = selectedFabrics.includes(f);
                return (
                  <button
                    type="button"
                    key={f}
                    onClick={() => toggleFabric(f)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${active
                      ? "bg-theme-accent text-theme-bg border-theme-accent shadow-sm"
                      : "bg-theme-bg text-theme-text-muted border-theme-border hover:bg-theme-accent-muted hover:text-theme-accent"
                      }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-theme-accent text-theme-bg font-bold shadow-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isSubmitting ? "SAVING PRODUCT..." : "PUBLISH TO GALLERY"}
          </button>

        </div>
      </div>
    </form>
  );
}
