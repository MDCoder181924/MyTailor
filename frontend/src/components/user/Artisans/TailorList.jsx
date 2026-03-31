import { useEffect, useState } from "react";
import { getTailors } from "../../../utils/tailorUtils";
import defaultTailorImage from "../../../assets/images/by-defalt-tailor-img.avif";

const CATEGORIES = ["All Tailors"];
const LOCATIONS = ["All Locations"];
const RATINGS = ["All Ratings"];

function Stars() {
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
      Tailor
    </span>
  );
}

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
      }}
    >
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <img
          src={defaultTailorImage}
          alt={tailor.tailorName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            display: "block",
          }}
        />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Stars />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(to top, rgba(10,10,10,0.95), transparent)",
          }}
        />
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ color: "#606060", fontSize: 10, letterSpacing: "0.14em", marginBottom: 3 }}>
          REGISTERED TAILOR
        </p>
        <h3 style={{ color: "#E8E8E8", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
          {tailor.tailorName}
        </h3>
        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.1em", marginBottom: 12 }}>
          {tailor.tailorEmail}
        </p>
        <p style={{ color: "#A0A0A0", fontSize: 11 }}>
          {tailor.tailorMobileNumber}
        </p>
      </div>
    </div>
  );
}

function Dropdown({ options, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor: "#181818",
        border: "1px solid #2C2C2C",
        borderRadius: 8,
        padding: "7px 14px",
        color: "#C0C0C0",
        fontSize: 12,
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export default function TailorList() {
  const [activeCategory, setActiveCategory] = useState("All Tailors");
  const [location, setLocation] = useState("All Locations");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [search, setSearch] = useState("");
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTailors = async () => {
      try {
        setLoading(true);
        setError("");
        const tailorList = await getTailors();
        setTailors(tailorList);
      } catch (err) {
        setError(err.message || "Failed to load tailors");
      } finally {
        setLoading(false);
      }
    };

    loadTailors();
  }, []);

  const filtered = tailors.filter((t) => {
    const name = t.tailorName || "";
    const email = t.tailorEmail || "";
    const mobile = t.tailorMobileNumber || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      mobile.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={{ backgroundColor: "#0E0E0E", minHeight: "100vh", color: "#E8E8E8", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
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
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: "#2C2C2C" }} />

        <Dropdown options={LOCATIONS} value={location} onChange={setLocation} />
        <Dropdown options={RATINGS} value={ratingFilter} onChange={setRatingFilter} />

        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tailors..."
            style={{
              backgroundColor: "#181818",
              border: "1px solid #2C2C2C",
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 12,
              color: "#C0C0C0",
              outline: "none",
              width: 220,
            }}
          />
        </div>
      </div>

      <div style={{ padding: "28px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#888", padding: "80px 0", fontSize: 14 }}>
            Loading tailors...
          </div>
        ) : null}

        {!loading && error ? (
          <div style={{ textAlign: "center", color: "#d97706", padding: "80px 0", fontSize: 14 }}>
            {error}
          </div>
        ) : null}

        {!loading && !error && filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#444", padding: "80px 0", fontSize: 14 }}>
            No tailors found.
          </div>
        ) : null}

        {!loading && !error && filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((tailor) => (
              <TailorCard key={tailor._id} tailor={tailor} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
