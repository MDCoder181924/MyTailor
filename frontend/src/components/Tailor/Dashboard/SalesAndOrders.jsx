import { useContext, useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AuthContext } from "../../../context/AuthContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parseAmount = (value) => {
  const numericValue = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

const getTailorOrders = (tailorId) => {
  if (typeof window === "undefined" || !tailorId) {
    return [];
  }

  try {
    const value = localStorage.getItem(`tailor_orders_${tailorId}`);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

function SalesAndOrders() {
  const { tailor } = useContext(AuthContext);
  const [orders, setOrders] = useState(() => getTailorOrders(tailor?._id));

  useEffect(() => {
    const syncOrders = () => {
      setOrders(getTailorOrders(tailor?._id));
    };

    syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener("tailor-orders-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("tailor-orders-updated", syncOrders);
    };
  }, [tailor?._id]);

  const chartData = useMemo(() => {
    const base = DAYS.map((day) => ({ day, value: 0 }));

    orders.forEach((order) => {
      const date = new Date(order.date);
      const dayIndex = Number.isNaN(date.getTime()) ? -1 : date.getDay();

      if (dayIndex >= 0) {
        base[dayIndex].value += parseAmount(order.total);
      }
    });

    return base;
  }, [orders]);

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === "SHIPPED"),
    [orders]
  );

  const avgOrder = useMemo(() => {
    if (!orders.length) {
      return 0;
    }

    const total = orders.reduce((sum, order) => sum + parseAmount(order.total), 0);
    return total / orders.length;
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  return (
    <div className="grid grid-cols-1 gap-6 bg-black p-6 text-white lg:grid-cols-3">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Weekly Sales Trends</h2>
            <p className="text-xs text-gray-400">GROWTH & ENGAGEMENT</p>
          </div>

          <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs text-black">
            7D
          </span>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#facc15" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 flex justify-between text-sm">
          <div>
            <p className="text-gray-400">Completed Orders</p>
            <p className="font-semibold">{completedOrders.length}</p>
          </div>

          <div>
            <p className="text-gray-400">Avg Order</p>
            <p className="font-semibold">${avgOrder.toFixed(0)}</p>
          </div>

          <div>
            <p className="text-gray-400">Total Orders</p>
            <p className="font-semibold">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <span className="cursor-pointer text-sm text-yellow-400">VIEW ALL</span>
        </div>

        {recentOrders.length ? (
          recentOrders.map((order) => {
            const shipped = order.status === "SHIPPED";

            return (
              <div
                key={order.id}
                className={`rounded-xl bg-gray-900 p-4 ${shipped ? "border-l-4 border-green-400" : "border-l-4 border-yellow-400"}`}
              >
                <div className="flex justify-between text-sm">
                  <span className={`rounded px-2 py-1 text-xs ${shipped ? "bg-green-400 text-black" : "bg-yellow-400 text-black"}`}>
                    {shipped ? "SHIPPED" : "IN PROGRESS"}
                  </span>
                  <span>{order.total}</span>
                </div>

                <h3 className="mt-2 font-semibold">{order.product}</h3>
                <p className="text-xs text-gray-400">Customer: {order.name}</p>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-gray-900 p-4 text-sm text-gray-400">
            No orders yet for this tailor.
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesAndOrders;
