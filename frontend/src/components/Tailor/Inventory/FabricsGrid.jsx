export default function FabricsGrid() {
  const fabrics = [
    {
      name: "Italian Merino Wool",
      price: "$120",
      stock: "45 meters remaining",
      location: "Biella, Italy",
      image: "https://images.unsplash.com/photo-1520975922284-9c1b0fbe7f16",
    },
    {
      name: "Egyptian Giza Cotton",
      price: "$65",
      stock: "8.5 meters remaining",
      location: "Alexandria, Egypt",
      lowStock: true,
      image: "https://images.unsplash.com/photo-1582582494700-86d5f6b9c3c1",
    },
    {
      name: "Mulberry Silk Satin",
      price: "$185",
      stock: "12 meters remaining",
      location: "Suzhou, China",
      image: "https://images.unsplash.com/photo-1582738412127-9e7d4b6c1c47",
    },
    {
      name: "Heavyweight Irish Linen",
      price: "$90",
      stock: "32 meters remaining",
      location: "Belfast, Ireland",
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    },
    {
      name: "Authentic Harris Tweed",
      price: "$145",
      stock: "4 meters remaining",
      location: "Outer Hebrides, Scotland",
      lowStock: true,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
    },
    {
      name: "Zegna Pure Cashmere",
      price: "$295",
      stock: "18.5 meters remaining",
      location: "Hohhot, China",
      image: "https://images.unsplash.com/photo-1582738412127-9e7d4b6c1c47",
    },
  ];

  return (
    <div className="bg-black text-white p-8">

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {fabrics.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl overflow-hidden shadow-lg group hover:scale-105 transition"
          >

            {/* Image */}
            <div className="relative">
              <img
                src={item.image}
                className="w-full h-48 object-cover"
              />

              {/* Location */}
              <span className="absolute top-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
                {item.location}
              </span>

              {/* Low Stock Badge */}
              {item.lowStock && (
                <span className="absolute top-2 right-2 text-xs bg-red-600 px-2 py-1 rounded">
                  LOW STOCK
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">

              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold leading-tight">
                  {item.name}
                </h3>

                <span className="text-yellow-400 font-semibold">
                  {item.price}
                </span>
              </div>

              {/* Stock */}
              <p className="text-xs text-gray-400 mt-3">
                {item.stock}
              </p>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}