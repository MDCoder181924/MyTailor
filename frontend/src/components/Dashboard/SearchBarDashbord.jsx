import React from 'react'
import { Search, SlidersHorizontal } from "lucide-react";

const SearchBarDashbord = () => {
    return (
        <div>
            <div className="flex items-center justify-center gap-3 md:h-20   p-4">

                <div className="flex items-center bg-zinc-900 rounded-2xl px-4 py-3 w-full max-w-xl">
                    <Search className="text-gray-400 mr-3" size={18} />
                    <input
                        type="text"
                        placeholder="Search tailors, fabrics..."
                        className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                    />
                </div>

                <button className="bg-yellow-400 hover:bg-yellow-300 p-3 rounded-2xl">
                    <SlidersHorizontal className="text-black" size={20} />
                </button>
            </div>
        </div>
    )
}

export default SearchBarDashbord
