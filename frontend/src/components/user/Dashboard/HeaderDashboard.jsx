import React, { useEffect, useMemo, useState } from 'react'
import { Bell, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

const HeaderDashbord = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
  ];

  const getNavLinkClassName = (isActive) =>
    `text-[1.1rem] cursor-pointer transition-all duration-300 ${
      isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
    }`;

  const getNavLinkStyle = (isActive) =>
    isActive
      ? {
          textShadow: "0 0 8px rgba(250, 204, 21, 0.95), 0 0 18px rgba(250, 204, 21, 0.7)",
        }
      : undefined;

  return (
    <div>
      <div className="w-full text-white h-18 px-6 py-4 flex items-center justify-between">
        
        <div className="">
        <h1 className="text-yellow-400 text-3xl font-serif font-bold">
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
          <button type="button" onClick={handleBellClick} className="relative">
            <Bell className="cursor-pointer hover:text-yellow-400" size={20} />
            {unreadCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            ) : null}
          </button>
          <ShoppingBag className="cursor-pointer hover:text-yellow-400" size={20} />
          <Link to="/userProfiie">
            <User className="cursor-pointer hover:text-yellow-400" size={20} />
          </Link>

          {showNotifications ? (
            <div className="absolute right-16 top-10 z-20 w-80 rounded-xl border border-[#2a2a2a] bg-[#151515] p-3 shadow-2xl">
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
      </div>
    </div>
  )
}

export default HeaderDashbord
