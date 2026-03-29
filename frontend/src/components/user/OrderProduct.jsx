import { useState } from "react";

const SIZES = ["S", "M", "L", "XL", "2XL"];

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