import { useState, useRef } from "react";

const FABRICS = ["Silk", "Wool", "Linen", "Cashmere", "Cotton", "Velvet"];
const SIZES = ["S", "M", "L", "XL", "2XL"];
const CATEGORIES = ["Suits", "Shirts", "Trousers", "Jackets", "Coats", "Accessories" ,"Other"];

export default function UploadProduct() {
  const [dragging, setDragging] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Suits");
  const [basePrice, setBasePrice] = useState("");
  const [fabricStock, setFabricStock] = useState("");
  const [selectedFabrics, setSelectedFabrics] = useState(["Silk"]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (file.type.startsWith("image/")) {
      setMediaPreview(URL.createObjectURL(file));
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

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #000000 100%)",
        minHeight: "100vh",
        color: "#F5F5F5",
      }}
      className="px-6 py-10"
    >

      {/* Header */}
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

        {/* LEFT */}
        <div className="space-y-6">

          {/* Upload Box */}
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
                {/* <div className="bg-[#D4A017] p-3 rounded-xl mb-4">
                  ⬆️
                </div> */}

                <p className="font-semibold text-lg mb-1 text-center">
                  Drag and drop garment imagery
                </p>
                <p className="text-[#7A7A7A] text-xs text-center px-6">
                  JPG, PNG up to 50MB
                </p>

                <button
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
                placeholder="$0.00"
                className="w-1/2 bg-[#0D0D0D] border border-[#2A2A2A] p-2 rounded"
              />
              <input
                placeholder="Stock"
                className="w-1/2 bg-[#0D0D0D] border border-[#2A2A2A] p-2 rounded"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {FABRICS.map((f) => {
                const active = selectedFabrics.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => toggleFabric(f)}
                    className={`px-3 py-1 text-xs rounded ${
                      active
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
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`flex-1 py-2 rounded ${
                      active
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
          <button className="w-full py-3 rounded-xl bg-[#D4A017] text-black font-semibold shadow-lg hover:bg-[#b89212] transition">
            PUBLISH TO GALLERY
          </button>

        </div>
      </div>
    </div>
  );
}