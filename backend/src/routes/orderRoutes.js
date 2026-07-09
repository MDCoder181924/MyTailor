import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import isUser from "../middleware/isUser.js";
import isTailor from "../middleware/isTailor.js";
import {
  completeOrder,
  acceptOrder,
  createOrder,
  getTailorNotifications,
  getTailorOrders,
  getUserOrders,
  markTailorNotificationsRead,
  shipOrder,
  markOrderAsPaid,
  collectOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authMiddleware, isUser, createOrder);
router.get("/mine", authMiddleware, isUser, getUserOrders);
router.get("/tailor", authMiddleware, isTailor, getTailorOrders);
router.get("/tailor/notifications", authMiddleware, isTailor, getTailorNotifications);
router.patch("/tailor/notifications/read", authMiddleware, isTailor, markTailorNotificationsRead);
router.patch("/:id/accept", authMiddleware, isTailor, acceptOrder);
router.patch("/:id/status", authMiddleware, isTailor, completeOrder);
router.patch("/:id/ship", authMiddleware, isTailor, shipOrder);
router.patch("/:id/pay", authMiddleware, isTailor, markOrderAsPaid);
router.patch("/:id/collect", authMiddleware, collectOrder);

export default router;
