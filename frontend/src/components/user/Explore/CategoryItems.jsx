import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExploreProducts } from "../../../utils/productUtils";
import { addToCart } from "../../../utils/cartUtils";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const normalizeCategory = (value = "") =>
  value.trim().toLowerCase().replace(/[-_]+/g, " ");

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Price on request";
  }

  return `$${numericPrice}`;
};

const buildMetaLine = (item) => {
  const meta = [];

  if (item.fabrics?.length) {
    meta.push(item.fabrics.slice(0, 2).join(" / "));
  }

  if (typeof item.stock === "number") {
    meta.push(`Stock ${item.stock}`);
  }

  return meta.length ? meta.join(" / ").toUpperCase() : "TAILOR MADE";
};

const CategoryItems = ({ category }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const requestInProgress = useRef(false);

  const handleProductSelect = (product) => {
    navigate(`/OrdarProduct?productId=${product._id}`, {
      state: { product },
    });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const added = addToCart(product);
    if (added) {
      setToastMsg(`${product.productName} added to Bag!`);
    } else {
      setToastMsg(`${product.productName} is already in your Bag!`);
    }
    setTimeout(() => setToastMsg(""), 3000);
  };

  const selectedCategory = normalizeCategory(category);
  const categoryParam = selectedCategory === "all" ? "" : category;

  const loadProducts = useCallback(async (page, replace = false) => {
    if (requestInProgress.current) return;

    requestInProgress.current = true;
    try {
      if (replace) setLoading(true);
      else setLoadingMore(true);
      setError("");
      const result = await getExploreProducts({ page, limit: 10, category: categoryParam });
      setProducts((current) => {
        if (replace) return result.products;
        const existingIds = new Set(current.map((product) => product._id));
        return [...current, ...result.products.filter((product) => !existingIds.has(product._id))];
      });
      setHasMore(result.pagination.hasMore);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      requestInProgress.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryParam]);

  useEffect(() => {
    setProducts([]);
    setHasMore(false);
    loadProducts(1, true);
  }, [loadProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || requestInProgress.current) return;

      const threshold = 300;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (clientHeight + scrollTop >= scrollHeight - threshold) {
        loadProducts(Math.floor(products.length / 10) + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadProducts, products.length]);

  if (loading) {
    return (
      <div className="px-6 py-12 text-center text-gray-400">
        Loading tailor products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="px-6 py-12 text-center text-gray-400">
        No tailor products found in this category.
      </div>
    );
  }

  return (
    <div className="bg-black py-6">
      <div className="grid grid-cols-2 gap-4 bg-black px-6 md:mx-10 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
      {products.map((item) => (
        <div key={item._id} className="bg-black text-white">
          <button
            type="button"
            onClick={() => handleProductSelect(item)}
            className="w-full text-left"
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={item.image || fallbackImage}
                alt={item.productName}
                className="h-[150px] w-full object-cover md:h-[220px] rounded-xl"
              />

              <span className="absolute left-3 top-3 rounded bg-yellow-400 px-2 py-1 text-xs text-black">
                {item.tailor?.tailorName || "Tailor Product"}
              </span>
            </div>
          </button>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{item.productName}</h3>
              <span className="font-medium text-yellow-400">
                {formatPrice(item.price)}
              </span>
            </div>

            <p className="mt-1 text-xs uppercase text-gray-400">
              {buildMetaLine(item)}
            </p>

            {item.description ? (
              <p
                className="mt-2 text-sm text-gray-300"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.description}
              </p>
            ) : null}

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleProductSelect(item)}
                className="flex-1 rounded bg-zinc-800 py-2 text-sm transition hover:bg-zinc-700"
              >
                {item.category}
              </button>

              <button
                type="button"
                onClick={(e) => handleAddToCart(e, item)}
                className="rounded bg-yellow-400 px-3 py-2 text-black cursor-pointer font-bold hover:opacity-90 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>
      {(hasMore || loadingMore) && (
        <div className="mt-8 flex justify-center items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          Scroll to load more...
        </div>
      )}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black shadow-2xl animate-bounce">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default CategoryItems;
