import { useEffect, useMemo, useState } from "react";
import { completeTailorOrder, getTailorOrders, acceptTailorOrder, payTailorOrder, shipTailorOrder, startTailorWork } from "../../../utils/orderUtils";
import { X } from "lucide-react";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

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

  // Update selectedOrderDetail modal state if orders sync
  useEffect(() => {
    if (selectedOrderDetail) {
      const updated = orders.find((o) => o.backendId === selectedOrderDetail.backendId);
      if (updated) {
        setSelectedOrderDetail(updated);
      }
    }
  }, [orders, selectedOrderDetail]);

  const [statusFilter, setStatusFilter] = useState("ALL_ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");

  const activeOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      switch (statusFilter) {
        case "PENDING":
          return order.status === "PENDING";
        case "AWAITING_START":
          return order.status === "ACCEPTED" && !order.workStarted;
        case "WORK_STARTED":
          return order.status === "ACCEPTED" && order.workStarted;
        case "COMPLETED":
          return order.status === "SHIPPED";
        case "CANCELLED":
          return order.status === "CANCELLED";
        case "ALL":
          return true;
        case "ALL_ACTIVE":
        default:
          return order.status !== "SHIPPED" && order.status !== "CANCELLED";
      }
    });
  }, [orders, statusFilter, searchQuery]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptTailorOrder(orderId);
      window.dispatchEvent(new Event("tailor-orders-updated"));
      window.dispatchEvent(new Event("user-orders-updated"));
      const nextOrders = await getTailorOrders();
      setOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch {
      // Ignore update failures.
    }
  };

  const handleStartWork = async (orderId) => {
    try {
      await startTailorWork(orderId);
      window.dispatchEvent(new Event("tailor-orders-updated"));
      window.dispatchEvent(new Event("user-orders-updated"));
      const nextOrders = await getTailorOrders();
      setOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch {
      // Ignore
    }
  };

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

  const handleMarkAsPaid = async (orderId) => {
    try {
      await payTailorOrder(orderId);
      window.dispatchEvent(new Event("tailor-orders-updated"));
      window.dispatchEvent(new Event("user-orders-updated"));
      const nextOrders = await getTailorOrders();
      setOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch {
      // Ignore failures
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      await shipTailorOrder(orderId);
      window.dispatchEvent(new Event("tailor-orders-updated"));
      window.dispatchEvent(new Event("user-orders-updated"));
      const nextOrders = await getTailorOrders();
      setOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch {
      // Ignore failures
    }
  };

  return (
    <div className="bg-theme-bg p-4 md:p-6 text-theme-text">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search orders, clients or products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-theme-panel px-4 py-2.5 outline-none border border-theme-border focus:border-theme-accent text-theme-text transition-colors placeholder:text-theme-text-muted/50 md:w-1/3"
        />

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-theme-panel border border-theme-border px-4 py-2.5 text-xs font-bold tracking-wider text-theme-text outline-none focus:border-theme-accent transition-colors uppercase cursor-pointer"
          >
            <option value="ALL_ACTIVE">Active Orders</option>
            <option value="PENDING">Pending Acceptance</option>
            <option value="AWAITING_START">Awaiting Start</option>
            <option value="WORK_STARTED">Work Started</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="ALL">All Orders</option>
          </select>
          <button className="rounded-xl bg-theme-panel border border-theme-border px-4 py-2.5 text-xs font-bold tracking-wider text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent-muted transition-colors uppercase">LATEST FIRST</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-theme-panel border border-theme-border shadow-md">
        <div className="hidden md:grid grid-cols-6 border-b border-theme-border px-6 py-4 text-xs font-bold tracking-[0.14em] text-theme-text-muted uppercase">
          <span>ORDER ID</span>
          <span>CLIENT</span>
          <span>PRODUCT DETAILS</span>
          <span>STATUS</span>
          <span className="text-center">ACTION</span>
          <span className="text-right">TOTAL</span>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center flex flex-col items-center justify-center gap-2 text-theme-text-muted">
            <div className="w-8 h-8 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs uppercase tracking-widest font-semibold animate-pulse">Loading orders list...</p>
          </div>
        ) : activeOrders.length ? (
          activeOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col md:grid md:grid-cols-6 gap-4 md:gap-0 items-start md:items-center border-b border-theme-border px-6 py-5 hover:bg-theme-accent-muted/20 transition-colors"
            >
              <div className="w-full md:w-auto flex justify-between md:block items-center">
                <div>
                  <p className="font-bold text-theme-accent">{order.id}</p>
                  <p className="text-[11px] text-theme-text-muted mt-0.5">{order.date}</p>
                </div>
                <div className="md:hidden font-bold text-theme-accent text-lg">{order.total}</div>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/40"
                  alt={order.name}
                  className="h-8 w-8 rounded-full border border-theme-border"
                />
                <div>
                  <p className="text-[9px] md:hidden text-theme-text-muted font-bold uppercase tracking-wider">Client</p>
                  <span className="font-medium text-theme-text">{order.name}</span>
                </div>
              </div>

              <div className="w-full">
                <p className="text-[9px] md:hidden text-theme-text-muted font-bold uppercase tracking-wider mb-0.5">Product Details</p>
                <p className="font-semibold text-theme-text">{order.product}</p>
                <p className="text-xs text-theme-text-muted mt-0.5">{order.desc || "Tailor order"}</p>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetail(order)}
                  className="mt-2 text-xs font-bold text-theme-accent hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  🔍 More Details
                </button>
              </div>

              <div>
                <p className="text-[9px] md:hidden text-theme-text-muted font-bold uppercase tracking-wider mb-1">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-wider ${
                    order.status === "SHIPPED"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : order.status === "PENDING"
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : order.status === "CANCELLED"
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : order.workStarted
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-theme-accent-muted text-theme-accent border border-theme-accent/20"
                  }`}
                >
                  {order.status === "ACCEPTED"
                    ? (order.workStarted ? "STITCHING" : "ACCEPTED")
                    : order.status}
                </span>
              </div>

              <div className="w-full md:text-center">
                <p className="text-[9px] md:hidden text-theme-text-muted font-bold uppercase tracking-wider mb-1.5">Action</p>
                {order.status === "CANCELLED" ? (
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    CANCELLED
                  </span>
                ) : order.status === "PENDING" ? (
                  <button
                    type="button"
                    onClick={() => handleAcceptOrder(order.backendId)}
                    className="w-full md:w-auto rounded-lg bg-theme-accent hover:opacity-90 text-theme-bg px-4 py-2 text-xs font-bold transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    ACCEPT
                  </button>
                ) : order.status === "ACCEPTED" && !order.workStarted ? (
                  <button
                    type="button"
                    onClick={() => handleStartWork(order.backendId)}
                    className="w-full md:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    START WORK
                  </button>
                ) : order.estCompletion !== "COMPLETED" ? (
                  <button
                    type="button"
                    onClick={() => handleCompleteOrder(order.backendId)}
                    className="w-full md:w-auto rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    COMPLETE
                  </button>
                ) : order.deliveryMethod === "pickup" && order.paymentStatus === "unpaid" ? (
                  <button
                    type="button"
                    onClick={() => handleMarkAsPaid(order.backendId)}
                    className="w-full md:w-auto rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    MARK PAID
                  </button>
                ) : order.deliveryMethod === "pickup" && order.paymentStatus === "paid" ? (
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                    AWAITING PICKUP
                  </span>
                ) : order.deliveryMethod === "delivery" && order.stage === "READY_TO_SHIP" ? (
                  <button
                    type="button"
                    onClick={() => handleShipOrder(order.backendId)}
                    className="w-full md:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    SEND FOR DELIVERY
                  </button>
                ) : order.deliveryMethod === "delivery" && order.stage === "SHIPPED" ? (
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    OUT FOR DELIVERY
                  </span>
                ) : (
                  <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">
                    COMPLETED
                  </span>
                )}
              </div>

              <div className="hidden md:block text-right font-bold text-theme-accent">{order.total}</div>
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

      {/* More Details Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-none">
          <div className="relative w-full max-w-2xl rounded-2xl bg-theme-panel p-6 shadow-2xl border border-theme-border text-theme-text max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-theme-border pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-theme-accent">Order Details</h2>
                <p className="text-xs text-theme-text-muted mt-1 uppercase tracking-widest">
                  Order ID: <span className="text-theme-text font-mono font-bold">{selectedOrderDetail.id}</span> • {selectedOrderDetail.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="text-theme-text-muted hover:text-theme-text cursor-pointer p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-8">
              
              {selectedOrderDetail.status === "CANCELLED" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-xs text-red-200 space-y-3">
                  <h4 className="font-bold text-red-400 uppercase tracking-widest font-serif text-sm">⚠️ ORDER CANCELLED BY CLIENT</h4>
                  <div>
                    <span className="font-semibold text-gray-400">Reason:</span>{" "}
                    <span className="text-white font-medium">{selectedOrderDetail.cancellationReason || "No reason specified"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Details:</span>
                    <p className="mt-1.5 text-gray-300 whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">{selectedOrderDetail.cancellationDetails || "No further details provided."}</p>
                  </div>
                </div>
              )}
              
              {/* Product and Client Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-theme-border">
                {/* Left: Product Info */}
                <div className="flex gap-4">
                  {selectedOrderDetail.productImage && (
                    <img
                      src={selectedOrderDetail.productImage}
                      alt={selectedOrderDetail.product}
                      className="w-20 h-20 rounded-lg object-cover border border-theme-border shadow-sm flex-shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-theme-accent uppercase tracking-widest block mb-0.5">Garment Details</span>
                    <h3 className="text-lg font-serif font-bold text-theme-text leading-snug">{selectedOrderDetail.product}</h3>
                    <p className="text-xs text-theme-text-muted mt-1 leading-relaxed font-light">
                      {selectedOrderDetail.desc}
                    </p>
                    {selectedOrderDetail.clothingType && (
                      <p className="text-xs text-theme-text-muted mt-1 font-light">
                        Style: <span className="text-theme-text font-semibold">{selectedOrderDetail.clothingType}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Client Summary */}
                <div className="flex gap-3 items-start md:border-l md:border-theme-border md:pl-6">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt={selectedOrderDetail.name}
                    className="h-10 w-10 rounded-full border border-theme-border shadow-sm"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-theme-accent uppercase tracking-widest block mb-0.5">Client Profile</span>
                    <h4 className="font-semibold text-theme-text">{selectedOrderDetail.name}</h4>
                    <p className="text-xs text-theme-text-muted mt-1.5 uppercase tracking-wider font-light">
                      Status: <span className={`font-bold ${selectedOrderDetail.status === "SHIPPED" ? "text-emerald-500" : "text-amber-500"}`}>{selectedOrderDetail.status}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Measurements (if any) */}
              {selectedOrderDetail.customMeasurements && Object.keys(selectedOrderDetail.customMeasurements).length > 0 && (
                <div className="pb-6 border-b border-theme-border">
                  <h4 className="text-xs font-bold text-theme-accent uppercase tracking-widest mb-3 flex items-center gap-1.5 font-serif">
                    📐 Custom Measurements
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-theme-bg p-4 rounded-xl border border-theme-border">
                    {Object.entries(selectedOrderDetail.customMeasurements).map(([key, val]) => (
                      <div key={key} className="flex flex-col bg-theme-panel p-2.5 rounded-lg border border-theme-border/60">
                        <span className="text-[10px] text-theme-text-muted uppercase tracking-wider font-semibold capitalize">{key}</span>
                        <span className="text-base font-bold text-theme-text mt-1">{val} in</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery and Billing details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-theme-border">
                {/* Delivery */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-theme-accent uppercase tracking-widest font-serif">📦 Delivery & Collection</h4>
                  <div className="text-xs text-theme-text-muted leading-relaxed font-light bg-theme-bg p-3.5 rounded-xl border border-theme-border space-y-2">
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-semibold text-theme-text capitalize">{selectedOrderDetail.deliveryMethod === "pickup" ? "Store Pickup" : "Home Delivery"}</span>
                    </div>
                    {selectedOrderDetail.deliveryMethod === "delivery" ? (
                      <div className="border-t border-theme-border/60 pt-2">
                        <p className="font-bold text-theme-text mb-1">{selectedOrderDetail.deliveryName || selectedOrderDetail.name}</p>
                        <p className="whitespace-pre-wrap">{selectedOrderDetail.deliveryAddress || "No address provided."}</p>
                      </div>
                    ) : (
                      <div className="border-t border-theme-border/60 pt-2">
                        <p className="italic">Customer will collect the garment directly from the shop.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Billing / Invoice */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-theme-accent uppercase tracking-widest font-serif">💳 Payment & Invoicing</h4>
                  <div className="text-xs text-theme-text-muted leading-relaxed font-light bg-theme-bg p-3.5 rounded-xl border border-theme-border space-y-2">
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className={`font-bold capitalize ${selectedOrderDetail.paymentStatus === "paid" ? "text-emerald-500" : "text-amber-500 animate-pulse"}`}>
                        {selectedOrderDetail.paymentStatus || "unpaid"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-semibold text-theme-text uppercase">{selectedOrderDetail.paymentMethod || "card"}</span>
                    </div>
                    <div className="flex justify-between border-t border-theme-border pt-2 text-sm font-bold text-theme-accent">
                      <span>Total Invoice:</span>
                      <span>{selectedOrderDetail.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetail(null)}
                  className="rounded-xl border border-theme-border bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-theme-text-muted hover:bg-theme-accent-muted cursor-pointer"
                >
                  Close
                </button>
                {selectedOrderDetail.status === "CANCELLED" ? (
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider self-center">
                    THIS ORDER IS CANCELLED
                  </span>
                ) : selectedOrderDetail.status === "PENDING" ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleAcceptOrder(selectedOrderDetail.backendId);
                      setSelectedOrderDetail(null);
                    }}
                    className="rounded-xl bg-theme-accent hover:opacity-90 text-theme-bg px-6 py-2.5 text-xs font-bold transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    ACCEPT ORDER
                  </button>
                ) : selectedOrderDetail.status === "ACCEPTED" && !selectedOrderDetail.workStarted ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleStartWork(selectedOrderDetail.backendId);
                      setSelectedOrderDetail(null);
                    }}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    START WORK
                  </button>
                ) : selectedOrderDetail.estCompletion !== "COMPLETED" ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleCompleteOrder(selectedOrderDetail.backendId);
                      setSelectedOrderDetail(null);
                    }}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    COMPLETE TAILORING
                  </button>
                ) : selectedOrderDetail.deliveryMethod === "pickup" && selectedOrderDetail.paymentStatus === "unpaid" ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleMarkAsPaid(selectedOrderDetail.backendId);
                      setSelectedOrderDetail(null);
                    }}
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    MARK AS PAID
                  </button>
                ) : selectedOrderDetail.deliveryMethod === "delivery" && selectedOrderDetail.stage === "READY_TO_SHIP" ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleShipOrder(selectedOrderDetail.backendId);
                      setSelectedOrderDetail(null);
                    }}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white transition-all uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    SEND FOR DELIVERY
                  </button>
                ) : null}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
