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
  {
    id: 4,
    title: "Classic White Shirt",
    category: "Shirts",
    price: "$220",
    tag: "",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
  },
  {
    id: 5,
    title: "Slim Fit Trousers",
    category: "Pants",
    price: "$300",
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1593032465171-8d35d5b4a0b5?w=400&q=80",
  },
  {
    id: 6,
    title: "Luxury Black Suit",
    category: "Suits",
    price: "$1400",
    tag: "",
    image: "https://images.unsplash.com/photo-1520975922284-9e0ce8273f1c?w=400&q=80",
  },
  {
    id: 7,
    title: "Casual Linen Shirt",
    category: "Shirts",
    price: "$180",
    tag: "",
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&q=80",
  },
  {
    id: 8,
    title: "Formal Office Pants",
    category: "Pants",
    price: "$270",
    tag: "",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=400&q=80",
  },
  {
    id: 9,
    title: "Wedding Tuxedo Suit",
    category: "Suits",
    price: "$1600",
    tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80",
  },
  {
    id: 10,
    title: "Designer Cotton Shirt",
    category: "Shirts",
    price: "$210",
    tag: "",
    image: "https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=400&q=80",
  },
];

const CategoryItems = ({ category }) => {
  const filtered =
    category === "All"
      ? data
      : data.filter((item) => item.category === category);

  return (
    <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-4 grid-cols-2 md:gap-10 gap-2 md:mx-10 bg-black">

      {filtered.map((item) => (
        <div key={item.id} className="bg-black text-white">

          {/* Image */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full md:h-[320px] h-[180px]  object-cover"
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