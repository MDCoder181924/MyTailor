import { useEffect, useMemo, useState } from "react";
import { completeTailorOrder, getTailorOrders } from "../../../utils/orderUtils";

export default function OrdersTable() {
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

  const activeOrders = useMemo(() => orders.filter((order) => order.status !== "SHIPPED"), [orders]);

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeTailorOrder(orderId);
      window.dispatchEvent(new Event("tailor-orders-updated"));
      window.dispatchEvent(new Event("user-orders-updated"));
      const nextOrders = await getTailorOrders();
      setOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch {
      // Ignore update failures to keep UI responsive.
    }
  };

  return (
    <div className="bg-theme-bg p-6 text-theme-text">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search orders, clients or products..."
          className="w-full rounded-xl bg-theme-panel px-4 py-2.5 outline-none border border-theme-border focus:border-theme-accent text-theme-text transition-colors placeholder:text-theme-text-muted/50 md:w-1/3"
        />

        <div className="flex gap-3">
          <button className="rounded-xl bg-theme-panel border border-theme-border px-4 py-2.5 text-xs font-bold tracking-wider text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent-muted transition-colors uppercase">STATUS: ALL</button>
          <button className="rounded-xl bg-theme-panel border border-theme-border px-4 py-2.5 text-xs font-bold tracking-wider text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent-muted transition-colors uppercase">LATEST FIRST</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-theme-panel border border-theme-border shadow-md">
        <div className="grid grid-cols-6 border-b border-theme-border px-6 py-4 text-xs font-bold tracking-[0.14em] text-theme-text-muted uppercase">
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
              className="grid grid-cols-6 items-center border-b border-theme-border px-6 py-5 hover:bg-theme-accent-muted/20 transition-colors"
            >
              <div>
                <p className="font-bold text-theme-accent">{order.id}</p>
                <p className="text-[11px] text-theme-text-muted mt-0.5">{order.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/40"
                  alt={order.name}
                  className="h-8 w-8 rounded-full border border-theme-border"
                />
                <span className="font-medium text-theme-text">{order.name}</span>
              </div>

              <div>
                <p className="font-semibold text-theme-text">{order.product}</p>
                <p className="text-xs text-theme-text-muted mt-0.5">{order.desc || "Tailor order"}</p>
              </div>

              <div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-wider ${
                    order.status === "SHIPPED"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-theme-accent-muted text-theme-accent border border-theme-accent/20"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleCompleteOrder(order.backendId)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm"
                >
                  COMPLETE
                </button>
              </div>

              <div className="text-right font-bold text-theme-accent">{order.total}</div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-theme-text-muted italic border-theme-border">
            No active user orders have been placed for this tailor yet.
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-xs font-bold tracking-wider text-theme-text-muted uppercase">
        <p>Showing {activeOrders.length} orders</p>
        <div className="flex gap-4">
          <button className="hover:text-theme-accent transition-colors">Previous Page</button>
          <button className="hover:text-theme-accent transition-colors">Next Page</button>
        </div>
      </div>
    </div>
  );
}
