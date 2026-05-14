import express from "express";
import csrf from "csurf";
import userRoutes from "./routes/Auth/userRoutes.js";
import tailorRoutes from "./routes/Auth/tailorRoutes.js";
import authRoutes from "./routes/Auth/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
// app.use(csrf({ cookie: true }));

const envOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  ...envOrigins,
  // Deployed frontend origins (add any other deployed domains here)
  "https://my-tailor-nine.vercel.app",
  "https://my-tailor-backend.vercel.app",
  "https://my-tailor.vercel.app",
]);

const isAllowedDevOrigin = (origin) => {
  if (!origin) {
    return false;
  }

  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && (allowedOrigins.has(origin) || isAllowedDevOrigin(origin))) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/user", userRoutes);
app.use("/api/tailor", tailorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, _req, res, next) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Uploaded image is too large" });
  }

  if (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }

  next();
});

export default app;
