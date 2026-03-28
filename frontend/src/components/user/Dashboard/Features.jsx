import React from "react";
import { Ruler, BookOpen, Truck } from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Ruler size={22} />,
    title: "AI Measurements",
    desc: "Get perfectly tailored fits from home using our proprietary 3D mobile scanning technology",
  },
  {
    id: 2,
    icon: <BookOpen size={22} />,
    title: "Artisan Journal",
    desc: "Read stories from the cutting table: fabric trends, and the history of modern menswear",
  },
  {
    id: 3,
    icon: <Truck size={22} />,
    title: "White Glove Delivery",
    desc: "Your bespoke garments are hand-delivered in climate-controlled packaging to ensure perfection",
  },
];

const Features = () => {
  return (
    <div className="bg-black text-white px-25 py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 p-6 rounded-2xl hover:bg-zinc-800 transition duration-300"
          >
            
            {/* Icon */}
            <div className="text-yellow-400 mb-4">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.desc}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;