import { useState } from "react";

export default function PortfolioGallery() {
  const [showAll, setShowAll] = useState(false);

  const products = [
    { name: "Suit 1", image: "https://picsum.photos/300?1" },
    { name: "Suit 2", image: "https://picsum.photos/300?2" },
    { name: "Suit 3", image: "https://picsum.photos/300?3" },
    { name: "Suit 4", image: "https://picsum.photos/300?4" },
    { name: "Suit 5", image: "https://picsum.photos/300?5" },
    { name: "Suit 6", image: "https://picsum.photos/300?6" },
    { name: "Suit 7", image: "https://picsum.photos/300?7" },
    { name: "Suit 8", image: "https://picsum.photos/300?8" },
    { name: "Suit 9", image: "https://picsum.photos/300?9" },
    { name: "Suit 10", image: "https://picsum.photos/300?10" },
  ];

  // 👇 Only 6 or all
  const visibleProducts = showAll ? products : products.slice(0, 6);

  return (
    <div className="bg-black text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-bold">
          The Masterpiece Gallery
        </h2>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-yellow-400 text-sm hover:underline"
        >
          {showAll ? "SHOW LESS ↑" : "VIEW ARCHIVE →"}
        </button>
      </div>

      {/* Grid (3 per row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {visibleProducts.map((item, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden bg-gray-900 group"
          >
            <img
              src={item.image}
              className="w-full h-[220px] object-cover transition duration-300 group-hover:scale-110"
            />

            {/* <div className="p-3">
              <p className="text-sm font-semibold">{item.name}</p>
            </div> */}
          </div>
        ))}

      </div>
    </div>
  );
}