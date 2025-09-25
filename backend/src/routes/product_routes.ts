import { Router } from "express";
import { ProductController } from "../controllers/product_controller";
import { ProductService } from "../services/product_service";
import { upload } from "../middlewares/upload";

const router = Router();
const productService = ProductService();
const productController = ProductController(productService);

router.post("/register", upload.single("image"), productController.registerProduct);
router.get("/:id", productController.getProduct);
router.get("/", productController.getAllProducts);

export default router;
