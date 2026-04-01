import { useMemo } from "react";

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
  const orders = useMemo(() => getTailorOrders(), []);

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
        <div className="grid grid-cols-5 border-b border-gray-800 px-6 py-4 text-sm text-gray-400">
          <span>ORDER ID</span>
          <span>CLIENT</span>
          <span>PRODUCT DETAILS</span>
          <span>STATUS</span>
          <span className="text-right">TOTAL</span>
        </div>

        {orders.length ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-5 items-center border-b border-gray-800 px-6 py-5"
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

              <div className="text-right font-semibold text-yellow-400">{order.total}</div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-gray-400">
            No user orders have been placed for this tailor yet.
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-400">
        <p>Showing {orders.length} orders</p>
        <div className="flex gap-4">
          <button>Previous Page</button>
          <button>Next Page</button>
        </div>
      </div>
    </div>
  );
}
