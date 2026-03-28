import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────────
const COMMISSIONS = {
  active: [
    {
      id: 1,
      orderNo: "#AT-N021",
      estCompletion: "OCT 12",
      title: "Midnight Silk Tuxedo",
      tailor: "Arthur Savile",
      price: "$3,450.00",
      stage: "FIRST FITTING",
      stageIndex: 2,
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop&crop=center",
      actions: [
        { label: "Book Appointment", primary: true },
        { label: "View Details", primary: false },
      ],
      quickLinks: [
        { icon: "💬", label: "Message Arthur" },
        { icon: "🪡", label: "Fabric Specs" },
      ],
    },
    {
      id: 2,
      orderNo: "#AT-ST12",
      estCompletion: "NOV 06",
      title: "Vicuña Blend Overcoat",
      tailor: "Elena Rossi",
      price: "$8,200.00",
      stage: "PATTERN DRAFTING",
      stageIndex: 1,
      img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&h=400&fit=crop&crop=center",
      actions: [
        { label: "Update Measurements", primary: false },
        { label: "View Details", primary: false },
      ],
      quickLinks: [
        { icon: "📋", label: "Process Log" },
        { icon: "✉️", label: "Contact Support" },
      ],
    },
  ],
  archive: [
    {
      id: 3,
      orderNo: "#AT-B004",
      estCompletion: "MAR 01",
      title: "Navy Chalk Stripe Suit",
      tailor: "Marco Cellini",
      price: "$5,100.00",
      stage: "DELIVERED",
      stageIndex: 4,
      img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=500&h=400&fit=crop&crop=center",
      actions: [
        { label: "Reorder", primary: true },
        { label: "View Details", primary: false },
      ],
      quickLinks: [
        { icon: "⭐", label: "Leave Review" },
        { icon: "📄", label: "Invoice" },
      ],
    },
    {
      id: 4,
      orderNo: "#AT-K007",
      estCompletion: "JAN 20",
      title: "Ivory Linen Wedding Suit",
      tailor: "Kenji Tanaka",
      price: "$4,750.00",
      stage: "DELIVERED",
      stageIndex: 4,
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop&crop=center",
      actions: [
        { label: "Reorder", primary: true },
        { label: "View Details", primary: false },
      ],
      quickLinks: [
        { icon: "⭐", label: "Leave Review" },
        { icon: "📄", label: "Invoice" },
      ],
    },
  ],
  drafts: [
    {
      id: 5,
      orderNo: "#DRAFT-01",
      estCompletion: "TBD",
      title: "Burgundy Velvet Dinner Jacket",
      tailor: "Unassigned",
      price: "Est. $2,800.00",
      stage: "DRAFT",
      stageIndex: 0,
      img: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=500&h=400&fit=crop&crop=center",
      actions: [
        { label: "Continue Draft", primary: true },
        { label: "Discard", primary: false },
      ],
      quickLinks: [
        { icon: "✏️", label: "Edit Details" },
        { icon: "👤", label: "Assign Tailor" },
      ],
    },
  ],
};

const TABS = [
  { key: "active",  label: "Active Pieces", count: COMMISSIONS.active.length },
  { key: "archive", label: "Archive",        count: COMMISSIONS.archive.length },
  { key: "drafts",  label: "Drafts",         count: COMMISSIONS.drafts.length },
];

const STAGES = ["MEASURING", "DRAFTING", "FITTING", "FINAL STITCH", "DELIVER"];

// ── Progress Bar ───────────────────────────────────────────────
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

// ── Commission Card ────────────────────────────────────────────
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
      {/* Left: Image */}
      <div style={{ width: 180, minWidth: 180, flexShrink: 0, position: "relative" }}>
        <img
          src={item.img}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 60%, #161616)",
          }}
        />
      </div>

      {/* Middle: Info */}
      <div style={{ flex: 1, padding: "20px 24px" }}>
        {/* Order badge + est completion */}
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

        {/* Title */}
        <h2 style={{ color: "#F0F0F0", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {item.title}
        </h2>

        {/* Tailor */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div
            style={{
              width: 20, height: 20, borderRadius: "50%",
              backgroundColor: "#2A2A2A",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10,
            }}
          >
            👤
          </div>
          <span style={{ color: "#888", fontSize: 12 }}>
            Master Tailor:{" "}
            <span style={{ color: "#C0C0C0", fontWeight: 600 }}>{item.tailor}</span>
          </span>
        </div>

        {/* Price */}
        <p style={{ color: "#EAB800", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          {item.price}
        </p>

        {/* Progress */}
        <StageProgress stage={item.stage} stageIndex={item.stageIndex} />
      </div>

      {/* Right: Actions */}
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

        {/* Quick Links */}
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

// ── Main Page ──────────────────────────────────────────────────
export default function OrderList() {
  const [activeTab, setActiveTab] = useState("active");

  const items = COMMISSIONS[activeTab] || [];

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
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF", marginBottom: 4, letterSpacing: "-0.03em" }}>
          My Commissions
        </h1>
        <p style={{ fontSize: 10, color: "#EAB800", letterSpacing: "0.22em", fontWeight: 600 }}>
          TRACKING YOUR BESPOKE JOURNEY
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #222",
          marginBottom: 28,
        }}
      >
        {TABS.map((tab) => {
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

      {/* Cards */}
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