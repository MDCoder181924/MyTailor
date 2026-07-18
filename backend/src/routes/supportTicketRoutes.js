import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import isUser from "../middleware/isUser.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  createTicket,
  getUserTickets,
  adminGetAllTickets,
  adminReplyTicket,
} from "../controllers/supportTicketController.js";

const router = express.Router();

// Optional authentication middleware for ticket creation (supports guests)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Ignore invalid token and treat as guest
    }
  }
  next();
};

// Create ticket (Guest or Logged-in User)
router.post("/", optionalAuth, createTicket);

// User: Get own tickets
router.get("/mine", authMiddleware, isUser, getUserTickets);

// Admin: Get all tickets
router.get("/admin", authMiddleware, isAdmin, adminGetAllTickets);

// Admin: Reply to ticket
router.patch("/admin/:id/reply", authMiddleware, isAdmin, adminReplyTicket);

export default router;
