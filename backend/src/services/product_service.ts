import { Product } from "../models/product";

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
}) {
  return await Product.create(data);
}

export async function getProductById(id: number) {
  return await Product.findByPk(id);
}

export async function listProducts() {
  return await Product.findAll();
}
