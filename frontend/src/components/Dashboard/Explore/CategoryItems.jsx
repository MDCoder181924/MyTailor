import React from "react";

const data = [
  {
    id: 1,
    title: "Bespoke Silk Shirt",
    category: "Shirts",
    price: "$450",
    tag: "LIMITED EDITION",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  },
  {
    id: 2,
    title: "Italian Wool Pants",
    category: "Pants",
    price: "$380",
    tag: "",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80",
  },
  {
    id: 3,
    title: "Midnight Navy Suit",
    category: "Suits",
    price: "$1250",
    tag: "TAILOR'S CHOICE",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
  },
];

const CategoryItems = ({ category }) => {
  const filtered =
    category === "All"
      ? data
      : data.filter((item) => item.category === category);

  return (
    <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-black">

      {filtered.map((item) => (
        <div key={item.id} className="bg-black text-white">

          {/* Image */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[320px] object-cover"
            />

            {/* Tag */}
            {item.tag && (
              <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                {item.tag}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="mt-4">

            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{item.title}</h3>
              <span className="text-yellow-400 font-medium">
                {item.price}
              </span>
            </div>

            <p className="text-gray-400 text-xs mt-1 uppercase">
              MULTIBERRY SILK • HAND-STITCHED
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 bg-zinc-800 text-sm py-2 rounded hover:bg-zinc-700 transition">
                DETAILS
              </button>

              <button className="bg-yellow-400 text-black px-3 py-2 rounded">
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