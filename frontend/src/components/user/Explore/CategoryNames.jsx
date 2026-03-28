import { useNavigate } from "react-router-dom";

const categories = ["All", "Suits", "Shirts", "Pants"];

const CategoryNames = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 px-6 py-4">
      {categories.map((item) => (
        <button
          key={item}
          onClick={() =>
            item === "All"
              ? navigate("/explore")
              : navigate(`/explore/${item.toLowerCase()}`)
          }
          className="px-5 py-2 rounded-full bg-zinc-900 text-gray-300 hover:bg-yellow-400 hover:text-black transition"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default CategoryNames;