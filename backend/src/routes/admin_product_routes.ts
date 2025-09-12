import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin";
import { registerProduct, getProduct, getAllProducts } from "../controllers/product.controller";
import { Product } from "../models/product";

const router = Router();

router.post("/admin/product", isAdmin, registerProduct);

router.put("/admin/product/:id", isAdmin, async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    await product.update({ name, description, price, stock });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao editar produto" });
  }
});

router.delete("/admin/product/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir produto" });
  }
});

export default router;
