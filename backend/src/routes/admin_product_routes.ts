import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin";
import {
  ProductController,
} from "../controllers/product_controller";
import { getDashboardStats } from "../controllers/dashboard_controller";
import { ProductService } from "../services/product_service";

const router = Router();

const productService = ProductService();
const productController = ProductController(productService);

router.post("/admin/product", isAdmin, productController.registerProduct);

router.put("/admin/product/:id", isAdmin,productController.updateProduct);

router.delete("/admin/product/:id", isAdmin, productController.deleteProduct);

router.get("/admin/dashboard", isAdmin, getDashboardStats )

export default router;
