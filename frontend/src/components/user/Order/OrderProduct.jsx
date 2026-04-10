import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Apple, ArrowLeft, Banknote, CreditCard, Wallet } from "lucide-react";
import { getProducts } from "../../../utils/productUtils";
import { createOrder } from "../../../utils/orderUtils";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Price on request";
  }

  return `$${numericPrice}`;
};

const getSafeImage = (image, options = {}) => {
  const { allowDataUrl = true } = options;

  if (typeof image !== "string") {
    return fallbackImage;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return fallbackImage;
  }

  if (trimmed.startsWith("data:")) {
    return allowDataUrl ? trimmed : fallbackImage;
  }

  if (!allowDataUrl && trimmed.length > 2000) {
    return fallbackImage;
  }

  return trimmed;
};

export default function OrderProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState("card");
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedFabric, setSelectedFabric] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "Alexandria Vane",
    address: "742 Highclere Estate, London",
  });
  const [loading, setLoading] = useState(!location.state?.product);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const productId = searchParams.get("productId");

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
        const selectedProduct = products.find((item) => item._id === productId);

        if (isMounted) {
          setProduct(selectedProduct || null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [location.state, productId]);

  useEffect(() => {
    const fabrics = Array.isArray(product?.fabrics)
      ? product.fabrics.filter(Boolean)
      : product?.fabrics
        ? [product.fabrics]
        : [];
    const sizes = Array.isArray(product?.sizes)
      ? product.sizes.filter(Boolean)
      : product?.sizes
        ? [product.sizes]
        : [];

    setSelectedFabric((current) => (fabrics.includes(current) ? current : fabrics[0] || ""));
    setSelectedSize((current) => (sizes.includes(current) ? current : sizes[0] || ""));
  }, [product]);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;

      setShippingDetails({
        fullName:
          parsedUser?.userFullName ||
          parsedUser?.name ||
          parsedUser?.userName ||
          "Customer",
        address: parsedUser?.address || parsedUser?.location || "Enter delivery address",
      });
    } catch {
      setShippingDetails({
        fullName: "Customer",
        address: "Enter delivery address",
      });
    }
  }, []);

  const totalPrice = useMemo(() => {
    const numericPrice = Number(product?.price);
    return Number.isNaN(numericPrice) ? null : numericPrice;
  }, [product]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/deshboard");
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompletePayment = async () => {
    if (!product) {
      setSubmitError("No product selected. Please choose a product first.");
      return;
    }

    const tailorId =
      product.tailor?._id ||
      product.tailor?.id ||
      (typeof product.tailor === "string" ? product.tailor : "") ||
      "";

    if (!tailorId) {
      setSubmitError("This product is missing tailor details, so the order could not be created.");
      return;
    }

    if (!shippingDetails.fullName.trim() || !shippingDetails.address.trim()) {
      setSubmitError("Please enter delivery name and address before completing payment.");
      setIsEditingAddress(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const fabrics = Array.isArray(product.fabrics)
        ? product.fabrics
        : product.fabrics
          ? [product.fabrics]
          : [];
      const sizes = Array.isArray(product.sizes)
        ? product.sizes
        : product.sizes
          ? [product.sizes]
          : [];
      await createOrder({
        productId: product._id,
        selectedFabric: selectedFabric || fabrics[0] || "",
        selectedSize: selectedSize || sizes[0] || "",
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
        <button
          type="button"
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-yellow-400 hover:text-yellow-300"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div>No product selected. Please go back and choose a tailor product first.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] p-6 text-white">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 text-lg font-semibold">Shipping Sanctuary</h2>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div className="w-full">
                <p className="text-sm text-gray-400">PRIMARY RESIDENCE</p>
                {isEditingAddress ? (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleShippingChange("fullName", e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded border border-white/10 bg-white/5 p-3 text-white outline-none"
                    />
                    <textarea
                      value={shippingDetails.address}
                      onChange={(e) => handleShippingChange("address", e.target.value)}
                      placeholder="Delivery address"
                      rows={3}
                      className="w-full rounded border border-white/10 bg-white/5 p-3 text-white outline-none"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="rounded-full border border-yellow-400 px-4 py-2 text-sm text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="font-semibold">{shippingDetails.fullName}</p>
                    <p className="text-xs text-gray-400">
                      {shippingDetails.address}
                    </p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsEditingAddress((prev) => !prev)}
                className="ml-4 self-start text-sm text-yellow-400"
              >
                {isEditingAddress ? "CLOSE" : "CHANGE"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-lg font-semibold">Wealth Exchange</h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPayment("cod")}
                className={`w-full rounded-lg border p-3 ${
                  payment === "cod"
                    ? "border-yellow-400 bg-white/10"
                    : "border-white/10"
                } flex items-center gap-3`}
              >
                <Banknote size={18} /> Cash on Delivery
              </button>

              <button
                type="button"
                onClick={() => setPayment("paypal")}
                className={`w-full rounded-lg border p-3 ${
                  payment === "paypal"
                    ? "border-yellow-400 bg-white/10"
                    : "border-white/10"
                } flex items-center gap-3`}
              >
                <Wallet size={18} /> PayPal
              </button>

              <button
                type="button"
                onClick={() => setPayment("google")}
                className={`w-full rounded-lg border p-3 ${
                  payment === "google"
                    ? "border-yellow-400 bg-white/10"
                    : "border-white/10"
                } flex items-center gap-3`}
              >
                <Wallet size={18} /> Google Pay
              </button>

              <button
                type="button"
                onClick={() => setPayment("apple")}
                className={`w-full rounded-lg border p-3 ${
                  payment === "apple"
                    ? "border-yellow-400 bg-white/10"
                    : "border-white/10"
                } flex items-center gap-3`}
              >
                <Apple size={18} /> Apple Pay
              </button>

              <button
                type="button"
                onClick={() => setPayment("card")}
                className={`w-full rounded-lg border p-3 ${
                  payment === "card"
                    ? "border-yellow-400 bg-white/10"
                    : "border-white/10"
                } flex items-center gap-3`}
              >
                <CreditCard size={18} /> Credit / Debit Card
              </button>
            </div>

            {payment === "card" && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full rounded border border-white/10 bg-white/5 p-3 outline-none"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full rounded border border-white/10 bg-white/5 p-3 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="rounded border border-white/10 bg-white/5 p-3"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="rounded border border-white/10 bg-white/5 p-3"
                  />
                </div>
              </div>
            )}

            {payment === "cod" ? (
              <div className="mt-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-yellow-100">
                Pay cash when your order is delivered.
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold">The Selection</h2>

            <div className="mb-5 overflow-hidden rounded-xl border border-white/10">
              <img
                src={getSafeImage(product.image)}
                alt={product.productName}
                className="h-64 w-full object-cover"
              />
            </div>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                {product.category || "Tailor Product"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{product.productName}</h3>
              {product.tailor?.tailorName ? (
                <p className="mt-1 text-sm text-gray-400">
                  By {product.tailor.tailorName}
                </p>
              ) : null}
              {product.description ? (
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  {product.description}
                </p>
              ) : null}
            </div>

            <div className="mb-2 flex justify-between text-sm">
              <span>{product.productName}</span>
              <span>{formatPrice(product.price)}</span>
            </div>

            <div className="mb-2 flex justify-between text-sm text-gray-400">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            {product.fabrics?.length ? (
              <div className="mb-4">
                <div className="mb-2 flex justify-between gap-4 text-sm text-gray-400">
                  <span>Material</span>
                  <span className="text-right">Choose your fabric</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.fabrics.map((fabric) => {
                    const isActive = selectedFabric === fabric;

                    return (
                      <button
                        key={fabric}
                        type="button"
                        onClick={() => setSelectedFabric(fabric)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-yellow-400 bg-yellow-400 text-black"
                            : "border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/60"
                        }`}
                      >
                        {fabric}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {product.sizes?.length ? (
              <div className="mb-4">
                <div className="mb-2 flex justify-between gap-4 text-sm text-gray-400">
                  <span>Size</span>
                  <span className="text-right">Choose your fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isActive = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-yellow-400 bg-yellow-400 text-black"
                            : "border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/60"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {selectedFabric || selectedSize ? (
              <div className="mb-2 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-gray-300">
                {selectedFabric ? <p>Selected material: <span className="font-semibold text-yellow-300">{selectedFabric}</span></p> : null}
                {selectedSize ? <p>Selected size: <span className="font-semibold text-yellow-300">{selectedSize}</span></p> : null}
              </div>
            ) : null}

            <hr className="my-4 border-white/10" />

            <div className="flex justify-between text-xl font-bold text-yellow-400">
              <span>Total</span>
              <span>{totalPrice === null ? "Price on request" : `$${totalPrice}`}</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleCompletePayment}
              disabled={isSubmitting}
              className="mt-6 w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "PROCESSING..." : "COMPLETE PAYMENT ->"}
            </button>
            {submitError ? (
              <p className="mt-3 text-sm text-red-300">{submitError}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
