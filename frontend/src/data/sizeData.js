/**
 * Comprehensive size data for all clothing types and brands.
 * Used by the user-side OrderProduct page.
 */

// ─── Expanded product categories ───────────────────────────────
export const CATEGORIES = [
  "Suits",
  "Shirts",
  "T-Shirts",
  "Trousers",
  "Jeans",
  "Kurta",
  "Choli",
  "Blazer",
  "Coat",
  "Sherwani",
  "Jacket",
  "Shorts",
  "Lehenga",
  "Saree Blouse",
  "Accessories",
  "Other",
];

// ─── Category → Clothing type mapping ──────────────────────────
// Maps product categories to their sizing "type" which determines
// which size chart and measurement fields to show.
const _CATEGORY_TO_TYPE = {
  suits: "formal_shirt",
  shirts: "formal_shirt",
  "t-shirts": "tshirt",
  trousers: "pant",
  jeans: "pant",
  kurta: "kurta",
  choli: "choli",
  blazer: "blazer",
  coat: "coat",
  sherwani: "sherwani",
  jacket: "jacket",
  shorts: "shorts",
  lehenga: "lehenga",
  "saree blouse": "choli",
  accessories: null,
  other: "tshirt",
};

export const getClothingType = (category) => {
  if (!category) return "tshirt";
  const key = category.trim().toLowerCase();
  return _CATEGORY_TO_TYPE[key] || "tshirt";
};

// ─── Size options per clothing type ────────────────────────────
export const SIZE_OPTIONS = {
  tshirt: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  formal_shirt: ["S", "M", "L", "XL", "XXL", "3XL"],
  pant: ["28", "30", "32", "34", "36", "38", "40"],
  kurta: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  choli: ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
  blazer: ["36", "38", "40", "42", "44", "46", "48"],
  coat: ["36", "38", "40", "42", "44", "46", "48"],
  sherwani: ["36", "38", "40", "42", "44", "46"],
  jacket: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  shorts: ["28", "30", "32", "34", "36", "38", "40"],
  lehenga: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
};

// ─── Standard (generic) size charts per clothing type ──────────
export const STANDARD_SIZE_CHARTS = {
  tshirt: {
    title: "T-Shirt / Casual Shirt Size Chart",
    headers: ["Size", "Chest (in)", "Chest (cm)"],
    rows: [
      ["XS", "34–36", "86–91"],
      ["S", "36–38", "91–97"],
      ["M", "38–40", "97–102"],
      ["L", "40–42", "102–107"],
      ["XL", "42–44", "107–112"],
      ["XXL", "44–46", "112–117"],
      ["3XL", "46–48", "117–122"],
    ],
  },
  formal_shirt: {
    title: "Formal Shirt Size Chart",
    headers: ["Size", "Chest (in)", "Neck (in)"],
    rows: [
      ["S", "38", "15"],
      ["M", "39", "15.5"],
      ["L", "40", "15.75"],
      ["XL", "42", "16.5"],
      ["XXL", "44", "17.5"],
      ["3XL", "46", "18"],
    ],
  },
  pant: {
    title: "Jeans / Trouser Size Chart",
    headers: ["Waist Size", "Waist (in)", "Waist (cm)"],
    rows: [
      ["28", "28", "71"],
      ["30", "30", "76"],
      ["32", "32", "81"],
      ["34", "34", "86"],
      ["36", "36", "91"],
      ["38", "38", "97"],
      ["40", "40", "102"],
    ],
  },
  kurta: {
    title: "Kurta Size Chart",
    headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
    rows: [
      ["XS", "36", "27", "15.5"],
      ["S", "38", "28", "16"],
      ["M", "40", "29", "16.5"],
      ["L", "42", "30", "17"],
      ["XL", "44", "31", "17.5"],
      ["XXL", "46", "32", "18"],
      ["3XL", "48", "33", "18.5"],
    ],
  },
  choli: {
    title: "Choli / Blouse Size Chart",
    headers: ["Size", "Bust (in)", "Waist (in)", "Back Length (in)"],
    rows: [
      ["28", "28", "24", "14"],
      ["30", "30", "26", "14.5"],
      ["32", "32", "28", "15"],
      ["34", "34", "30", "15"],
      ["36", "36", "32", "15.5"],
      ["38", "38", "34", "16"],
      ["40", "40", "36", "16"],
      ["42", "42", "38", "16.5"],
      ["44", "44", "40", "17"],
    ],
  },
  blazer: {
    title: "Blazer Size Chart",
    headers: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)"],
    rows: [
      ["36", "36", "30", "17"],
      ["38", "38", "32", "17.5"],
      ["40", "40", "34", "18"],
      ["42", "42", "36", "18.5"],
      ["44", "44", "38", "19"],
      ["46", "46", "40", "19.5"],
      ["48", "48", "42", "20"],
    ],
  },
  coat: {
    title: "Coat / Overcoat Size Chart",
    headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)"],
    rows: [
      ["36", "36", "30", "30"],
      ["38", "38", "32", "31"],
      ["40", "40", "34", "32"],
      ["42", "42", "36", "33"],
      ["44", "44", "38", "34"],
      ["46", "46", "40", "35"],
      ["48", "48", "42", "36"],
    ],
  },
  sherwani: {
    title: "Sherwani Size Chart",
    headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)"],
    rows: [
      ["36", "36", "30", "38"],
      ["38", "38", "32", "39"],
      ["40", "40", "34", "40"],
      ["42", "42", "36", "41"],
      ["44", "44", "38", "42"],
      ["46", "46", "40", "43"],
    ],
  },
  jacket: {
    title: "Jacket Size Chart",
    headers: ["Size", "Chest (in)", "Shoulder (in)", "Sleeve (in)"],
    rows: [
      ["XS", "34–36", "16.5", "24"],
      ["S", "36–38", "17", "24.5"],
      ["M", "38–40", "17.5", "25"],
      ["L", "40–42", "18", "25.5"],
      ["XL", "42–44", "18.5", "26"],
      ["XXL", "44–46", "19", "26.5"],
      ["3XL", "46–48", "19.5", "27"],
    ],
  },
  shorts: {
    title: "Shorts Size Chart",
    headers: ["Waist Size", "Waist (in)", "Hip (in)", "Length (in)"],
    rows: [
      ["28", "28", "34", "17"],
      ["30", "30", "36", "17.5"],
      ["32", "32", "38", "18"],
      ["34", "34", "40", "18.5"],
      ["36", "36", "42", "19"],
      ["38", "38", "44", "19.5"],
      ["40", "40", "46", "20"],
    ],
  },
  lehenga: {
    title: "Lehenga Size Chart",
    headers: ["Size", "Waist (in)", "Hip (in)", "Length (in)"],
    rows: [
      ["XS", "24–26", "34–36", "40"],
      ["S", "26–28", "36–38", "40"],
      ["M", "28–30", "38–40", "41"],
      ["L", "30–32", "40–42", "41"],
      ["XL", "32–34", "42–44", "42"],
      ["XXL", "34–36", "44–46", "42"],
      ["3XL", "36–38", "46–48", "43"],
    ],
  },
};

// ─── Brands ────────────────────────────────────────────────────
export const BRANDS = [
  { id: "standard", name: "Standard" },
  { id: "nike", name: "Nike" },
  { id: "adidas", name: "Adidas" },
  { id: "puma", name: "Puma" },
  { id: "levis", name: "Levi's" },
  { id: "us_polo", name: "U.S. Polo" },
  { id: "allen_solly", name: "Allen Solly" },
  { id: "van_heusen", name: "Van Heusen" },
  { id: "peter_england", name: "Peter England" },
  { id: "louis_philippe", name: "Louis Philippe" },
  { id: "hnm", name: "H&M" },
  { id: "zara", name: "ZARA" },
  { id: "uniqlo", name: "Uniqlo" },
  { id: "jack_jones", name: "Jack & Jones" },
  { id: "tommy", name: "Tommy Hilfiger" },
  { id: "calvin_klein", name: "Calvin Klein" },
  { id: "wrangler", name: "Wrangler" },
  { id: "lee", name: "Lee" },
  { id: "spykar", name: "Spykar" },
  { id: "mufti", name: "Mufti" },
  { id: "roadster", name: "Roadster" },
  { id: "highlander", name: "Highlander" },
  { id: "snitch", name: "Snitch" },
  { id: "rare_rabbit", name: "Rare Rabbit" },
  { id: "bewakoof", name: "Bewakoof" },
  { id: "souled_store", name: "The Souled Store" },
];

// ─── Brand size charts (per clothing type) ─────────────────────
// Each brand maps to an object of clothing type → chart.
// If a brand doesn't have a specific chart for a clothing type,
// the standard chart is used as fallback.
export const BRAND_SIZE_CHARTS = {
  // ── Nike ──────────────────────────────────────────────────
  nike: {
    tshirt: {
      title: "Nike T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Hip (in)"],
      rows: [
        ["XS", "32.5–35", "26–29", "32.5–35"],
        ["S", "35–37.5", "29–32", "35–37.5"],
        ["M", "37.5–41", "32–35", "37.5–41"],
        ["L", "41–44", "35–38", "41–44"],
        ["XL", "44–48.5", "38–43", "44–48.5"],
        ["XXL", "48.5–53.5", "43–47.5", "48.5–53.5"],
        ["3XL", "53.5–58", "47.5–52", "53.5–58"],
      ],
    },
    pant: {
      title: "Nike Trouser Sizing",
      headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28–29", "34–35", "30"],
        ["30", "30–31", "36–37", "31"],
        ["32", "32–33", "38–39", "32"],
        ["34", "34–35", "40–41", "32"],
        ["36", "36–37", "42–43", "32"],
        ["38", "38–39", "44–45", "32"],
        ["40", "40–41", "46–47", "32"],
      ],
    },
    jacket: {
      title: "Nike Jacket Sizing",
      headers: ["Size", "Chest (in)", "Shoulder (in)", "Sleeve (in)"],
      rows: [
        ["XS", "32–34", "16", "24"],
        ["S", "35–37", "17", "25"],
        ["M", "38–40", "18", "25.5"],
        ["L", "41–43", "19", "26"],
        ["XL", "44–46", "20", "26.5"],
        ["XXL", "47–49", "21", "27"],
        ["3XL", "50–52", "22", "27.5"],
      ],
    },
    shorts: {
      title: "Nike Shorts Sizing",
      headers: ["Size", "Waist (in)", "Hip (in)", "Outseam (in)"],
      rows: [
        ["28", "28", "34", "18"],
        ["30", "30", "36", "18.5"],
        ["32", "32", "38", "19"],
        ["34", "34", "40", "19.5"],
        ["36", "36", "42", "20"],
        ["38", "38", "44", "20.5"],
        ["40", "40", "46", "21"],
      ],
    },
  },

  // ── Adidas ────────────────────────────────────────────────
  adidas: {
    tshirt: {
      title: "Adidas T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Hip (in)"],
      rows: [
        ["XS", "31–33", "27–29", "32–34"],
        ["S", "34–37", "30–32", "35–37"],
        ["M", "37–40", "33–35", "38–40"],
        ["L", "40–44", "36–38", "40–44"],
        ["XL", "44–48", "39–41", "44–48"],
        ["XXL", "48–52", "42–45", "48–51"],
        ["3XL", "52–56", "45–49", "51–55"],
      ],
    },
    pant: {
      title: "Adidas Trouser Sizing",
      headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "27–29", "33–35", "30"],
        ["30", "29–31", "35–37", "31"],
        ["32", "31–33", "37–39", "31"],
        ["34", "33–35", "39–41", "32"],
        ["36", "35–37", "41–43", "32"],
        ["38", "37–39", "43–45", "32"],
        ["40", "39–41", "45–47", "32"],
      ],
    },
    jacket: {
      title: "Adidas Jacket Sizing",
      headers: ["Size", "Chest (in)", "Shoulder (in)", "Sleeve (in)"],
      rows: [
        ["XS", "32–34", "16", "24"],
        ["S", "35–37", "17", "25"],
        ["M", "38–40", "18", "25.5"],
        ["L", "41–43", "18.5", "26"],
        ["XL", "44–47", "19.5", "26.5"],
        ["XXL", "48–51", "20.5", "27"],
        ["3XL", "52–55", "21.5", "27.5"],
      ],
    },
  },

  // ── Puma ──────────────────────────────────────────────────
  puma: {
    tshirt: {
      title: "Puma T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)"],
      rows: [
        ["XS", "33–35", "27–29", "26"],
        ["S", "35–37", "29–31", "27"],
        ["M", "37–39", "31–33", "28"],
        ["L", "39–42", "33–36", "29"],
        ["XL", "42–45", "36–39", "30"],
        ["XXL", "45–48", "39–42", "31"],
        ["3XL", "48–51", "42–45", "32"],
      ],
    },
  },

  // ── Levi's ────────────────────────────────────────────────
  levis: {
    tshirt: {
      title: "Levi's T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Neck (in)"],
      rows: [
        ["XS", "32–34", "26–28", "13.5–14"],
        ["S", "35–37", "29–31", "14–14.5"],
        ["M", "38–40", "32–34", "15–15.5"],
        ["L", "41–43", "36–38", "16–16.5"],
        ["XL", "44–46", "40–42", "17–17.5"],
        ["XXL", "47–49", "44–46", "18–18.5"],
        ["3XL", "50–52", "48–50", "19–19.5"],
      ],
    },
    pant: {
      title: "Levi's Jeans Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "34", "30"],
        ["30", "30", "36", "30"],
        ["32", "32", "38", "32"],
        ["34", "34", "40", "32"],
        ["36", "36", "42", "32"],
        ["38", "38", "44", "32"],
        ["40", "40", "46", "32"],
      ],
    },
  },

  // ── ZARA ──────────────────────────────────────────────────
  zara: {
    tshirt: {
      title: "ZARA T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Sleeve (in)"],
      rows: [
        ["XS", "34", "30", "31.5"],
        ["S", "36", "32", "32"],
        ["M", "38", "34", "32.5"],
        ["L", "40", "36", "33"],
        ["XL", "42", "38", "33.5"],
        ["XXL", "44", "40", "34"],
        ["3XL", "46", "42", "34.5"],
      ],
    },
    formal_shirt: {
      title: "ZARA Formal Shirt Sizing",
      headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)"],
      rows: [
        ["S", "38", "15", "32"],
        ["M", "39", "15.5", "32.5"],
        ["L", "40", "15.75", "33"],
        ["XL", "42", "16.5", "33.5"],
        ["XXL", "44", "17.5", "34"],
        ["3XL", "46", "18", "34.5"],
      ],
    },
    pant: {
      title: "ZARA Trouser Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "34", "30"],
        ["30", "30", "36", "31"],
        ["32", "32", "38", "32"],
        ["34", "34", "40", "32"],
        ["36", "36", "42", "32"],
        ["38", "38", "44", "32"],
        ["40", "40", "46", "32"],
      ],
    },
    blazer: {
      title: "ZARA Blazer Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)"],
      rows: [
        ["36", "36", "30", "16.5"],
        ["38", "38", "32", "17"],
        ["40", "40", "34", "17.5"],
        ["42", "42", "36", "18"],
        ["44", "44", "38", "18.5"],
        ["46", "46", "40", "19"],
        ["48", "48", "42", "19.5"],
      ],
    },
  },

  // ── H&M ───────────────────────────────────────────────────
  hnm: {
    tshirt: {
      title: "H&M T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Sleeve (in)"],
      rows: [
        ["XS", "32–34", "28–30", "31"],
        ["S", "36–38", "31–33", "32"],
        ["M", "40–42", "34–36", "33"],
        ["L", "44–46", "38–40", "34"],
        ["XL", "48–50", "42–44", "35"],
        ["XXL", "52–54", "46–48", "36"],
        ["3XL", "56–58", "50–52", "37"],
      ],
    },
    pant: {
      title: "H&M Trouser Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28–29", "33–35", "30"],
        ["30", "30–31", "35–37", "31"],
        ["32", "32–33", "37–39", "32"],
        ["34", "34–35", "39–41", "32"],
        ["36", "36–37", "41–43", "32"],
        ["38", "38–39", "43–45", "32"],
        ["40", "40–41", "45–47", "32"],
      ],
    },
    kurta: {
      title: "H&M Kurta Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "35", "27", "15"],
        ["S", "37", "28", "16"],
        ["M", "39", "29", "16.5"],
        ["L", "41", "30", "17"],
        ["XL", "43", "31", "17.5"],
        ["XXL", "45", "32", "18"],
        ["3XL", "47", "33", "18.5"],
      ],
    },
  },

  // ── U.S. Polo ─────────────────────────────────────────────
  us_polo: {
    tshirt: {
      title: "U.S. Polo T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "34", "26", "16"],
        ["S", "36", "27", "16.5"],
        ["M", "38", "28", "17"],
        ["L", "40", "29", "17.5"],
        ["XL", "42", "30", "18"],
        ["XXL", "44", "31", "18.5"],
        ["3XL", "46", "32", "19"],
      ],
    },
    formal_shirt: {
      title: "U.S. Polo Formal Shirt",
      headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)"],
      rows: [
        ["S", "38", "15", "32"],
        ["M", "39", "15.5", "32"],
        ["L", "40", "16", "33"],
        ["XL", "42", "16.5", "33"],
        ["XXL", "44", "17", "34"],
        ["3XL", "46", "17.5", "34"],
      ],
    },
  },

  // ── Allen Solly ───────────────────────────────────────────
  allen_solly: {
    tshirt: {
      title: "Allen Solly T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "34", "26", "15.5"],
        ["S", "36", "27", "16"],
        ["M", "39", "28", "17"],
        ["L", "41", "29", "17.5"],
        ["XL", "43", "30", "18"],
        ["XXL", "45", "31", "19"],
        ["3XL", "47", "32", "19.5"],
      ],
    },
    formal_shirt: {
      title: "Allen Solly Formal Shirt",
      headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)"],
      rows: [
        ["S", "38", "15", "32"],
        ["M", "39", "15.5", "32.5"],
        ["L", "40", "16", "33"],
        ["XL", "42", "16.5", "33.5"],
        ["XXL", "44", "17", "34"],
        ["3XL", "46", "17.5", "34.5"],
      ],
    },
    blazer: {
      title: "Allen Solly Blazer Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)"],
      rows: [
        ["36", "36", "30", "16.5"],
        ["38", "38", "32", "17"],
        ["40", "40", "34", "17.5"],
        ["42", "42", "36", "18"],
        ["44", "44", "38", "18.5"],
        ["46", "46", "40", "19"],
        ["48", "48", "42", "19.5"],
      ],
    },
  },

  // ── Van Heusen ────────────────────────────────────────────
  van_heusen: {
    formal_shirt: {
      title: "Van Heusen Formal Shirt",
      headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)"],
      rows: [
        ["S", "38", "15", "32"],
        ["M", "39", "15.5", "32.5"],
        ["L", "40", "16", "33"],
        ["XL", "42", "16.5", "33"],
        ["XXL", "44", "17", "34"],
        ["3XL", "46", "17.5", "34"],
      ],
    },
    blazer: {
      title: "Van Heusen Blazer Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)"],
      rows: [
        ["36", "36", "30", "27"],
        ["38", "38", "32", "28"],
        ["40", "40", "34", "29"],
        ["42", "42", "36", "30"],
        ["44", "44", "38", "31"],
        ["46", "46", "40", "32"],
        ["48", "48", "42", "33"],
      ],
    },
  },

  // ── Peter England ─────────────────────────────────────────
  peter_england: {
    formal_shirt: {
      title: "Peter England Formal Shirt",
      headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)"],
      rows: [
        ["S", "37.5", "15", "32"],
        ["M", "39", "15.5", "32.5"],
        ["L", "40", "15.75", "33"],
        ["XL", "42", "16.5", "33.5"],
        ["XXL", "43.5", "17", "34"],
        ["3XL", "46", "45.5", "17.5", "34.5"],
      ],
    },
    tshirt: {
      title: "Peter England T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["S", "36", "27", "16"],
        ["M", "38", "28", "17"],
        ["L", "40", "29", "17.5"],
        ["XL", "42", "30", "18"],
        ["XXL", "44", "31", "18.5"],
      ],
    },
  },

  // ── Louis Philippe ────────────────────────────────────────
  louis_philippe: {
    formal_shirt: {
      title: "Louis Philippe Formal Shirt",
      headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)"],
      rows: [
        ["S", "38", "15", "32.5"],
        ["M", "39", "15.5", "33"],
        ["L", "40", "16", "33"],
        ["XL", "42", "16.5", "33.5"],
        ["XXL", "44", "17", "34"],
        ["3XL", "46", "17.5", "34.5"],
      ],
    },
    blazer: {
      title: "Louis Philippe Blazer Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)"],
      rows: [
        ["38", "38", "32", "17"],
        ["40", "40", "34", "17.5"],
        ["42", "42", "36", "18"],
        ["44", "44", "38", "18.5"],
        ["46", "46", "40", "19"],
      ],
    },
  },

  // ── Tommy Hilfiger ────────────────────────────────────────
  tommy: {
    tshirt: {
      title: "Tommy Hilfiger T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)"],
      rows: [
        ["XS", "34", "28", "26"],
        ["S", "36", "30", "27"],
        ["M", "38–40", "32–34", "28"],
        ["L", "42", "36", "29"],
        ["XL", "44", "38", "30"],
        ["XXL", "46", "40", "31"],
        ["3XL", "48", "42", "32"],
      ],
    },
    formal_shirt: {
      title: "Tommy Hilfiger Formal Shirt",
      headers: ["Size", "Chest (in)", "Neck (in)", "Sleeve (in)"],
      rows: [
        ["S", "38", "15", "32"],
        ["M", "39", "15.5", "32.5"],
        ["L", "40", "16", "33"],
        ["XL", "42", "16.5", "33.5"],
        ["XXL", "44", "17", "34"],
        ["3XL", "46", "17.5", "34.5"],
      ],
    },
  },

  // ── Calvin Klein ──────────────────────────────────────────
  calvin_klein: {
    tshirt: {
      title: "Calvin Klein T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)"],
      rows: [
        ["XS", "34", "28", "27"],
        ["S", "36", "30", "28"],
        ["M", "38–40", "32–34", "29"],
        ["L", "42", "36", "30"],
        ["XL", "44", "38", "31"],
        ["XXL", "46", "40", "32"],
        ["3XL", "48", "42", "33"],
      ],
    },
    pant: {
      title: "Calvin Klein Trouser Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "34", "30"],
        ["30", "30", "36", "31"],
        ["32", "32", "38", "32"],
        ["34", "34", "40", "32"],
        ["36", "36", "42", "32"],
        ["38", "38", "44", "32"],
        ["40", "40", "46", "32"],
      ],
    },
  },

  // ── Uniqlo ────────────────────────────────────────────────
  uniqlo: {
    tshirt: {
      title: "Uniqlo T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "33–35", "25.5", "16"],
        ["S", "35–37", "26.5", "16.5"],
        ["M", "37–39", "27.5", "17"],
        ["L", "39–42", "28", "17.5"],
        ["XL", "42–45", "28.5", "18"],
        ["XXL", "45–48", "29", "18.5"],
        ["3XL", "48–51", "29.5", "19"],
      ],
    },
  },

  // ── Jack & Jones ──────────────────────────────────────────
  jack_jones: {
    tshirt: {
      title: "Jack & Jones T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "34", "26", "16"],
        ["S", "36", "27", "16.5"],
        ["M", "38", "28", "17"],
        ["L", "40", "29", "17.5"],
        ["XL", "42", "30", "18"],
        ["XXL", "44", "31", "18.5"],
        ["3XL", "46", "32", "19"],
      ],
    },
    pant: {
      title: "Jack & Jones Jeans Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "34", "30"],
        ["30", "30", "36", "31"],
        ["32", "32", "38", "32"],
        ["34", "34", "40", "32"],
        ["36", "36", "42", "32"],
        ["38", "38", "44", "32"],
        ["40", "40", "46", "32"],
      ],
    },
  },

  // ── Wrangler ──────────────────────────────────────────────
  wrangler: {
    pant: {
      title: "Wrangler Jeans Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "34", "30"],
        ["30", "30", "36", "31"],
        ["32", "32", "38", "32"],
        ["34", "34", "40", "32"],
        ["36", "36", "42", "32"],
        ["38", "38", "44", "32"],
        ["40", "40", "46", "32"],
      ],
    },
    tshirt: {
      title: "Wrangler T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["S", "36", "27", "16.5"],
        ["M", "38", "28", "17"],
        ["L", "40", "29", "17.5"],
        ["XL", "42", "30", "18"],
        ["XXL", "44", "31", "18.5"],
      ],
    },
  },

  // ── Lee ───────────────────────────────────────────────────
  lee: {
    pant: {
      title: "Lee Jeans Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "34", "30"],
        ["30", "30", "36", "31"],
        ["32", "32", "38", "32"],
        ["34", "34", "40", "32"],
        ["36", "36", "42", "32"],
        ["38", "38", "44", "32"],
        ["40", "40", "46", "32"],
      ],
    },
  },

  // ── Spykar ────────────────────────────────────────────────
  spykar: {
    pant: {
      title: "Spykar Jeans Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "33", "30"],
        ["30", "30", "35", "31"],
        ["32", "32", "37", "32"],
        ["34", "34", "39", "32"],
        ["36", "36", "41", "32"],
        ["38", "38", "43", "32"],
        ["40", "40", "45", "32"],
      ],
    },
  },

  // ── Mufti ─────────────────────────────────────────────────
  mufti: {
    tshirt: {
      title: "Mufti T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["S", "36", "26.5", "16"],
        ["M", "38", "27.5", "17"],
        ["L", "40", "28.5", "17.5"],
        ["XL", "42", "29.5", "18"],
        ["XXL", "44", "30.5", "18.5"],
      ],
    },
    pant: {
      title: "Mufti Trouser Sizing",
      headers: ["Waist", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        ["28", "28", "34", "30"],
        ["30", "30", "36", "31"],
        ["32", "32", "38", "32"],
        ["34", "34", "40", "32"],
        ["36", "36", "42", "32"],
        ["38", "38", "44", "32"],
      ],
    },
  },

  // ── Roadster ──────────────────────────────────────────────
  roadster: {
    tshirt: {
      title: "Roadster T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "34", "25.5", "15.5"],
        ["S", "36", "26.5", "16"],
        ["M", "38", "27.5", "17"],
        ["L", "40", "28.5", "17.5"],
        ["XL", "42", "29.5", "18"],
        ["XXL", "44", "30.5", "18.5"],
        ["3XL", "46", "31.5", "19"],
      ],
    },
  },

  // ── Highlander ────────────────────────────────────────────
  highlander: {
    tshirt: {
      title: "Highlander T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["S", "36", "26", "16"],
        ["M", "38", "27", "17"],
        ["L", "40", "28", "17.5"],
        ["XL", "42", "29", "18"],
        ["XXL", "44", "30", "18.5"],
        ["3XL", "46", "31", "19"],
      ],
    },
  },

  // ── Snitch ────────────────────────────────────────────────
  snitch: {
    tshirt: {
      title: "Snitch T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["S", "36", "26.5", "16.5"],
        ["M", "38", "27.5", "17"],
        ["L", "40", "28.5", "17.5"],
        ["XL", "42", "29.5", "18"],
        ["XXL", "44", "30.5", "18.5"],
      ],
    },
  },

  // ── Rare Rabbit ───────────────────────────────────────────
  rare_rabbit: {
    tshirt: {
      title: "Rare Rabbit T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "34", "26", "16"],
        ["S", "36", "27", "16.5"],
        ["M", "39", "28", "17"],
        ["L", "41", "29", "17.5"],
        ["XL", "43", "30", "18"],
        ["XXL", "45", "31", "18.5"],
      ],
    },
  },

  // ── Bewakoof ──────────────────────────────────────────────
  bewakoof: {
    tshirt: {
      title: "Bewakoof T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "34", "25", "15.5"],
        ["S", "36", "26", "16"],
        ["M", "38", "27", "17"],
        ["L", "40", "28", "17.5"],
        ["XL", "42", "29", "18"],
        ["XXL", "44", "30", "18.5"],
        ["3XL", "46", "31", "19"],
      ],
    },
  },

  // ── The Souled Store ──────────────────────────────────────
  souled_store: {
    tshirt: {
      title: "The Souled Store T-Shirt Sizing",
      headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["XS", "34", "25.5", "16"],
        ["S", "36", "26.5", "16.5"],
        ["M", "38", "27.5", "17"],
        ["L", "40", "28.5", "17.5"],
        ["XL", "42", "29.5", "18"],
        ["XXL", "44", "30.5", "18.5"],
        ["3XL", "46", "31.5", "19"],
      ],
    },
  },
};

// ─── Custom measurement fields per clothing type ───────────────
// Each entry: { key, label, placeholder, unit }
export const CUSTOM_MEASUREMENT_FIELDS = {
  tshirt: [
    { key: "chest", label: "Chest", placeholder: "e.g. 40", unit: "inch" },
    { key: "shoulder", label: "Shoulder", placeholder: "e.g. 17", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 28", unit: "inch" },
    { key: "sleeve", label: "Sleeve", placeholder: "e.g. 25", unit: "inch" },
  ],
  formal_shirt: [
    { key: "chest", label: "Chest", placeholder: "e.g. 40", unit: "inch" },
    { key: "neck", label: "Neck", placeholder: "e.g. 16", unit: "inch" },
    { key: "sleeve", label: "Sleeve", placeholder: "e.g. 33", unit: "inch" },
    { key: "shoulder", label: "Shoulder", placeholder: "e.g. 17", unit: "inch" },
  ],
  pant: [
    { key: "waist", label: "Waist", placeholder: "e.g. 32", unit: "inch" },
    { key: "hip", label: "Hip", placeholder: "e.g. 38", unit: "inch" },
    { key: "inseam", label: "Inseam", placeholder: "e.g. 32", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 42", unit: "inch" },
  ],
  kurta: [
    { key: "chest", label: "Chest", placeholder: "e.g. 40", unit: "inch" },
    { key: "waist", label: "Waist", placeholder: "e.g. 34", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 30", unit: "inch" },
    { key: "sleeve", label: "Sleeve", placeholder: "e.g. 24", unit: "inch" },
  ],
  choli: [
    { key: "bust", label: "Bust", placeholder: "e.g. 34", unit: "inch" },
    { key: "waist", label: "Waist", placeholder: "e.g. 28", unit: "inch" },
    { key: "backLength", label: "Back Length", placeholder: "e.g. 15", unit: "inch" },
    { key: "shoulder", label: "Shoulder", placeholder: "e.g. 13", unit: "inch" },
  ],
  blazer: [
    { key: "chest", label: "Chest", placeholder: "e.g. 40", unit: "inch" },
    { key: "waist", label: "Waist", placeholder: "e.g. 34", unit: "inch" },
    { key: "shoulder", label: "Shoulder", placeholder: "e.g. 18", unit: "inch" },
    { key: "sleeve", label: "Sleeve", placeholder: "e.g. 25", unit: "inch" },
  ],
  coat: [
    { key: "chest", label: "Chest", placeholder: "e.g. 42", unit: "inch" },
    { key: "waist", label: "Waist", placeholder: "e.g. 36", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 33", unit: "inch" },
    { key: "sleeve", label: "Sleeve", placeholder: "e.g. 26", unit: "inch" },
  ],
  sherwani: [
    { key: "chest", label: "Chest", placeholder: "e.g. 40", unit: "inch" },
    { key: "waist", label: "Waist", placeholder: "e.g. 34", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 40", unit: "inch" },
    { key: "shoulder", label: "Shoulder", placeholder: "e.g. 18", unit: "inch" },
  ],
  jacket: [
    { key: "chest", label: "Chest", placeholder: "e.g. 40", unit: "inch" },
    { key: "shoulder", label: "Shoulder", placeholder: "e.g. 18", unit: "inch" },
    { key: "sleeve", label: "Sleeve", placeholder: "e.g. 25", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 26", unit: "inch" },
  ],
  shorts: [
    { key: "waist", label: "Waist", placeholder: "e.g. 32", unit: "inch" },
    { key: "hip", label: "Hip", placeholder: "e.g. 38", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 18", unit: "inch" },
  ],
  lehenga: [
    { key: "waist", label: "Waist", placeholder: "e.g. 28", unit: "inch" },
    { key: "hip", label: "Hip", placeholder: "e.g. 38", unit: "inch" },
    { key: "length", label: "Length", placeholder: "e.g. 40", unit: "inch" },
  ],
};

/**
 * Helper: get the size chart for a brand + clothing type combo.
 * Falls back to the standard chart if the brand doesn't have one.
 */
export const getSizeChart = (brandId, clothingType) => {
  if (brandId && brandId !== "standard" && BRAND_SIZE_CHARTS[brandId]?.[clothingType]) {
    return BRAND_SIZE_CHARTS[brandId][clothingType];
  }
  return STANDARD_SIZE_CHARTS[clothingType] || STANDARD_SIZE_CHARTS.tshirt;
};
