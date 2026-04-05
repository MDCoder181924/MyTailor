import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { getProducts } from "../../../utils/productUtils";
import { getTailors } from "../../../utils/tailorUtils";

const MAX_RESULTS = 8;

const getProductSearchText = (product) =>
  [
    product.productName,
    product.category,
    product.description,
    ...(Array.isArray(product.fabrics) ? product.fabrics : []),
    product.tailor?.tailorName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getTailorSearchText = (tailor) =>
  [
    tailor.tailorName,
    tailor.professionalTitle,
    tailor.shopName,
    tailor.shopAddress,
    tailor.tailorEmail,
    tailor.tailorMobileNumber,
    ...(Array.isArray(tailor.specializations) ? tailor.specializations : []),
    ...(Array.isArray(tailor.keySkills) ? tailor.keySkills : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const SearchBarDashbord = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let isMounted = true;

    const loadSearchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productList, tailorList] = await Promise.all([
          getProducts(),
          getTailors(),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(productList);
        setTailors(tailorList);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Search data unavailable");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSearchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setShowResults(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const productResults = products
      .filter((product) => getProductSearchText(product).includes(normalizedQuery))
      .map((product) => ({
        id: `product-${product._id}`,
        type: "Fabric",
        title: product.productName || "Tailor Product",
        subtitle: [
          product.category,
          product.tailor?.tailorName,
          Array.isArray(product.fabrics) ? product.fabrics.slice(0, 2).join(", ") : "",
        ]
          .filter(Boolean)
          .join(" • "),
        action: () =>
          navigate(`/OrdarProduct?productId=${product._id}`, {
            state: { product },
          }),
      }));

    const tailorResults = tailors
      .filter((tailor) => getTailorSearchText(tailor).includes(normalizedQuery))
      .map((tailor) => ({
        id: `tailor-${tailor._id}`,
        type: "Tailor",
        title: tailor.tailorName || "Registered Tailor",
        subtitle: [
          tailor.professionalTitle,
          tailor.shopName,
          tailor.shopAddress || tailor.tailorMobileNumber,
        ]
          .filter(Boolean)
          .join(" • "),
        action: () => navigate(`/Artisans?search=${encodeURIComponent(tailor.tailorName || normalizedQuery)}`),
      }));

    return [...productResults, ...tailorResults].slice(0, MAX_RESULTS);
  }, [navigate, normalizedQuery, products, tailors]);

  const handleSelect = (result) => {
    result.action();
    setQuery(result.title);
    setShowResults(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (!showResults || !results.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (activeIndex >= 0) {
        handleSelect(results[activeIndex]);
        return;
      }

      if (results.length > 0) {
        handleSelect(results[0]);
      }
    }

    if (event.key === "Escape") {
      setShowResults(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-center gap-3 p-4 md:h-20">
        <div className="relative w-full max-w-xl">
          <div className="flex items-center rounded-2xl bg-zinc-900 px-4 py-3">
            <Search className="mr-3 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowResults(true);
                setActiveIndex(-1);
              }}
              onFocus={() => {
                if (results.length) {
                  setShowResults(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search tailors, fabrics, products..."
              className="w-full bg-transparent text-white outline-none placeholder-gray-400"
            />
          </div>

          {showResults && normalizedQuery ? (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111] shadow-2xl shadow-black/40">
              {loading ? (
                <div className="px-4 py-4 text-sm text-gray-400">Searching...</div>
              ) : null}

              {!loading && error ? (
                <div className="px-4 py-4 text-sm text-red-400">{error}</div>
              ) : null}

              {!loading && !error && results.length === 0 ? (
                <div className="px-4 py-4 text-sm text-gray-400">
                  No tailor or fabric found for "{query}".
                </div>
              ) : null}

              {!loading && !error && results.length > 0
                ? results.map((result, index) => (
                    <button
                      key={result.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(result)}
                      className={`flex w-full items-start justify-between gap-3 border-b border-zinc-800 px-4 py-3 text-left last:border-b-0 ${
                        activeIndex === index ? "bg-zinc-900" : "bg-transparent"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{result.title}</p>
                        <p className="mt-1 text-xs text-gray-400">{result.subtitle || result.type}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          result.type === "Tailor"
                            ? "bg-teal-400/15 text-teal-300"
                            : "bg-yellow-400/15 text-yellow-300"
                        }`}
                      >
                        {result.type}
                      </span>
                    </button>
                  ))
                : null}
            </div>
          ) : null}
        </div>

        <button className="rounded-2xl bg-yellow-400 p-3 hover:bg-yellow-300">
          <SlidersHorizontal className="text-black" size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBarDashbord;
