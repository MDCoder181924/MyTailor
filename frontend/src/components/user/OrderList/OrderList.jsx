import { useEffect, useMemo, useState } from "react";
import { X, Check, Clock, Truck, Ruler, ShoppingBag } from "lucide-react";
import { getProducts } from "../../../utils/productUtils";
import { getUserOrders, collectOrder, cancelUserOrder, submitOrderReview } from "../../../utils/orderUtils";

const fallbackImage = "https://picsum.photos/600/800?fashion";

const COMMISSIONS = {
  active: [],
  archive: [],
  drafts: [],
};

const STAGES = ["MEASURING", "DRAFTING", "FITTING", "FINAL STITCH", "DELIVER"];

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const resolveProductForOrder = (order, products) => {
  if (!Array.isArray(products) || !products.length) {
    return null;
  }

  const byId = products.find((product) => product._id === order.productId);
  if (byId) {
    return byId;
  }

  const orderTitle = normalizeText(order.title);
  const orderTailor = normalizeText(order.tailor);

  return (
    products.find((product) => {
      const sameTitle = normalizeText(product.productName) === orderTitle;
      const sameTailor = normalizeText(product.tailor?.tailorName) === orderTailor;
      return sameTitle && sameTailor;
    }) || null
  );
};

function StageProgress({ stage, stageIndex }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontSize: 10, color: "var(--theme-text-muted)", letterSpacing: "0.14em", marginBottom: 8 }}>
        CURRENT STAGE:{" "}
        <span style={{ color: "var(--theme-accent)", fontWeight: 700 }}>{stage}</span>
      </p>
      <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 6 }}>
        {STAGES.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: i <= stageIndex ? "var(--theme-accent)" : "var(--theme-border)",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>
      {!isMobile && (
        <div style={{ display: "flex", gap: 4 }}>
          {STAGES.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <span
                style={{
                  fontSize: 8,
                  color: i <= stageIndex ? "var(--theme-accent)" : "var(--theme-text-muted)",
                  letterSpacing: "0.06em",
                  fontWeight: i === stageIndex ? 700 : 400,
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommissionCard({ item, onCollect, onTrack, onViewDetails, onCancelOrder, onLeaveFeedback }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "var(--theme-panel)",
        border: "1px solid var(--theme-border)",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 0,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: isMobile ? "100%" : 180,
          height: isMobile ? 220 : "auto",
          minHeight: isMobile ? 220 : "auto",
          minWidth: isMobile ? "auto" : 180,
          flexShrink: 0,
          position: "relative",
        }}
      >
        <img
          src={item.img || fallbackImage}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      <div style={{ flex: 1, padding: isMobile ? "16px" : "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-bg)",
              fontSize: 9,
              fontWeight: 800,
              padding: "3px 8px",
              borderRadius: 4,
              letterSpacing: "0.1em",
            }}
          >
            ORDER {item.orderNo}
          </span>
          <span style={{ color: "var(--theme-text-muted)", fontSize: 10, letterSpacing: "0.1em" }}>
            EST. COMPLETION: {item.status === "PENDING" ? "PENDING ACCEPTANCE" : item.estCompletion}
          </span>
        </div>

        <h2 style={{ color: "var(--theme-text)", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {item.title}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "var(--theme-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "var(--theme-text-muted)",
            }}
          >
            U
          </div>
          <span style={{ color: "var(--theme-text-muted)", fontSize: 12 }}>
            Master Tailor:{" "}
            <span style={{ color: "var(--theme-text)", fontWeight: 600 }}>{item.tailor}</span>
          </span>
        </div>

        <p style={{ color: "var(--theme-accent)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          {item.price}
        </p>

        {item.selectedFabric || item.selectedSize ? (
          <p style={{ color: "var(--theme-text-muted)", fontSize: 12, marginBottom: 8 }}>
            {[
              item.selectedFabric ? `Material: ${item.selectedFabric}` : "",
              item.selectedSize ? `Size: ${item.selectedSize}` : "",
            ].filter(Boolean).join(" | ")}
          </p>
        ) : null}

        {/* Delivery Method & Payment Status Badges */}
        <div style={{ display: "flex", gap: 12, marginTop: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, backgroundColor: "var(--theme-border)", color: "var(--theme-text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {item.deliveryMethod === "pickup" ? "🏪 Store Pickup" : "📦 Home Delivery"}
          </span>
          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, backgroundColor: item.paymentStatus === "paid" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)", color: item.paymentStatus === "paid" ? "#34d399" : "#fbbf24", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", border: item.paymentStatus === "paid" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)" }}>
            {item.paymentStatus === "paid" ? "Paid" : "Unpaid"}
          </span>
        </div>

        {item.status === "PENDING" ? (
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, backgroundColor: "rgba(250, 204, 21, 0.06)", border: "1px dashed rgba(250, 204, 21, 0.25)", display: "inline-flex", items: "center", gap: 6 }}>
            <span style={{ color: "var(--theme-accent)", fontSize: 11, fontWeight: 600 }}>⏳ WAITING FOR TAILOR ACCEPTANCE</span>
          </div>
        ) : (
          <StageProgress stage={item.stage} stageIndex={item.stageIndex} />
        )}
      </div>

      <div
        style={{
          width: isMobile ? "100%" : 180,
          minWidth: isMobile ? "auto" : 180,
          borderLeft: isMobile ? "none" : "1px solid var(--theme-border)",
          borderTop: isMobile ? "1px solid var(--theme-border)" : "none",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {/* Render collection / confirmation buttons based on deliveryMethod */}
        {item.deliveryMethod === "pickup" && item.stage === "READY_FOR_PICKUP" && (
          <button
            onClick={() => onCollect(item.id)}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "none",
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-bg)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {item.paymentStatus === "paid" ? "🏪 Confirm Collection" : "🏪 Collect & Pay In-Store"}
          </button>
        )}

        {item.deliveryMethod === "delivery" && item.stage === "SHIPPED" && (
          <button
            onClick={() => onCollect(item.id)}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#10b981",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            ✅ I RECEIVED THE ORDER
          </button>
        )}

        {item.status !== "CANCELLED" && item.actions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              if (action.label === "Track Order") {
                onTrack(item);
              } else if (action.label === "View Details") {
                onViewDetails(item);
              }
            }}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "1px solid",
              borderColor: action.primary ? "var(--theme-accent)" : "var(--theme-border)",
              backgroundColor: action.primary ? "var(--theme-accent)" : "var(--theme-border)",
              color: action.primary ? "var(--theme-bg)" : "var(--theme-text)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {action.label}
          </button>
        ))}

        {item.status === "CANCELLED" && (
          <button
            onClick={() => onViewDetails(item)}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "1px solid var(--theme-border)",
              backgroundColor: "var(--theme-border)",
              color: "var(--theme-text)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            View Details
          </button>
        )}

        {(item.status === "PENDING" || (item.status === "ACCEPTED" && !item.workStarted)) && (
          <button
            onClick={() => onCancelOrder(item)}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "1px solid #ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "#f87171",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Cancel Order
          </button>
        )}

        {item.category === "archive" && item.status !== "CANCELLED" && !item.isReviewed && (
          <button
            onClick={() => onLeaveFeedback(item)}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "1px solid var(--theme-accent)",
              backgroundColor: "rgba(250, 204, 21, 0.08)",
              color: "var(--theme-accent)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Leave Feedback
          </button>
        )}

        {item.isReviewed && (
          <div style={{ textAlign: "center", padding: "8px 0", borderRadius: 8, border: "1px dashed rgba(16, 185, 129, 0.3)", backgroundColor: "rgba(16, 185, 129, 0.05)" }}>
            <span style={{ fontSize: 10, color: "#34d399", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              ✓ Reviewed
            </span>
          </div>
        )}

        {item.status === "CANCELLED" && (
          <div style={{ padding: "8px 10px", borderRadius: 8, backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px dashed rgba(239, 68, 68, 0.3)", textAlign: "center" }}>
            <p style={{ fontSize: 9, color: "#f87171", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
              Cancelled
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: 8,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            borderTop: "1px solid var(--theme-border)",
            paddingTop: 12,
          }}
        >
          {item.quickLinks.map((link) => (
            <button
              key={link.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 4px",
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              <span style={{ fontSize: 9, color: "var(--theme-text-muted)", letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.3 }}>
                {link.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Bespoke Details Modal ───────────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
      padding: 16,
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 640,
        borderRadius: 16,
        backgroundColor: "var(--theme-panel)",
        border: "1px solid var(--theme-border)",
        color: "var(--theme-text)",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--theme-border)",
          padding: "16px 24px",
        }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--theme-accent)", fontFamily: "serif" }}>Bespoke Order Details</h2>
            <p style={{ fontSize: 10, color: "var(--theme-text-muted)", margin: "4px 0 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Order No: {order.orderNo}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--theme-text-muted)",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Product Info Summary */}
          <div style={{ display: "flex", gap: 16, paddingBottom: 16, borderBottom: "1px solid var(--theme-border)" }}>
            <img
              src={order.img || fallbackImage}
              alt={order.title}
              style={{ width: 80, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid var(--theme-border)" }}
            />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontSize: 9, color: "var(--theme-accent)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Product Info
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "4px 0 2px 0", fontFamily: "serif" }}>{order.title}</h3>
              <p style={{ fontSize: 12, color: "var(--theme-text-muted)", margin: 0 }}>
                Tailor: <strong style={{ color: "var(--theme-text)" }}>{order.tailor}</strong>
              </p>
              <p style={{ fontSize: 16, color: "var(--theme-accent)", fontWeight: 700, margin: "8px 0 0 0" }}>
                {order.price}
              </p>
            </div>
          </div>

          {/* Configuration Selection */}
          <div style={{ paddingBottom: 16, borderBottom: "1px solid var(--theme-border)" }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-accent)", margin: "0 0 8px 0", letterSpacing: "0.08em" }}>
              Garment Configuration
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", fontSize: 12 }}>
              <div>Fabric / Material: <strong style={{ color: "var(--theme-text)" }}>{order.selectedFabric || "Standard"}</strong></div>
              <div>Brand Standard: <strong style={{ color: "var(--theme-text)" }}>{order.selectedBrand || "Standard"}</strong></div>
              <div>Size Choice: <strong style={{ color: "var(--theme-text)" }}>{order.selectedSize || "N/A"}</strong></div>
              <div>Clothing Type: <strong style={{ color: "var(--theme-text)" }}>{order.clothingType || "N/A"}</strong></div>
            </div>
          </div>

          {/* Custom Measurements */}
          {order.customMeasurements && Object.keys(order.customMeasurements).length > 0 ? (
            <div style={{ paddingBottom: 16, borderBottom: "1px solid var(--theme-border)" }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-accent)", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.08em" }}>
                <Ruler size={14} /> Custom Measurements
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
                {Object.entries(order.customMeasurements).map(([key, val]) => (
                  <div key={key} style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--theme-border)",
                  }}>
                    <div style={{ fontSize: 9, color: "var(--theme-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>{key}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--theme-text)", marginTop: 2 }}>{val} in</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Delivery Details */}
          <div style={{ paddingBottom: 16, borderBottom: "1px solid var(--theme-border)" }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-accent)", margin: "0 0 8px 0", letterSpacing: "0.08em" }}>
              Delivery Details
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div>Method: <strong style={{ color: "var(--theme-text)" }}>{order.deliveryMethod === "pickup" ? "🏪 Store Pickup" : "📦 Home Delivery"}</strong></div>
              {order.deliveryMethod !== "pickup" ? (
                <>
                  <div>Recipient: <strong style={{ color: "var(--theme-text)" }}>{order.deliveryName || "Customer"}</strong></div>
                  <div>Address: <span style={{ color: "var(--theme-text-muted)" }}>{order.deliveryAddress}</span></div>
                </>
              ) : (
                <div style={{ fontStyle: "italic", color: "var(--theme-text-muted)" }}>Please collect the completed order from the tailor's shop.</div>
              )}
            </div>
          </div>

          {/* Payment & Invoice details */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-accent)", margin: "0 0 8px 0", letterSpacing: "0.08em" }}>
              Payment & Invoice
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: 12 }}>
              <div>Payment Status: <strong style={{ color: order.paymentStatus === "paid" ? "#10b981" : "#fbbf24", textTransform: "uppercase" }}>{order.paymentStatus || "unpaid"}</strong></div>
              <div>Payment Method: <strong style={{ color: "var(--theme-text)", textTransform: "uppercase" }}>{order.paymentMethod || "card"}</strong></div>
              <div>Total Invoice: <strong style={{ color: "var(--theme-accent)" }}>{order.price}</strong></div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 24px",
          borderTop: "1px solid var(--theme-border)",
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-bg)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Tracking Modal ──────────────────────────────────────────
function OrderTrackingModal({ order, onClose }) {
  if (!order) return null;

  const isAccepted = order.status !== "PENDING";
  const isCompleted = order.stageIndex === 4 || order.stage === "READY_FOR_PICKUP" || order.stage === "READY_TO_SHIP" || order.stage === "SHIPPED" || order.stage === "COLLECTED" || order.stage === "DELIVERED";
  const isShipped = order.stage === "SHIPPED" || order.stage === "COLLECTED" || order.stage === "DELIVERED";
  const isFinalArchived = order.stage === "COLLECTED" || order.stage === "DELIVERED";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
      padding: 16,
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 560,
        borderRadius: 16,
        backgroundColor: "var(--theme-panel)",
        border: "1px solid var(--theme-border)",
        color: "var(--theme-text)",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--theme-border)",
          padding: "16px 24px",
        }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--theme-accent)", fontFamily: "serif" }}>Track Order</h2>
            <p style={{ fontSize: 10, color: "var(--theme-text-muted)", margin: "4px 0 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Order No: {order.orderNo}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--theme-text-muted)",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: "24px" }}>
          {/* Product Quick Recap */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "rgba(255,255,255,0.02)",
            padding: 12,
            borderRadius: 12,
            border: "1px solid var(--theme-border)",
            marginBottom: 24,
          }}>
            <img src={order.img || fallbackImage} alt={order.title} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "serif" }}>{order.title}</div>
              <div style={{ fontSize: 11, color: "var(--theme-text-muted)" }}>Master Tailor: <strong>{order.tailor}</strong></div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative", paddingLeft: 12 }}>
            
            {/* Step 1: Order Placed */}
            <div style={{ display: "flex", gap: 16, position: "relative" }}>
              {/* Connector line to step 2 */}
              <div style={{
                position: "absolute",
                left: 11,
                top: 24,
                bottom: -24,
                width: 2,
                backgroundColor: isAccepted ? "#10b981" : "var(--theme-border)",
                zIndex: 0,
              }} />
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                zIndex: 1,
                fontSize: 10,
              }}>
                <Check size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Order Placed Successfully</h4>
                <p style={{ fontSize: 11, color: "var(--theme-text-muted)", margin: "4px 0 0 0" }}>
                  Your commission request has been recorded and submitted to the tailor.
                </p>
              </div>
            </div>

            {/* Step 2: Tailor Acceptance */}
            <div style={{ display: "flex", gap: 16, position: "relative" }}>
              {/* Connector line to step 3 */}
              <div style={{
                position: "absolute",
                left: 11,
                top: 24,
                bottom: -24,
                width: 2,
                backgroundColor: isAccepted && isCompleted ? "#10b981" : "var(--theme-border)",
                zIndex: 0,
              }} />
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: isAccepted ? "#10b981" : "rgba(251, 191, 36, 0.1)",
                border: isAccepted ? "none" : "2px solid #fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isAccepted ? "#fff" : "#fbbf24",
                zIndex: 1,
                fontSize: 10,
              }}>
                {isAccepted ? <Check size={14} /> : <Clock size={14} className="animate-spin" />}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: isAccepted ? "var(--theme-text)" : "#fbbf24" }}>
                  {isAccepted ? "Order Accepted by Tailor" : "Waiting for Tailor Acceptance"}
                </h4>
                <p style={{ fontSize: 11, color: "var(--theme-text-muted)", margin: "4px 0 0 0" }}>
                  {isAccepted 
                    ? `Master Tailor ${order.tailor} has accepted your order and added it to their production schedule.`
                    : "The tailor is currently reviewing your bespoke design, sizing request, and fabric selection."}
                </p>
              </div>
            </div>

            {/* Step 3: Stitching & Fabrication */}
            <div style={{ display: "flex", gap: 16, position: "relative" }}>
              {/* Connector line to step 4 */}
              <div style={{
                position: "absolute",
                left: 11,
                top: 24,
                bottom: -24,
                width: 2,
                backgroundColor: isCompleted && (order.deliveryMethod === "pickup" || isShipped) ? "#10b981" : "var(--theme-border)",
                zIndex: 0,
              }} />
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: isCompleted ? "#10b981" : isAccepted ? "rgba(251, 191, 36, 0.1)" : "var(--theme-border)",
                border: isCompleted ? "none" : isAccepted ? "2px solid #fbbf24" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isCompleted ? "#fff" : isAccepted ? "#fbbf24" : "var(--theme-text-muted)",
                zIndex: 1,
                fontSize: 10,
              }}>
                {isCompleted ? <Check size={14} /> : isAccepted ? <Clock size={14} /> : 3}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: isCompleted ? "var(--theme-text)" : isAccepted ? "#fbbf24" : "var(--theme-text-muted)" }}>
                  Bespoke Production
                </h4>
                <p style={{ fontSize: 11, color: "var(--theme-text-muted)", margin: "4px 0 0 0" }}>
                  {!isAccepted 
                    ? "Production will begin once the tailor accepts the commission request."
                    : isCompleted 
                      ? "Stitching and final quality check complete! The garment has been fully tailor-crafted."
                      : `Stitching is actively in progress. Current stage: ${order.stage || "MEASURING"}.`}
                </p>
                {isAccepted && !isCompleted && (
                  <div style={{
                    marginTop: 8,
                    padding: "8px 12px",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--theme-border)",
                    borderRadius: 8,
                    fontSize: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                  }}>
                    <span style={{ fontWeight: 600 }}>PRODUCTION SUB-STAGES:</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {["MEASURING", "DRAFTING", "FITTING", "FINAL STITCH"].map((s, idx) => {
                        const isPast = order.stageIndex > idx;
                        const isCurrent = order.stageIndex === idx || order.stage === s;
                        return (
                          <div key={s} style={{
                            flex: 1,
                            padding: "4px 2px",
                            textAlign: "center",
                            borderRadius: 4,
                            backgroundColor: isCurrent ? "rgba(251, 191, 36, 0.15)" : isPast ? "rgba(16, 185, 129, 0.1)" : "transparent",
                            border: isCurrent ? "1px solid #fbbf24" : isPast ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid var(--theme-border)",
                            color: isCurrent ? "#fbbf24" : isPast ? "#34d399" : "var(--theme-text-muted)",
                            fontWeight: isCurrent ? 700 : 400,
                            fontSize: 8,
                          }}>
                            {s}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Collection / Shipping */}
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: isFinalArchived ? "#10b981" : isCompleted ? "rgba(251, 191, 36, 0.1)" : "var(--theme-border)",
                border: isFinalArchived ? "none" : isCompleted ? "2px solid #fbbf24" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isFinalArchived ? "#fff" : isCompleted ? "#fbbf24" : "var(--theme-text-muted)",
                zIndex: 1,
                fontSize: 10,
              }}>
                {isFinalArchived ? <Check size={14} /> : isCompleted ? (order.deliveryMethod === "pickup" ? <ShoppingBag size={12} /> : <Truck size={12} />) : 4}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: isFinalArchived ? "var(--theme-text)" : isCompleted ? "#fbbf24" : "var(--theme-text-muted)" }}>
                  {order.deliveryMethod === "pickup" ? "Store Pickup" : "Shipping & Home Delivery"}
                </h4>
                <p style={{ fontSize: 11, color: "var(--theme-text-muted)", margin: "4px 0 0 0" }}>
                  {order.deliveryMethod === "pickup" ? (
                    isFinalArchived 
                      ? "Collected! Thank you for choosing bespoke tailoring."
                      : isCompleted 
                        ? "Your order is ready for pickup! Visit the tailor's shop to collect it."
                        : "Ready for pickup step will unlock when production finishes."
                  ) : (
                    isFinalArchived 
                      ? "Garment delivered to your address! Hope you love the fit."
                      : isShipped 
                        ? "Garment is in transit! Expect delivery soon."
                        : isCompleted
                          ? "Your order is completed and being prepared for shipment."
                          : "Shipping step will unlock when production finishes."
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 24px",
          borderTop: "1px solid var(--theme-border)",
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-bg)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cancel Order Modal ─────────────────────────────────────────
function CancelOrderModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState("Changed my mind");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reasons = [
    "Changed my mind",
    "Measurements need adjustment",
    "Found a better price elsewhere",
    "Delivery timeline is too long",
    "Fabric selection error",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(order.id, { cancellationReason: reason, cancellationDetails: details });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
      padding: 16,
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 500,
        borderRadius: 16,
        backgroundColor: "var(--theme-panel)",
        border: "1px solid var(--theme-border)",
        color: "var(--theme-text)",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        padding: 24,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px 0", color: "#f87171", fontFamily: "serif" }}>Cancel Bespoke Order</h2>
        <p style={{ fontSize: 12, color: "var(--theme-text-muted)", margin: "0 0 20px 0" }}>
          Are you sure you want to cancel order <strong>{order.orderNo}</strong>? This action cannot be undone.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-text-muted)", marginBottom: 6, letterSpacing: "0.05em" }}>
              Reason for Cancellation
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid var(--theme-border)",
                backgroundColor: "var(--theme-bg)",
                color: "var(--theme-text)",
                padding: 10,
                fontSize: 13,
                outline: "none"
              }}
            >
              {reasons.map((r) => (
                <option key={r} value={r} style={{ backgroundColor: "var(--theme-panel)", color: "var(--theme-text)" }}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-text-muted)", marginBottom: 6, letterSpacing: "0.05em" }}>
              Full Details / Explanation
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide full details about why you want to cancel this order..."
              rows={4}
              required
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid var(--theme-border)",
                backgroundColor: "var(--theme-bg)",
                color: "var(--theme-text)",
                padding: 10,
                fontSize: 13,
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid var(--theme-border)",
                backgroundColor: "transparent",
                color: "var(--theme-text-muted)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {submitting ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Feedback / Review Modal ─────────────────────────────────────
function FeedbackModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(order.id, { rating, title, comment });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
      padding: 16,
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 500,
        borderRadius: 16,
        backgroundColor: "var(--theme-panel)",
        border: "1px solid var(--theme-border)",
        color: "var(--theme-text)",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        padding: 24,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px 0", color: "var(--theme-accent)", fontFamily: "serif" }}>Leave Tailor Feedback</h2>
        <p style={{ fontSize: 11, color: "var(--theme-text-muted)", margin: "0 0 20px 0" }}>
          Share your experience with tailor <strong>{order.tailor}</strong> for your <strong>{order.title}</strong>.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Star Rating Selector */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-text-muted)", marginBottom: 8, letterSpacing: "0.05em" }}>
              Rating
            </label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = hoverRating ? star <= hoverRating : star <= rating;
                return (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      fontSize: 28,
                      cursor: "pointer",
                      color: filled ? "var(--theme-accent)" : "rgba(255, 255, 255, 0.15)",
                      transition: "color 0.15s, transform 0.1s",
                      transform: hoverRating === star ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    ★
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-text-muted)", marginBottom: 6, letterSpacing: "0.05em" }}>
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent fit! / Perfect craftsmanship"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid var(--theme-border)",
                backgroundColor: "var(--theme-bg)",
                color: "var(--theme-text)",
                padding: 10,
                fontSize: 13,
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--theme-text-muted)", marginBottom: 6, letterSpacing: "0.05em" }}>
              Your Review / Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the fit, quality of stitch, fabric feel, communication, etc..."
              rows={4}
              required
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid var(--theme-border)",
                backgroundColor: "var(--theme-bg)",
                color: "var(--theme-text)",
                padding: 10,
                fontSize: 13,
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyEnd: "flex-end", gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid var(--theme-border)",
                backgroundColor: "transparent",
                color: "var(--theme-text-muted)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-bg)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderList() {
  const [activeTab, setActiveTab] = useState("active");
  const [storedOrders, setStoredOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
  const [selectedFeedbackOrder, setSelectedFeedbackOrder] = useState(null);

  const handleCancelOrderSubmit = async (orderId, { cancellationReason, cancellationDetails }) => {
    try {
      await cancelUserOrder(orderId, { cancellationReason, cancellationDetails });
      window.dispatchEvent(new Event("user-orders-updated"));
      window.dispatchEvent(new Event("tailor-orders-updated"));
      const nextOrders = await getUserOrders();
      setStoredOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch (err) {
      throw err;
    }
  };

  const handleFeedbackSubmit = async (orderId, { rating, title, comment }) => {
    try {
      await submitOrderReview(orderId, { rating, title, comment });
      window.dispatchEvent(new Event("user-orders-updated"));
      window.dispatchEvent(new Event("tailor-orders-updated"));
      const nextOrders = await getUserOrders();
      setStoredOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const nextProducts = await getProducts();
        setProducts(Array.isArray(nextProducts) ? nextProducts : []);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const syncOrders = async () => {
      try {
        const nextOrders = await getUserOrders();
        setStoredOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch {
        setStoredOrders([]);
      }
    };

    syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener("user-orders-updated", syncOrders);
    window.addEventListener("tailor-orders-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("user-orders-updated", syncOrders);
      window.removeEventListener("tailor-orders-updated", syncOrders);
    };
  }, []);

  // Self-healing notification sync for the User
  useEffect(() => {
    if (!storedOrders || storedOrders.length === 0) return;

    try {
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?._id;
      if (!userId) return;

      const notifKey = `notifications_${userId}`;
      const existingNotifs = JSON.parse(localStorage.getItem(notifKey) || "[]");
      let updated = false;

      storedOrders.forEach((order) => {
        const notificationsToPush = [];

        // 1. Order accepted
        if (order.status === "ACCEPTED" && order.stage !== "READY_FOR_PICKUP" && order.stage !== "READY_TO_SHIP") {
          notificationsToPush.push({
            id: `user-order-accepted-${order.id}`,
            title: "Order Accepted",
            message: `Your order #${order.orderNo} for "${order.title}" was accepted by tailor ${order.tailor}.`,
          });
        }

        // 2. Ready for Pickup
        if (order.stage === "READY_FOR_PICKUP") {
          notificationsToPush.push({
            id: `user-order-pickup-ready-${order.id}`,
            title: "Ready for Pickup",
            message: `Your order #${order.orderNo} is completed! Please collect it from the tailor's shop.`,
          });
        }

        // 3. Ready to Ship
        if (order.stage === "READY_TO_SHIP") {
          notificationsToPush.push({
            id: `user-order-ship-ready-${order.id}`,
            title: "Ready to Ship",
            message: `Your order #${order.orderNo} is completed and is being prepared for shipping by ${order.tailor}.`,
          });
        }

        // 4. Order Shipped
        if (order.stage === "SHIPPED") {
          notificationsToPush.push({
            id: `user-order-shipped-${order.id}`,
            title: "Order Shipped",
            message: `Your order #${order.orderNo} has been shipped! It is on its way.`,
          });
        }

        // 5. Payment Confirmed
        if (order.paymentStatus === "paid") {
          notificationsToPush.push({
            id: `user-order-paid-${order.id}`,
            title: "Payment Confirmed",
            message: `Payment confirmed by tailor for order #${order.orderNo}.`,
          });
        }

        // Push new notifications if they don't exist
        notificationsToPush.forEach((n) => {
          const exists = existingNotifs.some((ex) => ex.id === n.id);
          if (!exists) {
            existingNotifs.unshift({
              ...n,
              read: false,
              createdAt: new Date().toISOString(),
            });
            updated = true;
          }
        });
      });

      if (updated) {
        localStorage.setItem(notifKey, JSON.stringify(existingNotifs));
        window.dispatchEvent(new Event("user-notifications-updated"));
      }
    } catch (e) {
      console.error("Failed to sync notifications", e);
    }
  }, [storedOrders]);

  const handleCollect = async (orderId) => {
    try {
      await collectOrder(orderId);
      window.dispatchEvent(new Event("user-orders-updated"));
      window.dispatchEvent(new Event("tailor-orders-updated"));
      const nextOrders = await getUserOrders();
      setStoredOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch (err) {
      console.error("Failed to collect order", err);
    }
  };

  const hydratedOrders = useMemo(() => {
    return [...storedOrders]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .map((order) => {
        const matchedProduct = resolveProductForOrder(order, products);

        return {
          ...order,
          productId: order.productId || matchedProduct?._id,
          title: matchedProduct?.productName || order.title,
          tailor: matchedProduct?.tailor?.tailorName || order.tailor,
          price: matchedProduct ? `$${Number(matchedProduct.price)}` : order.price,
          img: matchedProduct?.image || order.img || fallbackImage,
        };
      });
  }, [products, storedOrders]);

  const orderSections = useMemo(
    () => ({
      active: [...hydratedOrders.filter((item) => item.category === "active"), ...COMMISSIONS.active],
      archive: [...hydratedOrders.filter((item) => item.category === "archive"), ...COMMISSIONS.archive],
      drafts: [...hydratedOrders.filter((item) => item.category === "drafts"), ...COMMISSIONS.drafts],
    }),
    [hydratedOrders]
  );

  const tabs = [
    { key: "active", label: "Active Pieces", count: orderSections.active.length },
    { key: "archive", label: "Archive", count: orderSections.archive.length },
    { key: "drafts", label: "Drafts", count: orderSections.drafts.length },
  ];

  const items = orderSections[activeTab] || [];

  return (
    <div
      style={{
        backgroundColor: "var(--theme-bg)",
        minHeight: "100vh",
        color: "var(--theme-text)",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: "36px 32px",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "var(--theme-text)", marginBottom: 4, letterSpacing: "-0.03em" }}>
          My Commissions
        </h1>
        <p style={{ fontSize: 10, color: "var(--theme-accent)", letterSpacing: "0.22em", fontWeight: 600 }}>
          TRACKING YOUR BESPOKE JOURNEY
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid var(--theme-border)",
          marginBottom: 28,
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: active ? "2px solid var(--theme-accent)" : "2px solid transparent",
                color: active ? "var(--theme-accent)" : "var(--theme-text-muted)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginBottom: -1,
                transition: "color 0.2s",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    backgroundColor: active ? "var(--theme-accent)" : "var(--theme-border)",
                    color: active ? "var(--theme-bg)" : "var(--theme-text-muted)",
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: 10,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--theme-text-muted)", padding: "60px 0", fontSize: 14 }}>
          No commissions in this section yet.
        </div>
      ) : (
        items.map((item) => (
          <CommissionCard
            key={item.id}
            item={item}
            onCollect={handleCollect}
            onTrack={(order) => setSelectedTrackOrder(order)}
            onViewDetails={(order) => setSelectedOrderDetail(order)}
            onCancelOrder={(order) => setSelectedCancelOrder(order)}
            onLeaveFeedback={(order) => setSelectedFeedbackOrder(order)}
          />
        ))
      )}

      {/* Bespoke Details Modal */}
      {selectedOrderDetail && (
        <OrderDetailModal
          order={selectedOrderDetail}
          onClose={() => setSelectedOrderDetail(null)}
        />
      )}

      {/* Track Order Modal */}
      {selectedTrackOrder && (
        <OrderTrackingModal
          order={selectedTrackOrder}
          onClose={() => setSelectedTrackOrder(null)}
        />
      )}

      {/* Cancel Order Modal */}
      {selectedCancelOrder && (
        <CancelOrderModal
          order={selectedCancelOrder}
          onClose={() => setSelectedCancelOrder(null)}
          onSubmit={handleCancelOrderSubmit}
        />
      )}

      {/* Feedback Modal */}
      {selectedFeedbackOrder && (
        <FeedbackModal
          order={selectedFeedbackOrder}
          onClose={() => setSelectedFeedbackOrder(null)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
