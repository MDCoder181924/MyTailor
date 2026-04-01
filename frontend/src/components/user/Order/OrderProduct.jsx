import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Apple, CreditCard, Wallet } from "lucide-react";
import { getProducts } from "../../../utils/productUtils";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Price on request";
  }

  return `$${numericPrice}`;
};

export default function OrderProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState("card");
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);

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

  const totalPrice = useMemo(() => {
    const numericPrice = Number(product?.price);
    return Number.isNaN(numericPrice) ? null : numericPrice;
  }, [product]);

  const handleCompletePayment = () => {
    const rawUser = localStorage.getItem("user");
    let userId = "guest";
    let customerName = "Customer";

    try {
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;
      userId = parsedUser?._id || "guest";
      customerName = parsedUser?.userFullName || "Customer";
    } catch {
      userId = "guest";
      customerName = "Customer";
    }

    const storageKey = `orders_${userId}`;
    const tailorStorageKey = `tailor_orders_${product.tailor?._id || "unknown"}`;
    const existingOrders = (() => {
      try {
        const value = localStorage.getItem(storageKey);
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
      }
    })();
    const existingTailorOrders = (() => {
      try {
        const value = localStorage.getItem(tailorStorageKey);
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
      }
    })();

    const nextOrder = {
      id: `local-${Date.now()}`,
      orderNo: `#ORD-${String(Date.now()).slice(-6)}`,
      estCompletion: "IN PROGRESS",
      title: product.productName,
      tailor: product.tailor?.tailorName || "Assigned Tailor",
      price: formatPrice(product.price),
      stage: "MEASURING",
      stageIndex: 0,
      img: product.image || fallbackImage,
      actions: [
        { label: "Track Order", primary: true },
        { label: "View Details", primary: false },
      ],
      quickLinks: [
        { icon: "MSG", label: "Message Tailor" },
        { icon: "FAB", label: "Fabric Specs" },
      ],
      category: "active",
      createdAt: new Date().toISOString(),
    };

    const tailorOrder = {
      id: nextOrder.orderNo,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      name: customerName,
      product: product.productName,
      desc: [product.category, ...(product.fabrics || [])].filter(Boolean).join(" • "),
      status: "PENDING",
      total: formatPrice(product.price),
      productImage: product.image || fallbackImage,
    };

    localStorage.setItem(storageKey, JSON.stringify([nextOrder, ...existingOrders]));
    localStorage.setItem(tailorStorageKey, JSON.stringify([tailorOrder, ...existingTailorOrders]));
    navigate("/OrderList");
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
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] p-6 text-center text-gray-300">
        No product selected. Please go back and choose a tailor product first.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] p-6 text-white">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 text-lg font-semibold">Shipping Sanctuary</h2>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div>
                <p className="text-sm text-gray-400">PRIMARY RESIDENCE</p>
                <p className="font-semibold">Alexandria Vane</p>
                <p className="text-xs text-gray-400">
                  742 Highclere Estate, London
                </p>
              </div>
              <button className="text-sm text-yellow-400">CHANGE</button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-lg font-semibold">Wealth Exchange</h2>

            <div className="space-y-3">
              <button
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
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold">The Selection</h2>

            <div className="mb-5 overflow-hidden rounded-xl border border-white/10">
              <img
                src={product.image || fallbackImage}
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
              <div className="mb-2 flex justify-between gap-4 text-sm text-gray-400">
                <span>Fabric</span>
                <span className="text-right">{product.fabrics.join(", ")}</span>
              </div>
            ) : null}

            {product.sizes?.length ? (
              <div className="mb-2 flex justify-between gap-4 text-sm text-gray-400">
                <span>Sizes</span>
                <span className="text-right">{product.sizes.join(", ")}</span>
              </div>
            ) : null}

            <hr className="my-4 border-white/10" />

            <div className="flex justify-between text-xl font-bold text-yellow-400">
              <span>Total</span>
              <span>{totalPrice === null ? "Price on request" : `$${totalPrice}`}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompletePayment}
            className="mt-6 w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black hover:opacity-90"
          >
            {"COMPLETE PAYMENT ->"}
          </button>
        </div>
      </div>
    </div>
  );
}
