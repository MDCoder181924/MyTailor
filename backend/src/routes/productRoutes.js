import express from "express";
import { createProduct, getProducts, getProductsByTailorId, getTailorProducts } from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isTailor from "../middleware/isTailor.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/mine", authMiddleware, isTailor, getTailorProducts);
router.get("/tailor/:tailorId", getProductsByTailorId);
router.post("/", authMiddleware, isTailor, createProduct);

export default router;
