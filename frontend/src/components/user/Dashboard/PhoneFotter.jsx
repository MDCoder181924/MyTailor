import { Compass, Home, ShoppingBag, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/deshboard", label: "Home", icon: Home, match: (pathname) => pathname === "/deshboard" },
  { to: "/Artisans", label: "Artisans", icon: Users, match: (pathname) => pathname === "/Artisans" },
  { to: "/OrderList", label: "Orders", icon: ShoppingBag, match: (pathname) => pathname === "/OrderList" || pathname === "/OrdarProduct" },
  { to: "/explore", label: "Explore", icon: Compass, match: (pathname) => pathname === "/explore" || pathname.startsWith("/explore/") },
];

const PhoneFooter = () => {
  const location = useLocation();

  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur">
        {navItems.map((item) => {
          const isActive = item.match(location.pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex min-w-[64px] flex-col items-center gap-1 text-[11px] transition ${
                isActive ? "text-yellow-400" : "text-gray-400 hover:text-yellow-300"
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PhoneFooter;
