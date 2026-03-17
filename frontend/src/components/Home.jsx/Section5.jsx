import React from "react";

const Section5 = () => {
  return (
    <div className="bg-black text-white py-20 px-6 md:px-16 text-center md:h-[50vh]">

      {/* Title */}
      <h2 className="text-4xl font-bold mb-10">
        Find Your Perfect Maker
      </h2>

      {/* Search Box */}
      <div className="max-w-4xl mx-auto bg-[#111] p-5 rounded-xl flex flex-col md:flex-row gap-4 items-center">

        {/* Input */}
        <input
          type="text"
          placeholder="Search tailors by name or specialty..."
          className="flex-1 bg-black border border-gray-700 px-4 py-3 rounded text-white outline-none"
        />

        {/* Select */}
        <select className="bg-black border border-gray-700 px-4 py-3 rounded text-white">
          <option>All Fabric Types</option>
          <option>Cotton</option>
          <option>Silk</option>
          <option>Wool</option>
        </select>

        {/* Button */}
        <button className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-500 transition">
          Search
        </button>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <span className="border border-gray-600 px-3 py-1 rounded">Trending</span>
        <span className="border border-gray-600 px-3 py-1 rounded">Tuxedos</span>
        <span className="border border-gray-600 px-3 py-1 rounded">Sustainable</span>
        <span className="border border-gray-600 px-3 py-1 rounded">Wedding</span>
        <span className="border border-gray-600 px-3 py-1 rounded">Summer Linen</span>
      </div>

    </div>
  );
};

export default Section5;