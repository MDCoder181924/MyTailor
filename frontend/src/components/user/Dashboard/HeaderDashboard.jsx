import React, { useEffect, useMemo, useState, useContext } from 'react'
import { Bell, ShoppingBag, User, Sun, Moon } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartCount } from "../../../utils/cartUtils";
import { ThemeContext } from "../../../context/ThemeContext";

const HeaderDashbord = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const loadNotifications = () => {
      try {
        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;
        const userId = user?._id;

        if (!userId) {
          setNotifications([]);
          return;
        }

        const value = localStorage.getItem(`notifications_${userId}`);
        setNotifications(value ? JSON.parse(value) : []);
      } catch {
        setNotifications([]);
      }
    };

    loadNotifications();
    window.addEventListener("storage", loadNotifications);
    window.addEventListener("user-notifications-updated", loadNotifications);

    return () => {
      window.removeEventListener("storage", loadNotifications);
      window.removeEventListener("user-notifications-updated", loadNotifications);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);

    try {
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?._id;

      if (!userId) {
        return;
      }

      const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      window.dispatchEvent(new Event("user-notifications-updated"));
    } catch {
      // Ignore notification read failures.
    }
  };

  const navItems = [
    { to: "/deshboard", label: "Collections", match: (pathname) => pathname === "/deshboard" },
    { to: "/Artisans", label: "Artisans", match: (pathname) => pathname === "/Artisans" },
    { to: "/OrderList", label: "Order", match: (pathname) => pathname === "/OrderList" || pathname === "/OrdarProduct" },
    { to: "/explore", label: "Explore", match: (pathname) => pathname === "/explore" || pathname.startsWith("/explore/") },
    { to: "/help", label: "Help & Contact", match: (pathname) => pathname === "/help" || pathname === "/contact" },
  ];

  const getNavLinkClassName = (isActive) =>
    `text-[1.1rem] cursor-pointer transition-all duration-300 ${
      isActive ? "text-theme-accent font-semibold" : "text-theme-text hover:text-theme-accent"
    }`;

  const getNavLinkStyle = (isActive) =>
    isActive
      ? {
          textShadow: theme === "dark" 
            ? "0 0 8px rgba(250, 204, 21, 0.95), 0 0 18px rgba(250, 204, 21, 0.7)"
            : "0 0 8px rgba(37, 99, 235, 0.4)",
        }
      : undefined;

  return (
    <div className="sticky top-0 z-50 bg-theme-bg border-b border-theme-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full text-theme-text h-18 px-6 py-4 flex items-center justify-between">
        
        <div className="">
        <h1 className="text-theme-accent text-3xl font-serif font-bold cursor-pointer" onClick={() => navigate("/deshboard")}>
          MyTailor
        </h1>
        </div>

        <div className=" flex justify-between gap-20 ">
        <div className="hidden md:flex gap-10 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = item.match(location.pathname);

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
          
        </div>

        <div className="flex items-center gap-5 mr-3 relative" >
          <button type="button" onClick={toggleTheme} className="relative cursor-pointer text-theme-text hover:text-theme-accent transition">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button type="button" onClick={handleBellClick} className="relative cursor-pointer text-theme-text hover:text-theme-accent transition">
            <Bell size={20} />
            {unreadCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-theme-accent px-1 text-[10px] font-bold text-theme-bg animate-pulse">
                {unreadCount}
              </span>
            ) : null}
          </button>
          
          <Link to="/Cart" className="relative text-theme-text hover:text-theme-accent transition">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-theme-accent px-1 text-[10px] font-bold text-theme-bg animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link to="/userProfiie" className="text-theme-text hover:text-theme-accent transition">
            <User size={20} />
          </Link>

          {showNotifications ? (
            <div className="absolute right-16 top-10 z-20 w-80 rounded-xl border border-theme-border bg-theme-panel p-3 shadow-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-theme-accent">Notifications</p>
              {notifications.length ? (
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="rounded-lg bg-theme-bg p-3 border border-theme-border">
                      <p className="text-sm font-semibold text-theme-text">{notification.title}</p>
                      <p className="mt-1 text-xs text-theme-text-muted">{notification.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-theme-text-muted">No notifications yet.</p>
              )}
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderDashbord
