import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
          src={tailor.profilePhoto || defaultTailorImage}
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
          {tailor.professionalTitle || tailor.tailorEmail}
        </p>
        <p style={{ color: "#A0A0A0", fontSize: 11 }}>
          {tailor.shopAddress || tailor.tailorMobileNumber}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All Tailors");
  const [location, setLocation] = useState("All Locations");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef(null);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchContainerRef.current?.contains(event.target)) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    setSearch(nextSearch);
  }, [searchParams]);

  const normalizedSearch = search.trim().toLowerCase();

  const suggestions = normalizedSearch
    ? tailors
        .flatMap((tailor) => {
          const values = [
            tailor.tailorName,
            tailor.professionalTitle,
            tailor.shopName,
            tailor.shopAddress,
            tailor.tailorEmail,
          ]
            .filter((value) => typeof value === "string" && value.trim())
            .map((value) => value.trim());

          return [...new Set(values)].map((value) => ({
            id: `${tailor._id}-${value.toLowerCase()}`,
            label: value,
            tailorName: tailor.tailorName || "Tailor",
          }));
        })
        .filter((item) => item.label.toLowerCase().includes(normalizedSearch))
        .slice(0, 6)
    : [];

  const filtered = tailors.filter((t) => {
    const name = t.tailorName || "";
    const email = t.tailorEmail || "";
    const mobile = t.tailorMobileNumber || "";
    const title = t.professionalTitle || "";
    const shopName = t.shopName || "";
    const address = t.shopAddress || "";

    return (
      name.toLowerCase().includes(normalizedSearch) ||
      email.toLowerCase().includes(normalizedSearch) ||
      mobile.toLowerCase().includes(normalizedSearch) ||
      title.toLowerCase().includes(normalizedSearch) ||
      shopName.toLowerCase().includes(normalizedSearch) ||
      address.toLowerCase().includes(normalizedSearch)
    );
  });

  const applySuggestion = (value) => {
    setSearch(value);
    setSearchParams(value ? { search: value } : {});
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (event) => {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    }

    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      applySuggestion(suggestions[activeSuggestionIndex].label);
    }

    if (event.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

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

        <div ref={searchContainerRef} style={{ marginLeft: "auto", position: "relative" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              setSearchParams(value ? { search: value } : {});
              setShowSuggestions(true);
              setActiveSuggestionIndex(-1);
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
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
          {showSuggestions && suggestions.length > 0 ? (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 280,
                backgroundColor: "#151515",
                border: "1px solid #2C2C2C",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
                zIndex: 20,
              }}
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applySuggestion(suggestion.label)}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    padding: "10px 14px",
                    border: "none",
                    borderBottom: index === suggestions.length - 1 ? "none" : "1px solid #242424",
                    backgroundColor: activeSuggestionIndex === index ? "#202020" : "transparent",
                    color: "#E8E8E8",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{suggestion.label}</span>
                  <span style={{ fontSize: 11, color: "#8B8B8B" }}>{suggestion.tailorName}</span>
                </button>
              ))}
            </div>
          ) : null}
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
