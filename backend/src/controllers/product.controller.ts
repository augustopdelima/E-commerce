import { Request, Response } from "express";
import { createProduct, getProductById, listProducts } from "../services/product_service";

export async function registerProduct(req: Request, res: Response) {
  try {
    const { name, description, price, stock } = req.body;
    const product = await createProduct({ name, description, price, stock });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar produto" });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar produto" });
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await listProducts();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: "Erro ao listar produtos" });
  }
}
