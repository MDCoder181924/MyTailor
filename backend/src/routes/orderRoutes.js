import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import isUser from "../middleware/isUser.js";
import isTailor from "../middleware/isTailor.js";
import {
  completeOrder,
  createOrder,
  getTailorNotifications,
  getTailorOrders,
  getUserOrders,
  markTailorNotificationsRead,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authMiddleware, isUser, createOrder);
router.get("/mine", authMiddleware, isUser, getUserOrders);
router.get("/tailor", authMiddleware, isTailor, getTailorOrders);
router.get("/tailor/notifications", authMiddleware, isTailor, getTailorNotifications);
router.patch("/tailor/notifications/read", authMiddleware, isTailor, markTailorNotificationsRead);
router.patch("/:id/status", authMiddleware, isTailor, completeOrder);

export default router;
