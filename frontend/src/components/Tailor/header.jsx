import { useContext } from "react";
import { Bell, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom"
import defaultTailorImage from "../../assets/images/by-defalt-tailor-img.avif";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const { tailor } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { to: "/tailordahboard", label: "DASHBOARD" },
    { to: "/OrdersList", label: "ORDERS" },
    { to: "/inventory", label: "INVENTORY" },
    { to: "/profile", label: "PROFILE" },
  ];

  const getNavLinkClassName = (isActive) =>
    `cursor-pointer transition-all duration-300 ${
      isActive ? "text-yellow-400" : "text-gray-400 hover:text-white"
    }`;

  const getNavLinkStyle = (isActive) =>
    isActive
      ? {
          textShadow: "0 0 8px rgba(250, 204, 21, 0.95), 0 0 18px rgba(250, 204, 21, 0.7)",
        }
      : undefined;

  return (
    <div className="flex h-15 items-center justify-between  px-6 py-3 text-white">

      {/* Left Side - Logo */}
      <h1 className="text-yellow-400 text-xl font-serif">
        MyTailor
      </h1>

      {/* Center - Menu */}
      <ul className="hidden md:flex space-x-8 text-gray-400">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={getNavLinkClassName(isActive)}
              style={getNavLinkStyle(isActive)}
            >
              {item.label}
            </Link>
          );
        })}
      </ul>

      <div className="flex items-center space-x-5">
        <Link to="/addproduct" className="bg-yellow-400 cursor-pointer text-black px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-300 transition">+ ADD PRODUCT</Link>

        <Bell className="cursor-pointer" />

        <Link to="/TailorSettings">
        <Settings className="cursor-pointer" />
        </Link>

        <div className="flex items-center space-x-2">

          <span className="text-sm">{tailor?.tailorName || "Tailor"}</span>

          <img
            src={tailor?.profilePhoto || defaultTailorImage}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        </div>

      </div>
    </div>
  );
}
