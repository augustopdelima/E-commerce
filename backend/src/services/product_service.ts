import { Product, Supplier } from "../models";

export interface ProductServiceInterface {
  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    supplierId?: number | null;
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
    supplierId?: number | null;
  }) {
    return await Product.create(data);
  }

  async function getProductById(id: number) {
    return await Product.findByPk(id, {
      include: [{ model: Supplier, as: "supplier" }],
    });
  }

  async function listProducts() {
    return await Product.findAll({
      where: { active: true },
      include: [{ model: Supplier, as: "supplier" }],
    });
  }

  return {
    createProduct,
    getProductById,
    listProducts,
  };
}
