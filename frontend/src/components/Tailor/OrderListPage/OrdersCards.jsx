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

export default function OrdersCards() {
  const orders = useMemo(() => getTailorOrders(), []);
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const activeOrders = orders.filter((order) => order.status !== "SHIPPED").length;
  const completedOrders = orders.filter((order) => order.status === "SHIPPED").length;

  return (
    <div className="bg-black p-8 text-white">
      <div className="mb-10">
        <h1 className="text-5xl font-serif font-bold">Orders</h1>
        <p className="mt-2 text-sm tracking-widest text-gray-400">
          LIVE TAILOR ORDER MANAGEMENT
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl bg-gray-900 p-6 shadow-lg">
          <p className="text-sm text-gray-400">TOTAL ACTIVE ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-yellow-400">{activeOrders}</h2>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gray-900 p-6 shadow-lg">
          <p className="text-sm text-gray-400">PENDING ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-yellow-300">{pendingOrders}</h2>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gray-900 p-6 shadow-lg">
          <p className="text-sm text-gray-400">COMPLETED ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-green-400">{completedOrders}</h2>
        </div>
      </div>
    </div>
  );
}
