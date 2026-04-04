import { useEffect, useMemo, useState } from "react";

const getTailorOrders = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawTailor = localStorage.getItem("tailor");
    const tailor = rawTailor ? JSON.parse(rawTailor) : null;
    const tailorId = tailor?._id;

    if (!tailorId) {
      return [];
    }

    const value = localStorage.getItem(`tailor_orders_${tailorId}`);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

export default function OrdersTable() {
  const [orders, setOrders] = useState(() => getTailorOrders());

  useEffect(() => {
    const syncOrders = () => {
      setOrders(getTailorOrders());
    };

    window.addEventListener("storage", syncOrders);
    window.addEventListener("tailor-orders-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("tailor-orders-updated", syncOrders);
    };
  }, []);

  const activeOrders = useMemo(() => orders.filter((order) => order.status !== "SHIPPED"), [orders]);

  const handleCompleteOrder = (orderId) => {
    try {
      const rawTailor = localStorage.getItem("tailor");
      const tailor = rawTailor ? JSON.parse(rawTailor) : null;
      const tailorId = tailor?._id;

      if (!tailorId) {
        return;
      }

      const storageKey = `tailor_orders_${tailorId}`;
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: "SHIPPED" } : order
      );
      const completedOrder = orders.find((order) => order.id === orderId);

      localStorage.setItem(storageKey, JSON.stringify(updatedOrders));

      Object.keys(localStorage)
        .filter((key) => key.startsWith("orders_"))
        .forEach((key) => {
          try {
            const value = localStorage.getItem(key);
            const parsed = value ? JSON.parse(value) : [];
            const nextValue = parsed.map((item) =>
              item.orderNo === orderId
                ? {
                    ...item,
                    category: "active",
                    estCompletion: "COMPLETED",
                    stage: "DELIVER",
                    stageIndex: 4,
                  }
                : item
            );

            localStorage.setItem(key, JSON.stringify(nextValue));
          } catch {
            // Ignore invalid localStorage entries.
          }
        });

      if (completedOrder?.userId) {
        const notificationKey = `notifications_${completedOrder.userId}`;
        const existingNotifications = (() => {
          try {
            const value = localStorage.getItem(notificationKey);
            return value ? JSON.parse(value) : [];
          } catch {
            return [];
          }
        })();

        const nextNotification = {
          id: `notif-${Date.now()}`,
          title: "Order Completed",
          message: `Tamaro ${completedOrder.product} order bani gayo chhe ane deliver mate ready chhe.`,
          orderId,
          createdAt: new Date().toISOString(),
          read: false,
        };

        localStorage.setItem(notificationKey, JSON.stringify([nextNotification, ...existingNotifications]));
      }

      setOrders(updatedOrders);
      window.dispatchEvent(new Event("tailor-orders-updated"));
      window.dispatchEvent(new Event("user-orders-updated"));
      window.dispatchEvent(new Event("user-notifications-updated"));
    } catch {
      // Ignore update failures to keep UI responsive.
    }
  };

  return (
    <div className="bg-black p-6 text-white">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search orders, clients or products..."
          className="w-full rounded-lg bg-gray-900 px-4 py-2 outline-none md:w-1/3"
        />

        <div className="flex gap-3">
          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm">STATUS: ALL</button>
          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm">LATEST FIRST</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-gray-900">
        <div className="grid grid-cols-6 border-b border-gray-800 px-6 py-4 text-sm text-gray-400">
          <span>ORDER ID</span>
          <span>CLIENT</span>
          <span>PRODUCT DETAILS</span>
          <span>STATUS</span>
          <span className="text-center">ACTION</span>
          <span className="text-right">TOTAL</span>
        </div>

        {activeOrders.length ? (
          activeOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-6 items-center border-b border-gray-800 px-6 py-5"
            >
              <div>
                <p className="font-semibold text-yellow-400">{order.id}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/40"
                  alt={order.name}
                  className="h-8 w-8 rounded-full"
                />
                <span>{order.name}</span>
              </div>

              <div>
                <p className="font-medium">{order.product}</p>
                <p className="text-xs text-gray-400">{order.desc || "Tailor order"}</p>
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    order.status === "SHIPPED"
                      ? "bg-green-600"
                      : order.status === "PENDING"
                      ? "bg-yellow-600"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleCompleteOrder(order.id)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-500"
                >
                  COMPLETE
                </button>
              </div>

              <div className="text-right font-semibold text-yellow-400">{order.total}</div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-gray-400">
            No active user orders have been placed for this tailor yet.
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-400">
        <p>Showing {activeOrders.length} orders</p>
        <div className="flex gap-4">
          <button>Previous Page</button>
          <button>Next Page</button>
        </div>
      </div>
    </div>
  );
}
