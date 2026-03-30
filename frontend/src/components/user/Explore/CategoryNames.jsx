import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../../../utils/productUtils";

const normalizeCategory = (value = "") =>
  value.trim().toLowerCase().replace(/[-_]+/g, " ");

const slugifyCategory = (value = "") =>
  normalizeCategory(value).replace(/\s+/g, "-");

const CategoryNames = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const products = await getProducts();
        const uniqueCategories = Array.from(
          new Map(
            products
              .map((item) => item.category?.trim())
              .filter(Boolean)
              .map((category) => [normalizeCategory(category), category])
          ).values()
        );

        if (isMounted) {
          setCategories(["All", ...uniqueCategories]);
        }
      } catch {
        if (isMounted) {
          setCategories(["All"]);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentCategory = location.pathname.startsWith("/explore/")
    ? decodeURIComponent(location.pathname.replace("/explore/", ""))
    : "all";

  return (
    <div className="flex flex-wrap gap-3 px-6 py-4">
      {categories.map((item) => {
        const isActive =
          item === "All"
            ? !location.pathname.startsWith("/explore/")
            : slugifyCategory(item) === normalizeCategory(currentCategory);

        return (
          <button
            key={item}
            onClick={() =>
              item === "All"
                ? navigate("/explore")
                : navigate(`/explore/${slugifyCategory(item)}`)
            }
            className={`rounded-full px-5 py-2 transition ${
              isActive
                ? "bg-yellow-400 text-black"
                : "bg-zinc-900 text-gray-300 hover:bg-yellow-400 hover:text-black"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryNames;
