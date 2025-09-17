import { Router } from "express";
import { ProductController } from "../controllers/product_controller";
import { ProductService } from "../services/product_service";

const router = Router();
const productService = ProductService();
const productController = ProductController(productService);

router.post("/register", productController.registerProduct);
router.get("/:id", productController.getProduct);
router.get("/", productController.getAllProducts);

export default router;
