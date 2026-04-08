import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultTailorImage from "../../../assets/images/by-defalt-tailor-img.avif";
import { getTailors } from "../../../utils/tailorUtils";

const getSafeImage = (image) => {
  if (typeof image !== "string") {
    return defaultTailorImage;
  }

  const trimmed = image.trim();
  return trimmed || defaultTailorImage;
};

const PopularTailors = () => {
  const navigate = useNavigate();
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTailors = async () => {
      try {
        setLoading(true);
        setError("");
        const tailorList = await getTailors();

        if (isMounted) {
          setTailors(Array.isArray(tailorList) ? tailorList.slice(0, 10) : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load tailors");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTailors();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenTailor = (tailor) => {
    navigate(`/tailors/${tailor._id}`, {
      state: { tailor },
    });
  };

  return (
    <div className="bg-black px-6 py-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Popular Tailors</h2>
        <span
          className="cursor-pointer text-sm text-yellow-400 hover:underline"
          onClick={() => navigate("/Artisans")}
        >
          View All
        </span>
      </div>

      {loading ? <div className="py-8 text-sm text-gray-400">Loading tailors...</div> : null}
      {!loading && error ? <div className="py-8 text-sm text-red-400">{error}</div> : null}
      {!loading && !error && tailors.length === 0 ? (
        <div className="py-8 text-sm text-gray-400">No tailors available yet.</div>
      ) : null}

      {!loading && !error && tailors.length > 0 ? (
        <div className="no-scrollbar flex gap-6 overflow-x-auto">
          {tailors.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => handleOpenTailor(item)}
              className="flex min-w-[90px] flex-col items-center text-center"
            >
              <div className="relative">
                <img
                  src={getSafeImage(item.profilePhoto)}
                  alt={item.tailorName}
                  className="h-20 w-20 rounded-xl border border-gray-700 object-cover"
                />

                <div className="absolute -bottom-2 right-1 rounded-md bg-yellow-400 px-2 py-[2px] text-[10px] font-semibold text-black">
                  Tailor
                </div>
              </div>

              <p className="mt-4 w-[90px] truncate text-sm">
                {item.tailorName}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PopularTailors;
