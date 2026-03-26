import express from "express";
import csrf from "csurf";
import userRoutes from "./routes/Auth/userRoutes.js";
import tailorRoutes from "./routes/Auth/tailorRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
// app.use(csrf({ cookie: true }));

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);


app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.has(origin)) {
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


app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/tailor", tailorRoutes);

export default app;
