import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin";
import {
  ProductController,
  ProductDataBody,
} from "../controllers/product_controller";
import { ProductService } from "../services/product_service";
import { Product } from "../models/product";

const router = Router();

const productService = ProductService();
const productController = ProductController(productService);

router.post("/admin/product", isAdmin, productController.registerProduct);

router.put("/admin/product/:id", isAdmin, async (req, res) => {
  try {
    const { name, description, price, stock } = req.body as ProductDataBody;
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Produto não encontrado" });
    await product.update({ name, description, price, stock });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao editar produto", log: error });
  }
});

router.delete("/admin/product/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Produto não encontrado" });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir produto", log: error });
  }
});

export default router;
