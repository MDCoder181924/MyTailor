import { useContext, useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getTailorOrders } from "../../../utils/orderUtils";
import { ThemeContext } from "../../../context/ThemeContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parseAmount = (value) => {
  const numericValue = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

function SalesAndOrders() {
  const [orders, setOrders] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const nextOrders = await getTailorOrders();
        setOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const syncOrders = async () => {
      try {
        const nextOrders = await getTailorOrders();
        setOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch {
        setOrders([]);
      }
    };

    window.addEventListener("storage", syncOrders);
    window.addEventListener("tailor-orders-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("tailor-orders-updated", syncOrders);
    };
  }, []);

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

  const chartStroke = theme === "light" ? "#2563eb" : "#facc15";

  const MiniSpinner = () => (
    <div className="w-4 h-4 border-2 border-theme-accent border-t-transparent rounded-full animate-spin inline-block align-middle"></div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 bg-theme-bg p-6 text-theme-text lg:grid-cols-3">
      <div className="bg-theme-panel p-6 rounded-xl shadow-lg border border-theme-border lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-theme-text">Weekly Sales Trends</h2>
            <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">GROWTH & ENGAGEMENT</p>
          </div>

          <span className="rounded-xl border border-theme-accent/30 bg-theme-accent-muted px-3 py-1 text-xs font-bold text-theme-accent">
            7D
          </span>
        </div>

        <div className="h-60 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-theme-text-muted">
              <div className="w-8 h-8 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs uppercase tracking-wider">Loading trends...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" stroke="currentColor" className="text-theme-text-muted opacity-50" />
                <Tooltip contentStyle={{ backgroundColor: "var(--theme-panel)", borderColor: "var(--theme-border)", color: "var(--theme-text)" }} />
                <Line type="monotone" dataKey="value" stroke={chartStroke} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-6 flex justify-between text-sm border-t border-theme-border pt-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-theme-text-muted uppercase">Completed Orders</p>
            <p className="font-semibold text-theme-text mt-0.5">{loading ? <MiniSpinner /> : completedOrders.length}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-theme-text-muted uppercase">Avg Order</p>
            <p className="font-semibold text-theme-text mt-0.5">{loading ? <MiniSpinner /> : `$${avgOrder.toFixed(0)}`}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-theme-text-muted uppercase">Total Orders</p>
            <p className="font-semibold text-theme-text mt-0.5">{loading ? <MiniSpinner /> : orders.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-theme-text">Recent Orders</h2>
          <span className="cursor-pointer text-xs font-bold tracking-wider text-theme-accent hover:underline">VIEW ALL</span>
        </div>

        {loading ? (
          <div className="rounded-xl bg-theme-panel border border-theme-border p-8 text-center flex flex-col items-center justify-center gap-2 text-theme-text-muted">
            <div className="w-6 h-6 border-2 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs uppercase tracking-wider">Loading orders...</span>
          </div>
        ) : recentOrders.length ? (
          recentOrders.map((order) => {
            const shipped = order.status === "SHIPPED";

            return (
              <div
                key={order.id}
                className={`rounded-xl bg-theme-panel p-4 border border-theme-border ${shipped ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-theme-accent"}`}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${shipped ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-theme-accent-muted text-theme-accent border border-theme-accent/20"}`}>
                    {shipped ? "SHIPPED" : "IN PROGRESS"}
                  </span>
                  <span className="font-bold text-theme-text">{order.total}</span>
                </div>

                <h3 className="mt-3 font-semibold text-theme-text">{order.product}</h3>
                <p className="text-xs text-theme-text-muted mt-1">Customer: {order.name}</p>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-theme-panel border border-theme-border p-5 text-sm text-theme-text-muted italic text-center">
            No orders yet for this tailor.
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesAndOrders;
