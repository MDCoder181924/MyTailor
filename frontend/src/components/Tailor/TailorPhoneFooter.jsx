import { ClipboardList, Home, Package, PlusSquare, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/tailordahboard", label: "Home", icon: Home, match: (pathname) => pathname === "/tailordahboard" },
  { to: "/OrdersList", label: "Orders", icon: ClipboardList, match: (pathname) => pathname === "/OrdersList" },
  { to: "/inventory", label: "Inventory", icon: Package, match: (pathname) => pathname === "/inventory" },
  { to: "/addproduct", label: "Add", icon: PlusSquare, match: (pathname) => pathname === "/addproduct" },
  { to: "/TailorSettings", label: "Settings", icon: Settings, match: (pathname) => pathname === "/TailorSettings" },
];

const TailorPhoneFooter = () => {
  const location = useLocation();

  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-theme-border bg-theme-panel py-3 px-2 backdrop-blur shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = item.match(location.pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition ${
                isActive ? "text-theme-accent" : "text-theme-text-muted hover:text-theme-accent"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TailorPhoneFooter;
