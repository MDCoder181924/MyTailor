import { useEffect, useState } from "react";
import { getMyProducts } from "../../../utils/productUtils";

export default function PortfolioGallery() {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const tailorProducts = await getMyProducts();
        setProducts(tailorProducts);
      } catch (err) {
        setError(err.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const visibleProducts = showAll ? products : products.slice(0, 6);

  return (
    <div className="bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-bold">
          The Masterpiece Gallery
        </h2>

        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-yellow-400 text-sm hover:underline"
        >
          {showAll ? "SHOW LESS" : "VIEW ARCHIVE"}
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading products...</div>
      ) : null}

      {!loading && error ? (
        <div className="py-12 text-center text-red-400">{error}</div>
      ) : null}

      {!loading && !error && visibleProducts.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          No products added yet.
        </div>
      ) : null}

      {!loading && !error && visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProducts.map((item) => (
            <div
              key={item._id}
              className="rounded-xl overflow-hidden bg-gray-900 group"
            >
              <img
                src={item.image || "https://picsum.photos/300?fashion"}
                alt={item.productName}
                className="w-full h-[220px] object-cover transition duration-300 group-hover:scale-110"
              />

              <div className="p-3">
                <p className="text-sm font-semibold">{item.productName}</p>
                <p className="text-xs text-gray-400 mt-1">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
