import authMiddleware from "../../middleware/authMiddleware.js";
import express from "express";
import isUser from "../../middleware/isUser.js";
import { refreshToken } from "../../controllers/Auth/authController.js";
import { signupUser, loginUser, logoutUser, updateUserProfile } from "../../controllers/Auth/userController.js";
import User from "../../models/Auth/User.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, isUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-userPassword -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile fetched",
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/profile", authMiddleware, isUser, updateUserProfile);
router.post("/logout", authMiddleware, isUser, logoutUser);
router.post("/refresh", refreshToken);

export default router;
