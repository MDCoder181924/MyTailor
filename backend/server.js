import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import app from "./src/app.js";

dotenv.config();

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// Connect to DB when the module is initialized. In serverless environments
// (Vercel) we export the Express `app` as the default export so Vercel can
// invoke it as a function. Do NOT call `app.listen()` here.
connectDB();

export default app;