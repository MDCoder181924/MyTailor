import { tailorSignup, tailorLogin } from "../../controllers/Auth/tailorController.js";
import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import isTailor from "../../middleware/isTailor.js";

const router = express.Router();

router.post("/login", tailorLogin);
router.post("/signup", tailorSignup);

// 🔥 Protected route
router.get("/profile", authMiddleware, isTailor, (req, res) => {
  res.json({
    message: "Tailor profile",
    user: req.user
  });
});

export default router;