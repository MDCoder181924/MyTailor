import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Apple, ArrowLeft, Banknote, CreditCard, Wallet, Ruler } from "lucide-react";
import { getProducts } from "../../../utils/productUtils";
import { createOrder } from "../../../utils/orderUtils";
import {
  BRANDS,
  SIZE_OPTIONS,
  CUSTOM_MEASUREMENT_FIELDS,
  getClothingType,
  getSizeChart,
} from "../../../data/sizeData";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice)) return "Price on request";
  return `$${numericPrice}`;
};

const getSafeImage = (image) => {
  if (typeof image !== "string") return fallbackImage;
  const trimmed = image.trim();
  if (!trimmed) return fallbackImage;
  return trimmed;
};

// ─── Size Chart Modal ─────────────────────────────────────────
function SizeChartModal({
  isOpen,
  onClose,
  clothingType,
  selectedBrand,
  onSelectBrand,
  selectedSize,
  onSelectSize,
}) {
  if (!isOpen) return null;

  const chart = getSizeChart(selectedBrand, clothingType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e121a] p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-yellow-400 mb-1">{chart.title}</h3>
        <p className="text-xs text-gray-400 mb-4">
          Click any row to select that size. Switch brands below.
        </p>

        {/* Brand pills inside modal */}
        <div className="flex flex-wrap gap-2 mb-4">
          {BRANDS.map((brand) => {
            const isActive = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => onSelectBrand(brand.id)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-yellow-400/60"
                }`}
              >
                {brand.name}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/5">
          <table className="w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-400">
                {chart.headers.map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, idx) => {
                const rowSize = row[0];
                const isSelectedRow = selectedSize && rowSize.toUpperCase() === selectedSize.toUpperCase();
                return (
                  <tr
                    key={idx}
                    className={`border-b border-white/5 transition-colors ${
                      isSelectedRow
                        ? "bg-yellow-400/10 text-yellow-300 font-semibold cursor-pointer hover:bg-yellow-400/20"
                        : "cursor-pointer hover:bg-white/5"
                    }`}
                    onClick={() => {
                      onSelectSize(rowSize);
                      onClose();
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3">{cell}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <span className="text-xs text-gray-500 italic">
            * Highlighted row = current selection
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-yellow-400 px-5 py-2 text-xs font-bold text-black hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Measurements Panel ────────────────────────────────
function CustomMeasurementsPanel({ clothingType, measurements, onChange }) {
  const fields = CUSTOM_MEASUREMENT_FIELDS[clothingType] || CUSTOM_MEASUREMENT_FIELDS.tshirt;

  return (
    <div className="mt-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
      <p className="text-xs text-yellow-300 font-bold uppercase tracking-wider mb-3">
        📏 Your Custom Measurements
      </p>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
              {field.label} ({field.unit})
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder={field.placeholder}
              value={measurements[field.key] || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-yellow-400 transition"
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-gray-500 italic">
        Tailor will use these measurements for a perfect fit.
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function OrderProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState("card");
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedFabric, setSelectedFabric] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("standard");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [showCustomMeasurements, setShowCustomMeasurements] = useState(false);
  const [customMeasurements, setCustomMeasurements] = useState({});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "Customer",
    address: "Enter delivery address",
  });
  const [loading, setLoading] = useState(!location.state?.product);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const productId = searchParams.get("productId");

  // Derive the clothing type from the product category
  const clothingType = useMemo(
    () => getClothingType(product?.category),
    [product?.category]
  );

  // Available sizes for this clothing type
  const availableSizes = useMemo(
    () => SIZE_OPTIONS[clothingType] || SIZE_OPTIONS.tshirt,
    [clothingType]
  );

  // Load product
  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
      setLoading(false);
      return;
    }
    if (!productId) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    const loadProduct = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        const found = products.find((item) => item._id === productId);
        if (isMounted) setProduct(found || null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProduct();
    return () => { isMounted = false; };
  }, [location.state, productId]);

  // Set defaults when product or clothing type changes
  useEffect(() => {
    const fabrics = Array.isArray(product?.fabrics) ? product.fabrics.filter(Boolean) : [];
    setSelectedFabric((current) => (fabrics.includes(current) ? current : fabrics[0] || ""));

    // Default to first available size
    const sizes = SIZE_OPTIONS[clothingType] || [];
    setSelectedSize((current) => (sizes.includes(current) ? current : sizes[0] || ""));

    // Reset custom measurements when clothing type changes
    setCustomMeasurements({});
    setShowCustomMeasurements(false);
  }, [product, clothingType]);

  // Load user details
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;
      setShippingDetails({
        fullName: parsedUser?.userFullName || parsedUser?.name || "Customer",
        address: parsedUser?.address || parsedUser?.location || "Enter delivery address",
      });
    } catch {
      setShippingDetails({ fullName: "Customer", address: "Enter delivery address" });
    }
  }, []);

  const totalPrice = useMemo(() => {
    const numericPrice = Number(product?.price);
    return Number.isNaN(numericPrice) ? null : numericPrice;
  }, [product]);

  const handleGoBack = () => {
    if (window.history.length > 1) { navigate(-1); return; }
    navigate("/deshboard");
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomMeasurementChange = (key, value) => {
    setCustomMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const handleCompletePayment = async () => {
    if (!product) {
      setSubmitError("No product selected.");
      return;
    }

    const tailorId =
      product.tailor?._id || product.tailor?.id ||
      (typeof product.tailor === "string" ? product.tailor : "") || "";

    if (!tailorId) {
      setSubmitError("This product is missing tailor details.");
      return;
    }

    if (!shippingDetails.fullName.trim() || !shippingDetails.address.trim()) {
      setSubmitError("Please enter delivery name and address.");
      setIsEditingAddress(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Build size string with brand name
      const sizeStr = selectedSize && selectedBrand !== "standard"
        ? `${selectedSize} (${BRANDS.find((b) => b.id === selectedBrand)?.name})`
        : selectedSize;

      // Only send custom measurements if they have actual values
      const hasCustom = showCustomMeasurements &&
        Object.values(customMeasurements).some((v) => v && String(v).trim());
      const cleanMeasurements = hasCustom
        ? Object.fromEntries(
            Object.entries(customMeasurements).filter(([, v]) => v && String(v).trim())
          )
        : null;

      await createOrder({
        productId: product._id,
        selectedFabric: selectedFabric || "",
        selectedSize: sizeStr,
        selectedBrand: BRANDS.find((b) => b.id === selectedBrand)?.name || "Standard",
        clothingType,
        customMeasurements: cleanMeasurements,
        deliveryName: shippingDetails.fullName.trim(),
        deliveryAddress: shippingDetails.address.trim(),
        paymentMethod: payment,
      });

      window.dispatchEvent(new Event("user-orders-updated"));
      window.dispatchEvent(new Event("tailor-orders-updated"));
      window.dispatchEvent(new Event("tailor-notifications-updated"));
      navigate("/OrderList");
    } catch (error) {
      console.error("Order save failed", error);
      setSubmitError(error?.message || "Order save failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] text-gray-300">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b0f17] p-6 text-center text-gray-300">
        <button type="button" onClick={handleGoBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-yellow-400 hover:text-yellow-300">
          <ArrowLeft size={16} /> Back
        </button>
        <div>No product selected. Please go back and choose a tailor product first.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] p-6 text-white">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-12 items-start">

        {/* ── LEFT COLUMN: Product Visual & Info (5 cols) ── */}
        <div className="space-y-6 md:col-span-5 md:sticky md:top-6">
          <button type="button" onClick={handleGoBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-yellow-400 hover:text-yellow-300">
            <ArrowLeft size={16} /> Back
          </button>

          {/* Product card */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4 shadow-xl">
            {/* Product image with restricted height */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d111a] flex items-center justify-center max-h-[400px]">
              <img src={getSafeImage(product.image)} alt={product.productName}
                className="w-full object-cover object-top hover:scale-105 transition-transform duration-500 max-h-[400px]" />
            </div>

            {/* Product info */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-400 font-bold">
                {product.category || "Tailor Product"}
              </p>
              <h3 className="mt-1.5 text-2xl font-semibold font-serif text-white">{product.productName}</h3>
              {product.tailor?.tailorName && (
                <p className="mt-1 text-sm text-gray-400">
                  By <span className="text-yellow-400/80 font-medium">{product.tailor.tailorName}</span>
                </p>
              )}
              {product.description && (
                <p className="mt-3 text-sm leading-relaxed text-gray-300 font-light bg-black/20 p-3 rounded-lg border border-white/5">
                  {product.description}
                </p>
              )}
            </div>

            {/* Pricing details */}
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Base Garment</span>
                <span>{formatPrice(product.price)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Courier & Fitting</span>
                <span className="text-emerald-400 font-medium uppercase tracking-wider text-[10px]">Complimentary</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-yellow-400 pt-2 border-t border-white/5">
                <span>Total Investment</span>
                <span>{totalPrice === null ? "Price on request" : `$${totalPrice}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Configuration, Shipping & Payment (7 cols) ── */}
        <div className="space-y-6 md:col-span-7">
          
          {/* Garment Configuration */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-5 shadow-xl">
            <h2 className="text-lg font-semibold border-b border-white/10 pb-2 uppercase tracking-wider text-yellow-400 font-serif">Configure Garment</h2>

            {/* Fabric selector */}
            {product.fabrics?.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <span>Material</span>
                  <span className="text-right text-[10px] font-normal lowercase italic text-gray-500">Choose fabric style</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.fabrics.map((fabric) => (
                    <button key={fabric} type="button" onClick={() => setSelectedFabric(fabric)}
                      className={`rounded-full border px-4 py-2 text-sm transition cursor-pointer ${
                        selectedFabric === fabric
                          ? "border-yellow-400 bg-yellow-400 text-black font-semibold"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/60"
                      }`}>
                      {fabric}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizing selection */}
            <div className="space-y-4">
              {/* Brand selector + Size Chart button */}
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <span>Brand Sizing Standard</span>
                  <button type="button" onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs text-yellow-400 hover:underline flex items-center gap-1 font-medium cursor-pointer">
                    <Ruler size={12} />
                    Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.slice(0, 10).map((brand) => (
                    <button key={brand.id} type="button" onClick={() => setSelectedBrand(brand.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        selectedBrand === brand.id
                          ? "border-yellow-400 bg-yellow-400 text-black font-semibold"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/60"
                      }`}>
                      {brand.name}
                    </button>
                  ))}
                  {BRANDS.length > 10 && (
                    <button type="button" onClick={() => setIsSizeChartOpen(true)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:border-yellow-400/60 transition cursor-pointer">
                      +{BRANDS.length - 10} more
                    </button>
                  )}
                </div>
              </div>

              {/* Size buttons */}
              <div className="space-y-2">
                <div className="flex justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <span>Size</span>
                  <span className="text-right text-[10px] font-normal lowercase italic text-gray-500">Choose your fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isActive = selectedSize === size;
                    const isDisabled = product.tailor?.disabledSizes?.includes(size);
                    return (
                      <button key={size} type="button" disabled={isDisabled}
                        onClick={() => setSelectedSize(size)}
                        title={isDisabled ? "Tailor cannot make this size" : ""}
                        className={`min-w-12 rounded-full border px-4 py-2 text-sm transition cursor-pointer ${
                          isDisabled
                            ? "border-red-500/20 bg-red-950/10 text-gray-500 cursor-not-allowed line-through"
                            : isActive
                              ? "border-yellow-400 bg-yellow-400 text-black font-semibold"
                              : "border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/60"
                        }`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {product.tailor?.disabledSizes?.length > 0 && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  Sizes tailor cannot make: {product.tailor.disabledSizes.join(", ")}
                </p>
              )}

              {/* Custom measurements toggle */}
              <button type="button"
                onClick={() => setShowCustomMeasurements((prev) => !prev)}
                className={`w-full rounded-lg border p-3 text-sm text-left flex items-center gap-2 transition cursor-pointer ${
                  showCustomMeasurements
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-300 font-semibold"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-yellow-400/40"
                }`}>
                <Ruler size={16} />
                {showCustomMeasurements ? "Hide Custom Measurements" : "📏 Add Your Own Measurements"}
              </button>

              {showCustomMeasurements && (
                <CustomMeasurementsPanel
                  clothingType={clothingType}
                  measurements={customMeasurements}
                  onChange={handleCustomMeasurementChange}
                />
              )}
            </div>

            {/* Selection summary */}
            {(selectedFabric || selectedSize) && (
              <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-xs space-y-1 text-gray-300">
                {selectedFabric && (
                  <p>Material: <span className="font-semibold text-yellow-300">{selectedFabric}</span></p>
                )}
                {selectedSize && (
                  <p>
                    Size: <span className="font-semibold text-yellow-300">
                      {selectedSize}
                      {selectedBrand !== "standard" && ` (${BRANDS.find((b) => b.id === selectedBrand)?.name})`}
                    </span>
                  </p>
                )}
                {showCustomMeasurements && Object.values(customMeasurements).some((v) => v) && (
                  <p>
                    Custom: <span className="font-semibold text-yellow-300">
                      {Object.entries(customMeasurements)
                        .filter(([, v]) => v)
                        .map(([k, v]) => `${k}: ${v}"`)
                        .join(", ")}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Shipping Sanctuary */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold border-b border-white/10 pb-2 uppercase tracking-wider text-yellow-400 font-serif">Shipping Sanctuary</h2>
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div className="w-full">
                <p className="text-xs text-gray-400 uppercase tracking-wider">PRIMARY RESIDENCE</p>
                {isEditingAddress ? (
                  <div className="mt-3 space-y-3">
                    <input type="text" value={shippingDetails.fullName}
                      onChange={(e) => handleShippingChange("fullName", e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded border border-white/10 bg-white/5 p-3 text-white outline-none text-sm focus:border-yellow-400 transition" />
                    <textarea value={shippingDetails.address}
                      onChange={(e) => handleShippingChange("address", e.target.value)}
                      placeholder="Delivery address" rows={3}
                      className="w-full rounded border border-white/10 bg-white/5 p-3 text-white outline-none text-sm focus:border-yellow-400 transition" />
                    <button type="button" onClick={() => setIsEditingAddress(false)}
                      className="rounded-full border border-yellow-400 px-4 py-2 text-sm text-yellow-300 transition hover:bg-yellow-400 hover:text-black cursor-pointer">
                      Save Address
                    </button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="font-semibold">{shippingDetails.fullName}</p>
                    <p className="text-xs text-gray-400">{shippingDetails.address}</p>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => setIsEditingAddress((prev) => !prev)}
                className="ml-4 self-start text-xs font-semibold text-yellow-400 hover:underline cursor-pointer uppercase tracking-wider">
                {isEditingAddress ? "CLOSE" : "CHANGE"}
              </button>
            </div>
          </div>

          {/* Wealth Exchange (Payment) */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold border-b border-white/10 pb-2 uppercase tracking-wider text-yellow-400 font-serif">Wealth Exchange</h2>
            <div className="space-y-3">
              {[
                { id: "cod", icon: Banknote, label: "Cash on Delivery" },
                { id: "paypal", icon: Wallet, label: "PayPal" },
                { id: "google", icon: Wallet, label: "Google Pay" },
                { id: "apple", icon: Apple, label: "Apple Pay" },
                { id: "card", icon: CreditCard, label: "Credit / Debit Card" },
              ].map(({ id, icon: Icon, label }) => (
                <button key={id} type="button" onClick={() => setPayment(id)}
                  className={`w-full rounded-lg border p-3 transition cursor-pointer text-sm ${
                    payment === id ? "border-yellow-400 bg-white/10" : "border-white/10 hover:border-white/20"
                  } flex items-center gap-3`}>
                  <Icon size={18} /> {label}
                </button>
              ))}
            </div>

            {payment === "card" && (
              <div className="mt-4 space-y-3">
                <input type="text" placeholder="Cardholder Name"
                  className="w-full rounded border border-white/10 bg-white/5 p-3 outline-none text-sm focus:border-yellow-400 transition" />
                <input type="text" placeholder="Card Number"
                  className="w-full rounded border border-white/10 bg-white/5 p-3 outline-none text-sm focus:border-yellow-400 transition" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY"
                    className="rounded border border-white/10 bg-white/5 p-3 text-sm focus:border-yellow-400 transition" />
                  <input type="text" placeholder="CVV"
                    className="rounded border border-white/10 bg-white/5 p-3 text-sm focus:border-yellow-400 transition" />
                </div>
              </div>
            )}

            {payment === "cod" && (
              <div className="mt-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-yellow-100">
                Pay cash when your order is delivered.
              </div>
            )}
          </div>

          {/* CTA & Submitting status */}
          <div className="pt-2">
            <button type="button" onClick={handleCompletePayment} disabled={isSubmitting}
              className="w-full rounded-lg bg-yellow-400 py-4 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer uppercase tracking-widest text-sm shadow-lg">
              {isSubmitting ? "PROCESSING TRANSACTION..." : "COMPLETE PAYMENT & ORDER ->"}
            </button>
            {submitError && <p className="mt-3 text-sm text-red-400 text-center font-medium bg-red-950/20 border border-red-500/20 p-3 rounded-lg">{submitError}</p>}
          </div>

        </div>

      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        clothingType={clothingType}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />
    </div>
  );
}
