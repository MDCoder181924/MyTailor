import React from "react";
import { Home, Compass, ShoppingBag, User, Plus } from "lucide-react";

const PhoneFooter = () => {
  return (
    <div className="felx md:hidden">
      <div className="fixed bottom-0 left-0 w-full bg-zinc-900 text-white py-2 px-6 flex justify-between items-center">

        {/* Home */}
        <div className="flex flex-col items-center text-yellow-400 text-xs">
          <Home size={20} />
          <span>Home</span>
        </div>

        {/* Explore */}
        <div className="flex flex-col items-center text-gray-400 text-xs">
          <Compass size={20} />
          <span>Explore</span>
        </div>

        {/* Center Button */}
        <div className="relative -top-6">
          <button className="bg-yellow-400 p-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.7)]">
            <Plus className="text-black" size={24} />
          </button>
        </div>

        {/* Orders */}
        <div className="flex flex-col items-center text-gray-400 text-xs">
          <ShoppingBag size={20} />
          <span>Orders</span>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-gray-400 text-xs">
          <User size={20} />
          <span>Profile</span>
        </div>

      </div>
    </div>
  );
};

export default PhoneFooter;