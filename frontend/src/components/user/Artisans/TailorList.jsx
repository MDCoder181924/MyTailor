import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────────
const TAILORS = [
  { id: 1,  name: "Arthur Penhaligon", years: "32 YEARS EXP", specialty: "SAVILE ROW BESPOKE",        rating: 4.9, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face" },
  { id: 2,  name: "Marco Cellini",     years: "18 YEARS EXP", specialty: "MILANESE NEAPOLITAN",        rating: 4.8, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face" },
  { id: 3,  name: "Sasha Vykos",       years: "14 YEARS EXP", specialty: "MODERN MINIMALIST",          rating: 5.0, img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face" },
  { id: 4,  name: "Kenji Tanaka",      years: "22 YEARS EXP", specialty: "ORIENTAL STRUCTURALISM",     rating: 4.9, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face" },
  { id: 5,  name: "Oliver Reed",       years: "27 YEARS EXP", specialty: "ENGLISH COUNTRY ATTIRE",     rating: 4.7, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face" },
  { id: 6,  name: "Isabella Ross",     years: "11 YEARS EXP", specialty: "CONTEMPORARY DRAPERY",       rating: 4.8, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&crop=face" },
  { id: 7,  name: "Julian Thorne",     years: "19 YEARS EXP", specialty: "HERITAGE MENSWEAR",          rating: 4.6, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face" },
  { id: 8,  name: "Elias Vance",       years: "15 YEARS EXP", specialty: "ARCHITECTURAL TAILORING",    rating: 4.9, img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=500&fit=crop&crop=face" },
  { id: 9,  name: "Elena Moretti",     years: "24 YEARS EXP", specialty: "SOFT TAILORING & FABRICS",   rating: 4.7, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face" },
  { id: 10, name: "Stefan Klein",      years: "16 YEARS EXP", specialty: "PRECISION TROUSER MAKER",    rating: 4.8, img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&crop=face" },
  { id: 11, name: "Yara Solanke",      years: "9 YEARS EXP",  specialty: "BESPOKE EVENINGWEAR",        rating: 4.5, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face" },
  { id: 12, name: "Liam O'Conner",     years: "31 YEARS EXP", specialty: "GROOMS & GALA ATTIRE",       rating: 4.6, img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop&crop=face" },
];

const CATEGORIES = ["All Suits", "Suits", "Shirts", "Fabrics"];
const LOCATIONS  = ["Global Guild"];
const RATINGS    = ["All Ratings", "5 Stars", "4+ Stars"];

// ── Star Rating ────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span
      style={{
        backgroundColor: "#EAB800",
        color: "#0E0E0E",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 4,
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        letterSpacing: "0.02em",
      }}
    >
      ★ {rating.toFixed(1)}
    </span>
  );
}

// ── Tailor Card ────────────────────────────────────────────────
function TailorCard({ tailor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#141414",
        border: `1px solid ${hovered ? "#EAB800" : "#222"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(234,184,0,0.12)" : "0 2px 12px rgba(0,0,0,0.4)",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <img
          src={tailor.img}
          alt={tailor.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            display: "block",
          }}
        />
        {/* Rating badge */}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Stars rating={tailor.rating} />
        </div>
        {/* Bottom gradient overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "45%",
            background: "linear-gradient(to top, rgba(10,10,10,0.95), transparent)",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ color: "#606060", fontSize: 10, letterSpacing: "0.14em", marginBottom: 3 }}>
          {tailor.years}
        </p>
        <h3 style={{ color: "#E8E8E8", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
          {tailor.name}
        </h3>
        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.1em", marginBottom: 12 }}>
          {tailor.specialty}
        </p>

        <button
          style={{
            width: "100%",
            padding: "8px 0",
            backgroundColor: "transparent",
            border: "1px solid #2C2C2C",
            borderRadius: 6,
            color: "#C0C0C0",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#EAB800";
            e.currentTarget.style.color = "#EAB800";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2C2C2C";
            e.currentTarget.style.color = "#C0C0C0";
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 40 }}>
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        style={{
          width: 32, height: 32, borderRadius: 6,
          backgroundColor: "transparent",
          border: "1px solid #2C2C2C",
          color: current === 1 ? "#333" : "#888",
          cursor: current === 1 ? "default" : "pointer",
          fontSize: 14,
        }}
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            width: 32, height: 32, borderRadius: 6,
            backgroundColor: p === current ? "#EAB800" : "transparent",
            border: `1px solid ${p === current ? "#EAB800" : "#2C2C2C"}`,
            color: p === current ? "#0E0E0E" : "#888",
            fontWeight: p === current ? 700 : 400,
            fontSize: 12,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        style={{
          width: 32, height: 32, borderRadius: 6,
          backgroundColor: "transparent",
          border: "1px solid #2C2C2C",
          color: current === total ? "#333" : "#888",
          cursor: current === total ? "default" : "pointer",
          fontSize: 14,
        }}
      >
        ›
      </button>
    </div>
  );
}

// ── Dropdown ───────────────────────────────────────────────────
function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          backgroundColor: "#181818",
          border: "1px solid #2C2C2C",
          borderRadius: 8,
          padding: "7px 14px",
          color: "#C0C0C0",
          fontSize: 12,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {value}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
            backgroundColor: "#1E1E1E",
            border: "1px solid #2C2C2C",
            borderRadius: 8,
            minWidth: "100%",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "9px 14px",
                backgroundColor: opt === value ? "#2A2A2A" : "transparent",
                border: "none",
                color: opt === value ? "#EAB800" : "#C0C0C0",
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#252525")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = opt === value ? "#2A2A2A" : "transparent")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function TailorList() {
    
  const [activeCategory, setActiveCategory] = useState("All Suits");
  const [location, setLocation]             = useState("Global Guild");
  const [ratingFilter, setRatingFilter]     = useState("All Ratings");
  const [search, setSearch]                 = useState("");
  const [page, setPage]                     = useState(1);

  const PER_PAGE = 12;

  const filtered = TAILORS.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.specialty.toLowerCase().includes(search.toLowerCase());
    const matchRating =
      ratingFilter === "All Ratings" ? true :
      ratingFilter === "5 Stars"     ? t.rating >= 5.0 :
                                       t.rating >= 4.0;
    return matchSearch && matchRating;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ backgroundColor: "#0E0E0E", minHeight: "100vh", color: "#E8E8E8", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── Top Nav Bar ── */}
      <div
        style={{
          backgroundColor: "#111",
          borderBottom: "1px solid #1E1E1E",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Category pills */}
        <div style={{ display: "flex", gap: 6 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                border: "none",
                backgroundColor: c === activeCategory ? "#EAB800" : "#1E1E1E",
                color: c === activeCategory ? "#0E0E0E" : "#888",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, backgroundColor: "#2C2C2C" }} />

        {/* Dropdowns */}
        <Dropdown options={LOCATIONS} value={location} onChange={setLocation} />
        <Dropdown options={RATINGS}   value={ratingFilter} onChange={setRatingFilter} />

        {/* Search */}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <svg
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke="#606060" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="#606060" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search tailors..."
            style={{
              backgroundColor: "#181818",
              border: "1px solid #2C2C2C",
              borderRadius: 8,
              padding: "7px 14px 7px 32px",
              fontSize: 12,
              color: "#C0C0C0",
              outline: "none",
              width: 180,
            }}
          />
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ padding: "28px 24px" }}>
        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", color: "#444", padding: "80px 0", fontSize: 14 }}>
            No tailors found matching your search.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {paginated.map((tailor) => (
              <TailorCard key={tailor.id} tailor={tailor} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination current={page} total={totalPages} onChange={setPage} />
        )}
      </div>
    </div>
  );
}