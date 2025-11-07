import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin";
import {
  ProductController,
} from "../controllers/product_controller";
import { getDashboardStats } from "../controllers/dashboard_controller";
import { ProductService } from "../services/product_service";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

const productService = ProductService();
const productController = ProductController(productService);

router.post("/admin/product", authMiddleware,isAdmin, productController.registerProduct);

router.put("/admin/product/:id", authMiddleware,isAdmin,productController.updateProduct);

router.delete("/admin/product/:id", authMiddleware,isAdmin, productController.deleteProduct);

router.get("/admin/dashboard", authMiddleware,isAdmin, getDashboardStats )

export default router;
