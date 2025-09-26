import { Product } from "../models";

export interface ProductServiceInterface {
  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  }) => Promise<Product>;
  getProductById: (id: number) => Promise<Product | null>;
  listProducts: () => Promise<Product[]>;
}

export function ProductService(): ProductServiceInterface {
  async function createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  }) {
    return await Product.create(data);
  }

  async function getProductById(id: number) {
    return await Product.findByPk(id);
  }

  async function listProducts() {
    return await Product.findAll();
  }

  return {
    createProduct,
    getProductById,
    listProducts,
  };
}
