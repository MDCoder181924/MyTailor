import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

const FABRICS = ["Silk", "Wool", "Linen", "Cashmere", "Cotton", "Velvet"];
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const CATEGORIES = ["Suits", "Shirts", "Trousers", "Jackets", "Coats", "Accessories", "Other"];

export default function UploadProduct() {
  const { tailor } = useContext(AuthContext);
  const [imgStore , setimgStore] = useState(null);
  const [description, setDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Suits");
  const [prise, setPrise] = useState("");
  const [stock, setStock] = useState("");
  const [selectedFabrics, setSelectedFabrics] = useState(["Silk"]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
      alert("Please upload a valid image file (JPG, PNG, etc.)");
    }
  };

  const toggleFabric = (f) =>
    setSelectedFabrics((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const toggleSize = (s) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
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
    setSelectedSizes([]);
    setMediaPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tailor?._id) {
      alert("Please login as tailor first.");
      return;
    }

    if (!productName.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (prise === "" || Number(prise) < 0) {
      alert("Please enter valid price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      alert("Please enter valid stock.");
      return;
    }

    try {
      setIsSubmitting(true);

      const image = await fileToBase64(imgStore);
      const res = await fetch(`${apiBaseUrl}/api/products`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: productName.trim(),
          description: description.trim(),
          category,
          price: Number(prise),
          stock: Number(stock),
          fabrics: selectedFabrics,
          sizes: selectedSizes,
          image,
        }),
      });

      const rawResponse = await res.text();
      let data = {};

      try {
        data = rawResponse ? JSON.parse(rawResponse) : {};
      } catch {
        data = { message: rawResponse || "Unexpected server response" };
      }

      if (!res.ok) {
        alert(data.message || "Product save failed");
        return;
      }

      alert("Product saved successfully");
      resetForm();
    } catch (err) {
      alert("Server error while saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        // background: "linear-gradient(180deg, #0A0A0A 0%, #000000 100%)",
        background: "#000000",
        minHeight: "10-0vh",
        color: "#F5F5F5",
      }}
      className="px-6 py-10"
    >

      <div className="max-w-5xl mx-auto mb-10">
        <p className="text-xs tracking-widest mb-2 text-[#D4A017] uppercase">
          CURATION
        </p>
        <h1 className="text-5xl font-serif font-bold mb-3">
          Upload New Product
        </h1>
        <p className="text-[#7A7A7A] text-sm max-w-md">
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
              backgroundColor: "#101010",
              border: "2px dashed",
              borderColor: dragging ? "#D4A017" : "#2A2A2A",
              boxShadow: dragging
                ? "0 0 15px rgba(212,160,23,0.3)"
                : "none",
              minHeight: 260,
            }}
            className="rounded-2xl flex flex-col items-center justify-center cursor-pointer transition"
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
                <p className="font-semibold text-lg mb-1 text-center">
                  Drag and drop garment imagery
                </p>
                <p className="text-[#7A7A7A] text-xs text-center px-6">
                  JPG, PNG up to 50MB
                </p>

                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm"
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
            className="w-full h-40 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 text-sm outline-none focus:border-[#D4A017]"
          />

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* Card */}
          <div className="bg-[#141414] border border-[#2A2A2A] p-5 rounded-xl shadow-lg">
            <h2 className="mb-4 font-semibold">Product Details</h2>

            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              required
              className="w-full mb-3 bg-[#0D0D0D] border border-[#2A2A2A] p-2 rounded focus:border-[#D4A017]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] p-2 rounded"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Economics */}
          <div className="bg-[#141414] border border-[#2A2A2A] p-5 rounded-xl shadow-lg">
            <h2 className="mb-4 font-semibold">Economics & Material</h2>

            <div className="flex gap-3 mb-4">
              <input
              value = {prise}
              onChange={(e) => setPrise(e.target.value)}
                placeholder="$0.00"
                type="number"
                min="0"
                required
                className="w-1/2 bg-[#0D0D0D] border border-[#2A2A2A] p-2 rounded"
              />
              <input
              value={stock}
              onChange={(e)=>{setStock(e.target.value)}}
                placeholder="Stock"
                type="number"
                min="0"
                required
                className="w-1/2 bg-[#0D0D0D] border border-[#2A2A2A] p-2 rounded"
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
                    className={`px-3 py-1 text-xs rounded ${active
                      ? "bg-[#D4A017] text-black"
                      : "bg-[#111] text-gray-400"
                      }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-[#141414] border border-[#2A2A2A] p-5 rounded-xl shadow-lg">
            <h2 className="mb-4 font-semibold">Sizing Availability</h2>

            <div className="flex gap-2">
              {SIZES.map((s) => {
                const active = selectedSizes.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`flex-1 py-2 rounded ${active
                      ? "bg-[#D4A017] text-black"
                      : "bg-[#111] text-gray-400"
                      }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#D4A017] text-black font-semibold shadow-lg hover:bg-[#b89212] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "SAVING PRODUCT..." : "PUBLISH TO GALLERY"}
          </button>

        </div>
      </div>
    </form>
  );
}
