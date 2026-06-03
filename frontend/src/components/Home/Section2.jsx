import React from "react";
import { Link } from "react-router-dom";

const tailors = [
  {
    name: "Alessandro Rossi",
    role: "Milan • Master Suit Maker",
    img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7",
    reviews: "120 Reviews",
  },
  {
    name: "Evelyn Dubois",
    role: "Paris • Evening Wear Specialist",
    img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800",
    reviews: "94 Reviews",
  },
  {
    name: "Kenji Tanaka",
    role: "Tokyo • Modern Minimalism",
    img: "https://images.unsplash.com/photo-1602810319428-019690571b5b",
    reviews: "88 Reviews",
  },
];

const Section2 = () => {
  return (
    <div className="bg-black text-white py-16 px-6 min-h-screen w-full flex flex-col justify-center md:px-16">

      <div className="mb-10 mt-5">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            Featured Tailors
            <span className="block w-16 h-1 bg-yellow-400 mt-2"></span>
          </h2>

          <Link to="/Artisans" className="text-yellow-400 hover:text-yellow-300 font-medium transition">
            Explore All Artisans →
          </Link>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tailors.map((t, i) => (
            <div
              key={i}
              className="bg-[#111] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300"
            >
              <div className="h-64 sm:h-80 md:h-72 lg:h-90 w-full overflow-hidden">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="text-yellow-400 text-sm mt-1">{t.role}</p>

                <div className="flex items-center mt-3 text-yellow-400">
                  ⭐⭐⭐⭐⭐
                  <span className="text-gray-400 text-sm ml-2">
                    ({t.reviews})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Section2;