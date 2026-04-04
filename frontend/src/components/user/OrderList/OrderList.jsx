import { useEffect, useMemo, useState } from "react";

const COMMISSIONS = {
  active: [],
  archive: [],
  drafts: [],
};

const getStoredOrders = () => {
  if (typeof window === "undefined") {
    return [];
  }

  let userId = "guest";

  try {
    const rawUser = localStorage.getItem("user");
    const parsedUser = rawUser ? JSON.parse(rawUser) : null;
    userId = parsedUser?._id || "guest";
  } catch {
    userId = "guest";
  }

  try {
    const value = localStorage.getItem(`orders_${userId}`);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const STAGES = ["MEASURING", "DRAFTING", "FITTING", "FINAL STITCH", "DELIVER"];

function StageProgress({ stage, stageIndex }) {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontSize: 10, color: "#606060", letterSpacing: "0.14em", marginBottom: 8 }}>
        CURRENT STAGE:{" "}
        <span style={{ color: "#EAB800", fontWeight: 700 }}>{stage}</span>
      </p>
      <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 6 }}>
        {STAGES.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: i <= stageIndex ? "#EAB800" : "#2C2C2C",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {STAGES.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <span
              style={{
                fontSize: 8,
                color: i <= stageIndex ? "#EAB800" : "#444",
                letterSpacing: "0.06em",
                fontWeight: i === stageIndex ? 700 : 400,
              }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommissionCard({ item }) {
  return (
    <div
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        gap: 0,
        marginBottom: 16,
      }}
    >
      <div style={{ width: 180, minWidth: 180, flexShrink: 0, position: "relative" }}>
        <img
          src={item.img}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, transparent 60%, #161616)",
          }}
        />
      </div>

      <div style={{ flex: 1, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span
            style={{
              backgroundColor: "#EAB800",
              color: "#0E0E0E",
              fontSize: 9,
              fontWeight: 800,
              padding: "3px 8px",
              borderRadius: 4,
              letterSpacing: "0.1em",
            }}
          >
            ORDER {item.orderNo}
          </span>
          <span style={{ color: "#606060", fontSize: 10, letterSpacing: "0.1em" }}>
            EST. COMPLETION: {item.estCompletion}
          </span>
        </div>

        <h2 style={{ color: "#F0F0F0", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {item.title}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#2A2A2A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
            }}
          >
            U
          </div>
          <span style={{ color: "#888", fontSize: 12 }}>
            Master Tailor:{" "}
            <span style={{ color: "#C0C0C0", fontWeight: 600 }}>{item.tailor}</span>
          </span>
        </div>

        <p style={{ color: "#EAB800", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          {item.price}
        </p>

        <StageProgress stage={item.stage} stageIndex={item.stageIndex} />
      </div>

      <div
        style={{
          width: 180,
          minWidth: 180,
          borderLeft: "1px solid #222",
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
              borderColor: action.primary ? "#EAB800" : "#2C2C2C",
              backgroundColor: action.primary ? "#EAB800" : "#1E1E1E",
              color: action.primary ? "#0E0E0E" : "#B0B0B0",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!action.primary) {
                e.currentTarget.style.borderColor = "#EAB800";
                e.currentTarget.style.color = "#EAB800";
              }
            }}
            onMouseLeave={(e) => {
              if (!action.primary) {
                e.currentTarget.style.borderColor = "#2C2C2C";
                e.currentTarget.style.color = "#B0B0B0";
              }
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
            borderTop: "1px solid #222",
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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1E1E1E")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              <span style={{ fontSize: 9, color: "#606060", letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.3 }}>
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
  const [storedOrders, setStoredOrders] = useState(() => getStoredOrders());

  useEffect(() => {
    const syncOrders = () => {
      setStoredOrders(getStoredOrders());
    };

    window.addEventListener("storage", syncOrders);
    window.addEventListener("user-orders-updated", syncOrders);
    window.addEventListener("tailor-orders-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("user-orders-updated", syncOrders);
      window.removeEventListener("tailor-orders-updated", syncOrders);
    };
  }, []);

  const orderSections = useMemo(
    () => ({
      active: [...storedOrders.filter((item) => item.category === "active"), ...COMMISSIONS.active],
      archive: [...storedOrders.filter((item) => item.category === "archive"), ...COMMISSIONS.archive],
      drafts: [...storedOrders.filter((item) => item.category === "drafts"), ...COMMISSIONS.drafts],
    }),
    [storedOrders]
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
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        color: "#E8E8E8",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: "36px 32px",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF", marginBottom: 4, letterSpacing: "-0.03em" }}>
          My Commissions
        </h1>
        <p style={{ fontSize: 10, color: "#EAB800", letterSpacing: "0.22em", fontWeight: 600 }}>
          TRACKING YOUR BESPOKE JOURNEY
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #222",
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
                borderBottom: active ? "2px solid #EAB800" : "2px solid transparent",
                color: active ? "#EAB800" : "#606060",
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
                    backgroundColor: active ? "#EAB800" : "#2A2A2A",
                    color: active ? "#0E0E0E" : "#666",
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
        <div style={{ textAlign: "center", color: "#444", padding: "60px 0", fontSize: 14 }}>
          No commissions in this section yet.
        </div>
      ) : (
        items.map((item) => <CommissionCard key={item.id} item={item} />)
      )}
    </div>
  );
}
