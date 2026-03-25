import authMiddleware from "../../middleware/authMiddleware.js";
import express from "express";
import isUser from "../../middleware/isUser.js";
import { signupUser, loginUser } from "../../controllers/Auth/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, isUser, (req, res) => {
  res.json({
    message: "User profile fetched",
    user: req.user
  });
});

export default router;