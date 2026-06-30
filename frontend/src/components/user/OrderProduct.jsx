import { useState } from "react";

const SIZES = ["S", "M", "L", "XL", "2XL"];

const BRANDS = [
  { id: "custom", name: "Custom Tailor" },
  { id: "zara", name: "Zara" },
  { id: "hnm", name: "H&M" },
  { id: "levis", name: "Levi's" },
  { id: "adidas", name: "Adidas" },
  { id: "nike", name: "Nike" },
];

const BRAND_SIZE_CHARTS = {
  zara: {
    title: "Zara Sizing Guide",
    headers: ["Size", "Chest (in)", "Waist (in)", "Sleeve (in)"],
    rows: [
      ["XS", "34", "30", "31.5"],
      ["S", "36", "32", "32"],
      ["M", "38", "34", "32.5"],
      ["L", "40", "36", "33"],
      ["XL", "42", "38", "33.5"],
      ["2XL", "44", "40", "34"],
      ["3XL", "46", "42", "34.5"]
    ]
  },
  hnm: {
    title: "H&M Sizing Guide",
    headers: ["Size", "Chest (in)", "Waist (in)", "Sleeve (in)"],
    rows: [
      ["XS", "32-34", "28-30", "31"],
      ["S", "36-38", "31-33", "32"],
      ["M", "40-42", "34-36", "33"],
      ["L", "44-46", "38-40", "34"],
      ["XL", "48-50", "42-44", "35"],
      ["2XL", "52-54", "46-48", "36"]
    ]
  },
  levis: {
    title: "Levi's Sizing Guide",
    headers: ["Size", "Chest (in)", "Waist (in)", "Neck (in)"],
    rows: [
      ["XS", "32-34", "26-28", "13.5-14"],
      ["S", "35-37", "29-31", "14-14.5"],
      ["M", "38-40", "32-34", "15-15.5"],
      ["L", "41-43", "36-38", "16-16.5"],
      ["XL", "44-46", "40-42", "17-17.5"],
      ["2XL", "47-49", "44-46", "18-18.5"]
    ]
  },
  adidas: {
    title: "Adidas Sizing Guide",
    headers: ["Size", "Waist (in)", "Chest (in)", "Hip (in)"],
    rows: [
      ["XS", "27-29", "31-33", "32-34"],
      ["S", "30-32", "34-37", "35-37"],
      ["M", "33-35", "37-40", "38-40"],
      ["L", "36-38", "40-44", "40-44"],
      ["XL", "39-41", "44-48", "44-48"],
      ["2XL", "42-45", "48-52", "48-51"]
    ]
  },
  nike: {
    title: "Nike Sizing Guide",
    headers: ["Size", "Chest (in)", "Waist (in)", "Hip (in)"],
    rows: [
      ["XS", "32.5-35", "26-29", "32.5-35"],
      ["S", "35-37.5", "29-32", "35-37.5"],
      ["M", "37.5-41", "32-35", "37.5-41"],
      ["L", "41-44", "35-38", "41-44"],
      ["XL", "44-48.5", "38-43", "44-48.5"],
      ["2XL", "48.5-53.5", "43-47.5", "48.5-53.5"]
    ]
  },
  custom: {
    title: "Custom Tailor Sizing Guide",
    headers: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)"],
    rows: [
      ["XS", "34", "30", "16.5"],
      ["S", "36", "32", "17"],
      ["M", "38", "34", "17.5"],
      ["L", "40", "36", "18"],
      ["XL", "42", "38", "18.5"],
      ["2XL", "44", "40", "19"],
      ["3XL", "46", "42", "19.5"],
      ["4XL", "48", "44", "20"],
      ["5XL", "50", "46", "20.5"]
    ]
  }
};

const FABRICS = [
  { id: "imperial",  name: "Imperial Silk",    subtitle: "HAND-LOOMED ITALIAN SILK",  price: 800,  display: "+$800",   included: false },
  { id: "super150",  name: "Super 150s Wool",  subtitle: "ITALIAN MERINO EXCELLENCE", price: 0,    display: "INCLUDED",included: true  },
  { id: "cashmere",  name: "Heritage Cashmere",subtitle: "PURE GRADE CASHMERE",       price: 1200, display: "+$1,200", included: false },
];

const BASE_PRICE = 3500;

// ── (illustration removed) ────────────────────────────────────
function _unused() {
  return (
    <svg
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="suitGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b2a4a" />
          <stop offset="60%" stopColor="#0f1e38" />
          <stop offset="100%" stopColor="#080f1e" />
        </linearGradient>
        <linearGradient id="lapelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#243558" />
          <stop offset="100%" stopColor="#111d33" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0ede8" />
          <stop offset="100%" stopColor="#d8d4cc" />
        </linearGradient>
        <linearGradient id="goldSheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6a00" />
          <stop offset="40%" stopColor="#EAB800" />
          <stop offset="100%" stopColor="#a07800" />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
        </radialGradient>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="600" fill="url(#bgGrad)" />

      {/* Subtle texture lines */}
      {[...Array(20)].map((_, i) => (
        <line key={i} x1={i * 22} y1="0" x2={i * 22 - 60} y2="600"
          stroke="#ffffff" strokeOpacity="0.015" strokeWidth="1" />
      ))}

      {/* ── Suit body ── */}
      <g filter="url(#softShadow)">
        {/* Main jacket body */}
        <path
          d="M80 220 Q60 240 50 320 L50 600 L350 600 L350 320 Q340 240 320 220 L270 200 L200 230 L130 200 Z"
          fill="url(#suitGrad)"
        />

        {/* Left lapel */}
        <path
          d="M200 230 L130 200 L90 260 L155 310 Z"
          fill="url(#lapelGrad)"
          stroke="#2a3d5e" strokeWidth="0.5"
        />
        {/* Right lapel */}
        <path
          d="M200 230 L270 200 L310 260 L245 310 Z"
          fill="url(#lapelGrad)"
          stroke="#2a3d5e" strokeWidth="0.5"
        />

        {/* Lapel shine */}
        <path d="M200 230 L145 205 L100 255 L150 300 Z"
          fill="#ffffff" fillOpacity="0.04" />
        <path d="M200 230 L255 205 L300 255 L250 300 Z"
          fill="#ffffff" fillOpacity="0.04" />

        {/* Shirt front */}
        <path
          d="M155 310 L200 290 L245 310 L240 480 L160 480 Z"
          fill="url(#shirtGrad)"
        />

        {/* Shirt placket buttons */}
        {[340, 370, 400, 430].map((y, i) => (
          <circle key={i} cx="200" cy={y} r="3.5"
            fill="#c8c4bc" stroke="#a09890" strokeWidth="0.5" />
        ))}

        {/* Shirt fold lines */}
        <line x1="185" y1="315" x2="182" y2="475" stroke="#c0bbb2" strokeWidth="0.5" strokeOpacity="0.5" />
        <line x1="215" y1="315" x2="218" y2="475" stroke="#c0bbb2" strokeWidth="0.5" strokeOpacity="0.5" />

        {/* Bow tie */}
        <g transform="translate(200, 280)">
          {/* Left wing */}
          <path d="M0 0 L-28 -10 L-28 10 Z" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="0.5"/>
          <path d="M0 0 L-28 -10 L-22 0 L-28 10 Z" fill="#1a1a1a"/>
          {/* Right wing */}
          <path d="M0 0 L28 -10 L28 10 Z" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="0.5"/>
          <path d="M0 0 L28 -10 L22 0 L28 10 Z" fill="#1a1a1a"/>
          {/* Knot */}
          <ellipse cx="0" cy="0" rx="7" ry="9" fill="#111" stroke="#222" strokeWidth="0.5"/>
        </g>

        {/* Pocket square */}
        <path
          d="M102 310 L125 305 L128 325 L105 328 Z"
          fill="#f5f2ec"
        />
        <path d="M110 305 L118 295 L122 306" fill="#f5f2ec" />
        <path d="M115 304 L122 293 L126 305" fill="#ede9e2" />

        {/* Left shoulder seam */}
        <path d="M130 200 Q100 210 80 230" fill="none"
          stroke="#263a5a" strokeWidth="1.5" strokeOpacity="0.6" />
        {/* Right shoulder seam */}
        <path d="M270 200 Q300 210 320 230" fill="none"
          stroke="#263a5a" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Jacket button */}
        <circle cx="200" cy="420" r="8" fill="#0d1b30" stroke="#1e2e48" strokeWidth="1" />
        <circle cx="200" cy="420" r="5" fill="none" stroke="#263a5a" strokeWidth="0.8" />

        {/* Left sleeve */}
        <path
          d="M80 230 Q55 280 50 380 Q65 390 90 385 Q100 300 120 260 Z"
          fill="url(#suitGrad)"
        />
        {/* Right sleeve */}
        <path
          d="M320 230 Q345 280 350 380 Q335 390 310 385 Q300 300 280 260 Z"
          fill="url(#suitGrad)"
        />

        {/* Cuffs */}
        <path d="M50 370 Q50 390 70 393 Q90 395 90 375" fill="#e8e4dc" stroke="#d0ccc4" strokeWidth="0.5"/>
        <path d="M350 370 Q350 390 330 393 Q310 395 310 375" fill="#e8e4dc" stroke="#d0ccc4" strokeWidth="0.5"/>

        {/* Cufflinks - gold */}
        <rect x="58" y="378" width="14" height="6" rx="3" fill="url(#goldSheen)" />
        <rect x="328" y="378" width="14" height="6" rx="3" fill="url(#goldSheen)" />
      </g>

      {/* ── Collar / Neck ── */}
      <ellipse cx="200" cy="195" rx="38" ry="20" fill="#d4cfc8" />
      <path d="M175 185 Q200 175 225 185 L220 210 Q200 205 180 210 Z" fill="#e8e4dc" />

      {/* ── Face (abstract, stylised) ── */}
      <ellipse cx="200" cy="145" rx="52" ry="60" fill="#c8a882" />
      {/* Hair */}
      <path d="M148 120 Q150 80 200 75 Q250 80 252 120 Q240 100 200 98 Q160 100 148 120 Z"
        fill="#1a1008" />
      {/* Subtle face shading */}
      <ellipse cx="200" cy="155" rx="35" ry="42" fill="#c09870" fillOpacity="0.3" />
      {/* Eyes */}
      <ellipse cx="182" cy="140" rx="7" ry="5" fill="#1a1008" />
      <ellipse cx="218" cy="140" rx="7" ry="5" fill="#1a1008" />
      <circle cx="184" cy="139" r="2" fill="#fff" fillOpacity="0.3" />
      <circle cx="220" cy="139" r="2" fill="#fff" fillOpacity="0.3" />
      {/* Nose */}
      <path d="M197 150 Q200 162 203 150" fill="none" stroke="#a07855" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Mouth */}
      <path d="M190 168 Q200 174 210 168" fill="none" stroke="#8a6040" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Ear */}
      <ellipse cx="148" cy="150" rx="8" ry="12" fill="#be9e78" />
      <ellipse cx="252" cy="150" rx="8" ry="12" fill="#be9e78" />

      {/* Vignette overlay */}
      <rect width="400" height="600" fill="url(#vignette)" />

      {/* Bottom gradient for text readability */}
      <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="100%" stopColor="#080808" stopOpacity="0.95" />
      </linearGradient>
      <rect y="380" width="400" height="220" fill="url(#bottomFade)" />
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function OrderProduct() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedBrand, setSelectedBrand] = useState("custom");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState("super150");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");

  const fabric = FABRICS.find((f) => f.id === selectedFabric);
  const total = BASE_PRICE + (fabric?.price || 0);
  const fmt = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const inputStyle = {
    width: "100%", backgroundColor: "#111", border: "1px solid #2A2A2A",
    borderRadius: 6, padding: "9px 12px", fontSize: 12, color: "#C0C0C0",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };
  const labelStyle = {
    display: "block", fontSize: 9, color: "#555", letterSpacing: "0.14em",
    textTransform: "uppercase", marginBottom: 5,
  };

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", display: "flex", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── LEFT: Photo ── */}
      <div style={{ flex: "0 0 44%", position: "relative", overflow: "hidden", minHeight: "100vh", backgroundColor: "#0d0d1a" }}>
        <img
          src="https://picsum.photos/seed/tuxedo/800/1200"
          alt="Midnight Silk Tuxedo"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
        />
      </div>

      {/* ── RIGHT: Configurator ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "36px 32px", backgroundColor: "#0E0E0E" }}>

        {/* Section 01 */}
        <div style={{ marginBottom: 32 }}>
          <SectionHeader number="01" title="SELECT YOUR FIT" />
          
          {/* Brand Selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: "#666", letterSpacing: "0.14em", textTransform: "uppercase" }}>Brand Sizing Standard</span>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                style={{
                  background: "none", border: "none", color: "#EAB800", fontSize: 10,
                  letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase",
                  textDecoration: "underline", padding: 0
                }}
              >
                View Size Chart
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {BRANDS.map((brand) => {
                const isActive = selectedBrand === brand.id;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setSelectedBrand(brand.id)}
                    style={{
                      padding: "6px 12px", borderRadius: 15,
                      border: `1px solid ${isActive ? "#EAB800" : "#2A2A2A"}`,
                      backgroundColor: isActive ? "#EAB800" : "transparent",
                      color: isActive ? "#0E0E0E" : "#888",
                      fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {SIZES.map((s) => {
              const active = selectedSize === s;
              return (
                <button key={s} onClick={() => setSelectedSize(s)} style={{
                  width: 44, height: 36, borderRadius: 6,
                  border: `1px solid ${active ? "#EAB800" : "#2A2A2A"}`,
                  backgroundColor: active ? "#EAB800" : "transparent",
                  color: active ? "#0E0E0E" : "#666",
                  fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                }}>
                  {s}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em" }}>
            COMPLIMENTARY TAILORING AVAILABLE AFTER PURCHASE
            {selectedSize && selectedBrand !== "custom" && ` | STANDARD: ${BRANDS.find(b => b.id === selectedBrand)?.name.toUpperCase()} (${selectedSize})`}
          </p>
        </div>

        {/* Section 02 */}
        <div style={{ marginBottom: 32 }}>
          <SectionHeader number="02" title="CHOOSE YOUR FABRIC" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FABRICS.map((f) => {
              const active = selectedFabric === f.id;
              return (
                <button key={f.id} onClick={() => setSelectedFabric(f.id)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 8,
                  border: `1px solid ${active ? "#EAB800" : "#232323"}`,
                  backgroundColor: active ? "rgba(234,184,0,0.07)" : "#141414",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: active ? "#EAB800" : "#D0D0D0", marginBottom: 3 }}>
                      {f.name}
                    </p>
                    <p style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em" }}>{f.subtitle}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: f.included ? "#EAB800" : "#888", letterSpacing: "0.06em" }}>
                      {f.display}
                    </span>
                    {active && (
                      <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#EAB800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#0E0E0E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 03 */}
        <div style={{ marginBottom: 32 }}>
          <SectionHeader number="03" title="SHIPPING SANCTUARY" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Julian Montgomery" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#EAB800")} onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")} />
            </div>
            <div>
              <label style={labelStyle}>Shipping Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Avenue Montaigne 12" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#EAB800")} onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#EAB800")} onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")} />
              </div>
              <div>
                <label style={labelStyle}>Postal Code</label>
                <input value={postal} onChange={(e) => setPostal(e.target.value)} placeholder="75008" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#EAB800")} onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")} />
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div style={{ borderTop: "1px solid #1E1E1E", paddingTop: 20, marginBottom: 20 }}>
          <PriceLine label="Base Price" value={fmt(BASE_PRICE)} />
          <PriceLine label="Fabric Selection" value={fabric?.included ? "INCLUDED" : fmt(fabric?.price || 0)} gold={fabric?.included} />
          <PriceLine label="Private Courier" value="COMPLIMENTARY" gold />
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 11, color: "#606060", letterSpacing: "0.1em" }}>INVESTMENT TOTAL</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#EAB800", letterSpacing: "-0.02em" }}>{fmt(total)}</span>
        </div>

        {/* CTA */}
        <button
          style={{ width: "100%", padding: "15px 0", backgroundColor: "#EAB800", border: "none", borderRadius: 10, color: "#0E0E0E", fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background-color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D4A500")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EAB800")}
        >
          Proceed to Payment
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#0E0E0E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Sizing Chart Modal */}
      {isSizeChartOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)"
        }}>
          <div style={{
            position: "relative", width: "100%", maxWidth: 480,
            borderRadius: 16, border: "1px solid #2A2A2A", backgroundColor: "#0E0E0E",
            padding: 24, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)", color: "#FFF",
            fontFamily: "inherit"
          }}>
            <button
              type="button"
              onClick={() => setIsSizeChartOpen(false)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18
              }}
            >
              ✕
            </button>
            
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#EAB800", marginBottom: 8, marginTop: 0 }}>
              {BRAND_SIZE_CHARTS[selectedBrand]?.title || "Sizing Guide"}
            </h3>
            <p style={{ fontSize: 11, color: "#888", marginBottom: 16, marginTop: 0 }}>
              Measurements shown below are in inches. Click on any size to select it directly.
            </p>

            <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #2A2A2A", backgroundColor: "#141414" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2A2A2A", backgroundColor: "#1C1C1C", color: "#888", fontSize: 10, textTransform: "uppercase" }}>
                    {BRAND_SIZE_CHARTS[selectedBrand]?.headers.map((header) => (
                      <th key={header} style={{ padding: "8px 12px" }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BRAND_SIZE_CHARTS[selectedBrand]?.rows.map((row, idx) => {
                    const rowSize = row[0];
                    const isSelectedRow = selectedSize && rowSize.toUpperCase() === selectedSize.toUpperCase();
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid #2A2A2A",
                          backgroundColor: isSelectedRow ? "rgba(234,184,0,0.1)" : "transparent",
                          color: isSelectedRow ? "#EAB800" : "#CCC",
                          fontWeight: isSelectedRow ? 700 : 400,
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setSelectedSize(rowSize);
                          setIsSizeChartOpen(false);
                        }}
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{ padding: "10px 12px" }}>{cell}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>
                * Click a row to select that size
              </span>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(false)}
                style={{
                  padding: "8px 16px", borderRadius: 20, backgroundColor: "#EAB800",
                  border: "none", color: "#0E0E0E", fontSize: 11, fontWeight: 700, cursor: "pointer"
                }}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ number, title }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 11, color: "#EAB800", fontWeight: 700, fontStyle: "italic", letterSpacing: "0.06em" }}>{number}</span>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</h2>
    </div>
  );
}

function PriceLine({ label, value, gold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>{label.toUpperCase()}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: gold ? "#EAB800" : "#888", letterSpacing: "0.06em" }}>{value}</span>
    </div>
  );
}