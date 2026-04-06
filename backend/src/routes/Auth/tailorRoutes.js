import { tailorSignup, tailorLogin, getAllTailors, getTailorById, updateTailorProfile } from "../../controllers/Auth/tailorController.js";
import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import isTailor from "../../middleware/isTailor.js";
import Tailor from "../../models/Auth/Tailor.js";

const router = express.Router();

router.post("/login", tailorLogin);
router.post("/signup", tailorSignup);
router.get("/", getAllTailors);

// const isTailor = (req, res, next) => {
//   if (req.user.role !== "tailor") {
//     return res.status(403).json({ message: "Only tailor allowed" });
//   }
//   next();
// };

router.get("/profile", authMiddleware, isTailor, async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.user.id).select("-tailorPassword -refreshToken");

    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    res.json({
      message: "Tailor profile",
      tailor
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/profile", authMiddleware, isTailor, updateTailorProfile);
router.get("/:id", getTailorById);

export default router;
