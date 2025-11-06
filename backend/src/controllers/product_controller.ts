import { Request, Response } from "express";
import { ProductServiceInterface } from "../services/product_service";

export interface ProductDataBody {
  name: string;
  description: string;
  price: number;
  stock: number;
  supplierId?: number;
}

export function ProductController(productService: ProductServiceInterface) {
  async function registerProduct(req: Request, res: Response) {
    try {
      const { name, description, price, stock, supplierId } = req.body as ProductDataBody;
      const file = req.file;

      const imageUrl = file
        ? `${req.protocol}://${req.get("host")?.toString() ?? "localhost:3000"}/uploads/${file.filename}`
        : "http://localhost:3000/uploads/placeholder.png";

      const product = await productService.createProduct({
        name,
        description,
        price,
        stock,
        imageUrl,
        supplierId,
      });

      res.status(201).json(product);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao cadastrar produto" });
    }
  }

  async function getProduct(req: Request, res: Response) {
    try {
      const product = await productService.getProductById(Number(req.params.id));
      if (!product)
        return res.status(404).json({ error: "Produto não encontrado" });
      res.json(product);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao buscar produto" });
    }
  }

  async function getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.listProducts();
      res.json(products);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao listar produtos" });
    }
  }

  async function updateProduct(req: Request, res: Response) {
    try {
      const file = req.file;
      const { name, description, price, stock, supplierId } = req.body as ProductDataBody;

      const product = await productService.getProductById(Number(req.params.id));
      if (!product)
        return res.status(404).json({ error: "Produto não encontrado" });

      const imageUrl = file
        ? `${req.protocol}://${req.get("host")?.toString() ?? "localhost:3000"}/uploads/${file.filename}`
        : product.imageUrl;

      await product.update({ name, description, price, stock, imageUrl, supplierId });
      res.json(product);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao editar produto" });
    }
  }

  async function deleteProduct(req: Request, res: Response) {
    try {
      const product = await productService.getProductById(Number(req.params.id));
      if (!product)
        return res.status(404).json({ error: "Produto não encontrado" });

      
      await product.update({ active: false });

      res.status(200).json({ message: "Produto inativado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao inativar produto" });
    }
  }

  return {
    registerProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
  };
}
