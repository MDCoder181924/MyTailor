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
    return <div className="bg-black px-8 py-10 text-center text-gray-400">Loading your products...</div>;
  }

  if (error) {
    return <div className="bg-black px-8 py-10 text-center text-red-400">{error}</div>;
  }

  if (!products.length) {
    return <div className="bg-black px-8 py-10 text-center text-gray-400">No products added yet.</div>;
  }

  return (
    <div className="bg-black p-8 text-white">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((item) => (
          <div
            key={item._id}
            className="group overflow-hidden rounded-xl bg-gray-900 shadow-lg transition hover:scale-105"
          >
            <div className="relative">
              <img
                src={item.image || fallbackImage}
                alt={item.productName}
                className="h-48 w-full object-cover"
              />

              <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-xs">
                {item.category || "Tailor Product"}
              </span>

              {Number(item.stock) <= 5 ? (
                <span className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs">
                  LOW STOCK
                </span>
              ) : null}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-tight">{item.productName}</h3>

                <span className="font-semibold text-yellow-400">{formatPrice(item.price)}</span>
              </div>

              {item.description ? (
                <p className="mt-3 line-clamp-2 text-xs text-gray-400">{item.description}</p>
              ) : null}

              <p className="mt-3 text-xs text-gray-400">Stock: {item.stock ?? 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
