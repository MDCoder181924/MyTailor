import { useContext, useEffect, useMemo, useState } from "react";
import { Bell, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom"
import defaultTailorImage from "../../assets/images/by-defalt-tailor-img.avif";
import { AuthContext } from "../../context/AuthContext";
import { getTailorNotifications, markTailorNotificationsRead } from "../../utils/orderUtils";

export default function Header() {
  const { tailor } = useContext(AuthContext);
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

      <div className="relative flex items-center space-x-5">
        <Link to="/addproduct" className="bg-yellow-400 cursor-pointer text-black px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-300 transition">+ ADD PRODUCT</Link>

        <button type="button" onClick={handleBellClick} className="relative">
          <Bell className="cursor-pointer" />
          {unreadCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold text-black">
              {unreadCount}
            </span>
          ) : null}
        </button>

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

        {showNotifications ? (
          <div className="absolute right-16 top-12 z-20 w-80 rounded-xl border border-[#2a2a2a] bg-[#151515] p-3 shadow-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-400">Notifications</p>
            {notifications.length ? (
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="rounded-lg bg-[#1f1f1f] p-3">
                    <p className="text-sm font-semibold text-white">{notification.title}</p>
                    <p className="mt-1 text-xs text-gray-400">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No notifications yet.</p>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
}
