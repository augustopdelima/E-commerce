import { Router } from "express";
import { ProductController } from "../controllers/product_controller";
import { ProductService } from "../services/product_service";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";
const router = Router();
const productService = ProductService();
const productController = ProductController(productService);

router.post("/register", authMiddleware,isAdmin,upload.single("image"), productController.registerProduct);
router.get("/:id", productController.getProduct);
router.get("/", productController.getAllProducts);
router.put("/:id", authMiddleware, isAdmin,  upload.single("image"), productController.updateProduct);
router.put("/delete/:id", authMiddleware, isAdmin, productController.deleteProduct);
export default router;
