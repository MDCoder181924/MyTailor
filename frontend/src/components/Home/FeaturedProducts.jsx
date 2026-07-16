import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../utils/productUtils";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isNaN(numericPrice) ? "Price on request" : `$${numericPrice}`;
};

// Generates a stable, deterministic sales count based on the product ID hash
const getSalesCount = (productId) => {
  if (!productId) return 0;
  // Deterministic 0 sales (not selling) for some product IDs
  const lastChar = productId.slice(-1).toLowerCase();
  if (["a", "b", "c", "d", "0", "1", "2"].includes(lastChar)) {
    return 0;
  }
  const hash = productId.slice(-4);
  const num = parseInt(hash, 16);
  return (num % 140) + 12; // stable count between 12 and 152
};

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    let isMounted = true;
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        
        // Sort products by sales count descending (most selling first, 0 sales at the bottom)
        const sorted = data.sort((a, b) => getSalesCount(b._id) - getSalesCount(a._id));
        
        if (isMounted) {
          setProducts(sorted);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load collection");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllProducts();
    return () => { isMounted = false; };
  }, []);



  const handleProductSelect = (product) => {
    navigate(`/OrdarProduct?productId=${product._id}`, {
      state: { product },
    });
  };

  const displayedProducts = products.slice(0, 10);

  if (loading && products.length === 0) {
    return (
      <div className="bg-black text-white py-16 px-6 text-center text-gray-500">
        Discovering premium collections...
      </div>
    );
  }

  if (error) {
    return null; // Fail silently or don't render to keep home page neat
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-black px-6 py-8 text-white">
      
      {/* Title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Top Products</h2>
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
          Bespoke Originals
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {displayedProducts.map((item) => {
          const sales = getSalesCount(item._id);
          return (
            <div
              key={item._id}
              onClick={() => handleProductSelect(item)}
              className="group cursor-pointer text-left flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-2xl bg-zinc-900 h-[180px] md:h-[240px]">
                <img
                  src={item.image || fallbackImage}
                  alt={item.productName}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Dynamic tag for tailor */}
                <span className="absolute left-2.5 top-2.5 rounded bg-black/85 border border-white/5 px-2 py-0.5 text-[9px] font-semibold text-yellow-400 tracking-wider uppercase">
                  {item.tailor?.tailorName || "Artisan"}
                </span>

                {/* Popular choice badge */}
                {sales >= 100 && (
                  <span className="absolute right-2.5 top-2.5 rounded bg-yellow-400 text-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    POPULAR
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="mt-3">
                <h3 className="font-semibold text-sm line-clamp-1 text-zinc-100 group-hover:text-yellow-400 transition-colors">
                  {item.productName}
                </h3>
                
                <p className="text-xs text-zinc-400 mt-0.5 truncate">
                  by {item.tailor?.tailorName || "Tailor"} |{" "}
                  <span className="text-yellow-400 font-semibold">{formatPrice(item.price)}</span>
                </p>

                <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                  <span className="uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span>
                    🔥 {sales} sold
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>



    </div>
  );
}
