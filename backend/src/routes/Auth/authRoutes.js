import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { getCurrentAccount, refreshToken } from "../../controllers/Auth/authController.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentAccount);
router.post("/refresh", refreshToken);

export default router;
