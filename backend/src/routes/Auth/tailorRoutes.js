import { tailorSignup, tailorLogin } from "../../controllers/Auth/tailorController.js";
import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import isTailor from "../../middleware/isTailor.js";

const router = express.Router();

router.post("/login", tailorLogin);
router.post("/signup", tailorSignup);

// const isTailor = (req, res, next) => {
//   if (req.user.role !== "tailor") {
//     return res.status(403).json({ message: "Only tailor allowed" });
//   }
//   next();
// };

router.get("/profile", authMiddleware, isTailor, (req, res) => {
  res.json({
    message: "Tailor profile",
    talior: req.user
  });
});

export default router;