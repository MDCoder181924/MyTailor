import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../../utils/productUtils";

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
  const [error, setError] = useState("");

  const handleProductSelect = (product) => {
    navigate(`/OrdarProduct?productId=${product._id}`, {
      state: { product },
    });
  };

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const allProducts = await getProducts();

        if (isMounted) {
          setProducts(allProducts);
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

  const selectedCategory = normalizeCategory(category);
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (item) => normalizeCategory(item.category) === selectedCategory
        );

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

  if (!filteredProducts.length) {
    return (
      <div className="px-6 py-12 text-center text-gray-400">
        No tailor products found in this category.
      </div>
    );
  }

  return (
      <div className="grid grid-cols-2 gap-2 bg-black px-6 py-6 md:mx-10 md:grid-cols-4 md:gap-10">
      {filteredProducts.map((item) => (
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
                className="h-[180px] w-full object-cover md:h-[320px]"
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
                onClick={() => handleProductSelect(item)}
                className="rounded bg-yellow-400 px-3 py-2 text-black"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryItems;
