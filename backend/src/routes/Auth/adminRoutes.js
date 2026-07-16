import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import isAdmin from "../../middleware/isAdmin.js";
import {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    getDashboardStats,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllTailorsAdmin,
    updateTailor,
    deleteTailor,
    getAllOrders,
    updateOrder,
    deleteOrder,
    getAllProductsAdmin,
    updateProductAdmin,
    deleteProductAdmin,
    getAllReviews,
    deleteReview,
} from "../../controllers/Auth/adminController.js";

const router = express.Router();

// Auth (create is open for Postman setup)
router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", authMiddleware, isAdmin, logoutAdmin);

// Dashboard
router.get("/dashboard", authMiddleware, isAdmin, getDashboardStats);

// Users
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.patch("/users/:id", authMiddleware, isAdmin, updateUser);
router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);

// Tailors
router.get("/tailors", authMiddleware, isAdmin, getAllTailorsAdmin);
router.patch("/tailors/:id", authMiddleware, isAdmin, updateTailor);
router.delete("/tailors/:id", authMiddleware, isAdmin, deleteTailor);

// Orders
router.get("/orders", authMiddleware, isAdmin, getAllOrders);
router.patch("/orders/:id", authMiddleware, isAdmin, updateOrder);
router.delete("/orders/:id", authMiddleware, isAdmin, deleteOrder);

// Products
router.get("/products", authMiddleware, isAdmin, getAllProductsAdmin);
router.patch("/products/:id", authMiddleware, isAdmin, updateProductAdmin);
router.delete("/products/:id", authMiddleware, isAdmin, deleteProductAdmin);

// Reviews
router.get("/reviews", authMiddleware, isAdmin, getAllReviews);
router.delete("/reviews/:id", authMiddleware, isAdmin, deleteReview);

export default router;
