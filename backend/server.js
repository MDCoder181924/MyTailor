import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import app from "./src/app.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});