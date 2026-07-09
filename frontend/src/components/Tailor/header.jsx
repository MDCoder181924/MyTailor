import { useContext, useEffect, useMemo, useState } from "react";
import { Bell, Settings, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom"
import defaultTailorImage from "../../assets/images/by-defalt-tailor-img.avif";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { getTailorNotifications, markTailorNotificationsRead } from "../../utils/orderUtils";

export default function Header() {
  const { tailor } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const nextNotifications = await getTailorNotifications();
        setNotifications(Array.isArray(nextNotifications) ? nextNotifications : []);
      } catch {
        setNotifications([]);
      }
    };

    loadNotifications();
    window.addEventListener("storage", loadNotifications);
    window.addEventListener("tailor-notifications-updated", loadNotifications);

    return () => {
      window.removeEventListener("storage", loadNotifications);
      window.removeEventListener("tailor-notifications-updated", loadNotifications);
    };
  }, [tailor?._id]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const handleBellClick = async () => {
    setShowNotifications((prev) => !prev);

    try {
      const updatedNotifications = await markTailorNotificationsRead();
      setNotifications(updatedNotifications);
      window.dispatchEvent(new Event("tailor-notifications-updated"));
    } catch {
      // Ignore notification read failures.
    }
  };

  const navItems = [
    { to: "/tailordahboard", label: "DASHBOARD" },
    { to: "/OrdersList", label: "ORDERS" },
    { to: "/inventory", label: "INVENTORY" },
    { to: "/profile", label: "PROFILE" },
  ];

  const getNavLinkClassName = (isActive) =>
    `cursor-pointer transition-all duration-300 ${
      isActive ? "text-theme-accent font-semibold" : "text-theme-text-muted hover:text-theme-text"
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
      <div className="flex h-15 items-center justify-between px-6 py-3 text-theme-text">

        {/* Left Side - Logo */}
        <h1 className="text-theme-accent text-xl font-serif font-bold">
          MyTailor
        </h1>

        {/* Center - Menu */}
        <ul className="hidden md:flex space-x-8 text-theme-text-muted">
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

        <div className="relative flex items-center gap-2 sm:gap-4 md:gap-5">
          <Link to="/addproduct" className="hidden md:inline-flex bg-theme-accent cursor-pointer text-theme-bg px-3 py-1.5 rounded-lg font-semibold items-center gap-2 hover:opacity-90 transition">+ ADD PRODUCT</Link>

          <button type="button" onClick={toggleTheme} className="relative cursor-pointer text-theme-text hover:text-theme-accent transition flex items-center p-1">
            {theme === "dark" ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" />}
          </button>

          <button type="button" onClick={handleBellClick} className="relative p-1">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-theme-accent px-1 text-[9px] font-bold text-theme-bg">
                {unreadCount}
              </span>
            ) : null}
          </button>

          <Link to="/TailorSettings" className="hidden sm:block p-1">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm font-medium">{tailor?.tailorName || "Tailor"}</span>
            <img
              src={tailor?.profilePhoto || defaultTailorImage}
              alt="profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-theme-border"
            />
          </div>

          {showNotifications ? (
            <div className="absolute right-0 top-12 z-20 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-theme-border bg-theme-panel p-3 shadow-2xl">
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
  );
}
