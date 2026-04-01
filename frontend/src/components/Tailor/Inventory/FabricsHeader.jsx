import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function FabricsHeader() {
  return (
    <div className="bg-black text-white px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

      {/* Left Side */}
      <div>
        <p className="text-yellow-400 text-xs tracking-widest mb-2">
          CURRENT SELECTION
        </p>

        <h1 className="text-4xl md:text-5xl font-serif font-bold">
          Your Products
        </h1>
      </div>

      {/* Right Side Buttons */}
      <div className="flex gap-3">

        {/* Filter Button */}
        <button className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
          <SlidersHorizontal size={16} />
          FILTER BY CATEGORY
        </button>

        {/* Sort Button */}
        <button className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
          <ArrowUpDown size={16} />
          SORT BY STOCK
        </button>

      </div>
    </div>
  );
}
