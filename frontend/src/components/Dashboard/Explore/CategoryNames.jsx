const categories = ["All", "Suits", "Shirts", "Pants"];
import React, { useState } from 'react'

const CategoryNames = ({ setCategory }) => {

  return (
  <div className="">

    <div className="flex gap-3 px-6 py-4">
      {categories.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item)}
          className="px-5 py-2 rounded-full bg-zinc-900 text-gray-300 hover:bg-yellow-400 hover:text-black transition"
        >
          {item}
        </button>
      ))}
    </div>


    </div>
    
  );
};

export default CategoryNames;