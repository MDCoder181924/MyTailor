import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Ruler, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "../../components/user/Dashboard/HeaderDashboard";
import PhoneFooter from "../../components/user/Dashboard/PhoneFotter";
import { getCart, removeFromCart, clearCart } from "../../utils/cartUtils";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isNaN(numericPrice) ? "Price on request" : `$${numericPrice}`;
};

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadCartItems = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCartItems();
    window.addEventListener("cart-updated", loadCartItems);
    return () => window.removeEventListener("cart-updated", loadCartItems);
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleOrderProduct = (product) => {
    navigate(`/OrdarProduct?productId=${product._id}`, {
      state: { product },
    });
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price);
    return acc + (Number.isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="bg-theme-bg min-h-screen pb-24 text-theme-text flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-theme-text-muted hover:text-theme-accent transition"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
        </div>

        <h1 className="text-3xl font-bold font-serif mb-8 text-theme-text flex items-center gap-3">
          <ShoppingBag className="text-theme-accent" size={28} />
          Your Bag
          <span className="text-xs bg-theme-panel text-theme-text-muted border border-theme-border px-3 py-1 rounded-full font-sans font-medium">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="rounded-xl border border-theme-border bg-theme-panel p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-theme-bg flex items-center justify-center mx-auto text-theme-text-muted">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-theme-text">Your Bespoke Bag is Empty</h2>
              <p className="text-sm text-theme-text-muted font-light">
                Explore our portfolios and categories to collect premium tailor designs.
              </p>
            </div>
            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-2 rounded-full bg-theme-accent px-6 py-2.5 text-xs font-bold text-theme-bg hover:opacity-90 transition cursor-pointer uppercase tracking-wider"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="space-y-4 md:col-span-8">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`rounded-xl border border-theme-border bg-theme-panel flex overflow-hidden transition hover:border-theme-accent/30 ${
                    isMobile ? "flex-col" : "items-center"
                  }`}
                >
                  {/* Visual */}
                  <div
                    className={`bg-theme-bg relative ${
                      isMobile ? "w-full h-48" : "w-32 h-36 flex-shrink-0"
                    }`}
                  >
                    <img
                      src={item.image || fallbackImage}
                      alt={item.productName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-theme-accent uppercase tracking-widest block mb-0.5">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-semibold text-theme-text">{item.productName}</h3>
                      {item.tailor?.tailorName && (
                        <p className="text-xs text-theme-text-muted mt-0.5">
                          By <span className="text-theme-text">{item.tailor.tailorName}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-theme-accent">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`p-5 flex gap-3 border-theme-border ${
                      isMobile
                        ? "border-t w-full"
                        : "border-l flex-col w-48 min-w-48 align-middle justify-center"
                    }`}
                  >
                    <button
                      onClick={() => handleOrderProduct(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-theme-accent px-4 py-2 text-xs font-bold text-theme-bg hover:opacity-90 transition cursor-pointer uppercase tracking-wider"
                    >
                      <Ruler size={13} />
                      Order Now
                    </button>
                    
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your bag?")) {
                      clearCart();
                    }
                  }}
                  className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
                >
                  Clear all bag items
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="md:col-span-4 rounded-xl border border-theme-border bg-theme-panel p-5 space-y-5">
              <h2 className="text-lg font-semibold font-serif border-b border-theme-border pb-2.5 text-theme-text">
                Summary
              </h2>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-theme-text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-theme-text-muted">
                  <span>Shipping & Delivery</span>
                  <span className="text-emerald-500 font-medium text-xs uppercase tracking-wider">Free</span>
                </div>
                <hr className="border-theme-border" />
                <div className="flex justify-between text-base font-bold text-theme-accent pt-1">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-theme-bg border border-theme-border p-3 text-xs text-theme-text-muted leading-relaxed font-light">
                ⚠️ Sizing, brand preferences, fabric choices, and custom measurement charts are configured individually for each item when placing your order. Click "Order Now" next to any garment to configure and complete checkout.
              </div>

              <button
                onClick={() => navigate("/explore")}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-theme-border bg-theme-bg py-3 font-semibold text-theme-text transition hover:bg-theme-panel cursor-pointer text-xs uppercase tracking-widest"
              >
                Continue Browsing
              </button>
            </div>

          </div>
        )}
      </main>

      <PhoneFooter />
    </div>
  );
}
