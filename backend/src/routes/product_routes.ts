import { Router } from "express";
import { registerProduct, getProduct, getAllProducts } from "../controllers/product.controller";

const router = Router();

router.post("/register", registerProduct);
router.get("/:id", getProduct);
router.get("/", getAllProducts);

export default router;
