import { CartItem } from "../models/cart_item";
import { Product } from "../models/product";

export interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export interface CartServiceInterface {
  getCartItems: (userId: number) => Promise<CartItemWithProduct[]>;
  addToCart: (userId: number, productId: number, quantity: number) => Promise<CartItem>;
  updateCartItem: (userId: number, productId: number, quantity: number) => Promise<CartItem | null>;
  removeFromCart: (userId: number, productId: number) => Promise<boolean>;
  clearCart: (userId: number) => Promise<void>;
}

export function CartService(): CartServiceInterface {
  async function getCartItems(userId: number): Promise<CartItemWithProduct[]> {
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "imageUrl", "stock"],
        },
      ],
    });
    return cartItems as CartItemWithProduct[];
  }

  async function addToCart(
    userId: number,
    productId: number,
    quantity: number = 1
  ): Promise<CartItem> {
    // Verifica se o produto existe e tem estoque
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    if (product.stock < quantity) {
      throw new Error("Estoque insuficiente");
    }

    // Verifica se o item já existe no carrinho
    const existingItem = await CartItem.findOne({
      where: { userId, productId },
    });

    if (existingItem) {
      // Atualiza quantidade
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error("Estoque insuficiente");
      }
      existingItem.quantity = newQuantity;
      await existingItem.save();
      return existingItem;
    } else {
      // Cria novo item
      const cartItem = await CartItem.create({
        userId,
        productId,
        quantity,
      });
      return cartItem;
    }
  }

  async function updateCartItem(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem | null> {
    const cartItem = await CartItem.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      return null;
    }

    // Verifica estoque
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    if (product.stock < quantity) {
      throw new Error("Estoque insuficiente");
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem;
  }

  async function removeFromCart(
    userId: number,
    productId: number
  ): Promise<boolean> {
    const deleted = await CartItem.destroy({
      where: { userId, productId },
    });
    return deleted > 0;
  }

  async function clearCart(userId: number): Promise<void> {
    await CartItem.destroy({ where: { userId } });
  }

  return {
    getCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
