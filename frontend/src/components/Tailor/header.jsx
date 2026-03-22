import { Bell, Settings } from "lucide-react";
import {Link} from "react-router-dom"

export default function Header() {
  return (
    <div className="flex h-15 items-center justify-between  px-6 py-3 text-white">

      {/* Left Side - Logo */}
      <h1 className="text-yellow-400 text-xl font-serif">
        MyTailor
      </h1>

      {/* Center - Menu */}
      <ul className="hidden md:flex space-x-8 text-gray-400">
        <Link to="/tailordahboard" className="hover:text-white cursor-pointer">DASHBOARD</Link>
        <Link to="/OrdersList" className="hover:text-white cursor-pointer">ORDERS</Link>
        <li className="hover:text-white cursor-pointer">INVENTORY</li>
        <Link to="/profile" className="hover:text-white cursor-pointer">PROFILE</Link>
      </ul>

      <div className="flex items-center space-x-5">

        <Bell className="cursor-pointer" />

        <Settings className="cursor-pointer" />

        <div className="flex items-center space-x-2">
          
          <span className="text-sm">Mohit</span>

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        </div>

      </div>
    </div>
  );
}