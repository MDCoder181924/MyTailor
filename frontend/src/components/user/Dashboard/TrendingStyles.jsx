import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../../utils/productUtils";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isNaN(numericPrice) ? "Price on request" : `$${numericPrice}`;
};

const getSafeImage = (image) => {
  if (typeof image !== "string") {
    return fallbackImage;
  }

  const trimmed = image.trim();
  return trimmed || fallbackImage;
};

const TrendingStyles = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const allProducts = await getProducts();

        if (isMounted) {
          setProducts(Array.isArray(allProducts) ? allProducts : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load tailor products");
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

  const visibleProducts = useMemo(() => products.slice(0, 10), [products]);
  const loopData = useMemo(() => [...visibleProducts, ...visibleProducts], [visibleProducts]);

  useEffect(() => {
    if (!loopData.length) {
      return undefined;
    }

    const container = scrollRef.current;
    let intervalId = null;

    const scroll = () => {
      if (!container) {
        return;
      }

      container.scrollLeft += 0.5;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2;
      }
    };

    intervalId = window.setInterval(scroll, 16);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [loopData]);

  const handleProductSelect = (product) => {
    navigate(`/OrdarProduct?productId=${product._id}`, {
      state: { product },
    });
  };

  return (
    <div className="bg-black px-6 py-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Trending Styles</h2>
        <span
          className="cursor-pointer text-sm text-yellow-400"
          onClick={() => navigate("/explore")}
        >
          View All
        </span>
      </div>

      {loading ? (
        <div className="py-10 text-sm text-gray-400">Loading tailor products...</div>
      ) : null}

      {!loading && error ? (
        <div className="py-10 text-sm text-red-400">{error}</div>
      ) : null}

      {!loading && !error && visibleProducts.length === 0 ? (
        <div className="py-10 text-sm text-gray-400">Tailor products not available yet.</div>
      ) : null}

      {!loading && !error && visibleProducts.length > 0 ? (
        <div ref={scrollRef} className="no-scrollbar flex gap-6 overflow-x-auto will-change-transform">
          {loopData.map((item, index) => (
            <button
              key={`${item._id}-${index}`}
              type="button"
              onClick={() => handleProductSelect(item)}
              className="min-w-[250px] text-left"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={getSafeImage(item.image)}
                  alt={item.productName}
                  loading="lazy"
                  className="h-[320px] w-full object-cover"
                />
                {index % 2 === 0 ? (
                  <span className="absolute bottom-3 left-3 rounded-md bg-yellow-400 px-3 py-1 text-xs font-medium text-black">
                    TOP PICK
                  </span>
                ) : null}
              </div>

              <div className="mt-3">
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-sm text-gray-400">
                  by {item.tailor?.tailorName || "Tailor"} | {" "}
                  <span className="text-yellow-400">{formatPrice(item.price)}</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TrendingStyles;
