import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../../../utils/productUtils";
import { getUserOrders } from "../../../utils/orderUtils";

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

function CommissionCard({ item }) {
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

        {(item.selectedFabric || item.selectedSize) ? (
          <p style={{ color: "var(--theme-text-muted)", fontSize: 12, marginBottom: 8 }}>
            {[
              item.selectedFabric ? `Material: ${item.selectedFabric}` : "",
              item.selectedSize ? `Size: ${item.selectedSize}` : "",
            ].filter(Boolean).join(" | ")}
          </p>
        ) : null}

        {item.status === "PENDING" ? (
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, backgroundColor: "rgba(250, 204, 21, 0.06)", border: "1px dashed rgba(250, 204, 21, 0.25)", display: "inline-flex", alignItems: "center", gap: 6 }}>
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
          gap: 8,
        }}
      >
        {item.actions.map((action) => (
          <button
            key={action.label}
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

export default function OrderList() {
  const [activeTab, setActiveTab] = useState("active");
  const [storedOrders, setStoredOrders] = useState([]);
  const [products, setProducts] = useState([]);

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
        items.map((item) => <CommissionCard key={item.id} item={item} />)
      )}
    </div>
  );
}
