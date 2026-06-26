import { useEffect, useState } from "react";
import { getMyProducts } from "../../../utils/productUtils";

const fallbackImage = "https://picsum.photos/800/600?tailor";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isNaN(numericPrice) ? "Price on request" : `$${numericPrice}`;
};

export default function FabricsGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
