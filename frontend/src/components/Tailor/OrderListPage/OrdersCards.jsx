import { useEffect, useState } from "react";
import { getTailorOrders } from "../../../utils/orderUtils";

export default function OrdersCards() {
  const [orders, setOrders] = useState([]);
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

  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const activeOrders = orders.filter((order) => order.status !== "SHIPPED").length;
  const completedOrders = orders.filter((order) => order.status === "SHIPPED").length;

  const MiniSpinner = () => (
    <div className="w-4 h-4 border-2 border-theme-accent border-t-transparent rounded-full animate-spin inline-block align-middle"></div>
  );

  return (
    <div className="bg-theme-bg p-8 text-theme-text">
      <div className="mb-10">
        <h1 className="text-5xl font-serif font-bold">Orders</h1>
        <p className="mt-2 text-xs font-bold tracking-[0.18em] text-theme-text-muted uppercase">
          LIVE TAILOR ORDER MANAGEMENT
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl bg-theme-panel p-6 shadow-lg border border-theme-border">
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">TOTAL ACTIVE ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-theme-accent">
            {loading ? <MiniSpinner /> : activeOrders}
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-theme-panel p-6 shadow-lg border border-theme-border">
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">PENDING ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-theme-accent">
            {loading ? <MiniSpinner /> : pendingOrders}
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-theme-panel p-6 shadow-lg border border-theme-border">
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">COMPLETED ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-emerald-500 dark:text-emerald-400">
            {loading ? <MiniSpinner /> : completedOrders}
          </h2>
        </div>
      </div>
    </div>
  );
}
