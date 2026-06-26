import { useEffect, useState } from "react";
import { getTailorOrders } from "../../../utils/orderUtils";

export default function OrdersCards() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const syncOrders = async () => {
      try {
        const nextOrders = await getTailorOrders();
        setOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch {
        setOrders([]);
      }
    };

    syncOrders();
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
          <h2 className="mt-4 text-4xl font-bold text-theme-accent">{activeOrders}</h2>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-theme-panel p-6 shadow-lg border border-theme-border">
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">PENDING ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-theme-accent">{pendingOrders}</h2>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-theme-panel p-6 shadow-lg border border-theme-border">
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">COMPLETED ORDERS</p>
          <h2 className="mt-4 text-4xl font-bold text-emerald-500 dark:text-emerald-400">{completedOrders}</h2>
        </div>
      </div>
    </div>
  );
}
