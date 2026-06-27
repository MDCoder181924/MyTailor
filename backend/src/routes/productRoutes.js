import express from "express";
import { 
  createProduct, 
  getProducts, 
  getProductsByTailorId, 
  getTailorProducts, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isTailor from "../middleware/isTailor.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/mine", authMiddleware, isTailor, getTailorProducts);
router.get("/tailor/:tailorId", getProductsByTailorId);
router.post("/", authMiddleware, isTailor, createProduct);
router.put("/:id", authMiddleware, isTailor, updateProduct);
router.delete("/:id", authMiddleware, isTailor, deleteProduct);

export default router;
