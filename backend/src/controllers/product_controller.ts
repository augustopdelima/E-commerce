import { Request, Response } from "express";
import { ProductServiceInterface } from "../services/product_service";

export interface ProductDataBody {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export function ProductController(productService: ProductServiceInterface) {
  async function registerProduct(req: Request, res: Response) {
    try {
      const { name, description, price, stock } = req.body as ProductDataBody;
      const product = await productService.createProduct({
        name,
        description,
        price,
        stock,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Erro ao cadastrar produto", log: error });
    }
  }

  async function getProduct(req: Request, res: Response) {
    try {
      const product = await productService.getProductById(
        Number(req.params.id)
      );
      if (!product)
        return res.status(404).json({ error: "Produto não encontrado" });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Erro ao buscar produto", log: error });
    }
  }

  async function getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.listProducts();
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: "Erro ao listar produtos", log: error });
    }
  }

  return {
    registerProduct,
    getProduct,
    getAllProducts,
  };
}
