import { Request, Response } from "express";
import { CartServiceInterface } from "../services/cart_service";
import { AuthRequest } from "../middlewares/auth";

export interface AddToCartBody {
  productId: number;
  quantity: number;
}

export interface UpdateCartBody {
  quantity: number;
}

export function CartController(cartService: CartServiceInterface) {
  async function getCart(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const cartItems = await cartService.getCartItems(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao obter carrinho" });
    }
  }

  async function addToCart(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const { productId, quantity } = req.body as AddToCartBody;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      const cartItem = await cartService.addToCart(userId, productId, quantity);
      res.status(201).json(cartItem);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message || "Erro ao adicionar ao carrinho" });
    }
  }

  async function updateCartItem(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const productId = Number(req.params.productId);
      const { quantity } = req.body as UpdateCartBody;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Quantidade inválida" });
      }

      const cartItem = await cartService.updateCartItem(userId, productId, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ error: "Item não encontrado no carrinho" });
      }

      res.status(200).json(cartItem);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message || "Erro ao atualizar item" });
    }
  }

  async function removeFromCart(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const productId = Number(req.params.productId);
      const removed = await cartService.removeFromCart(userId, productId);

      if (!removed) {
        return res.status(404).json({ error: "Item não encontrado no carrinho" });
      }

      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao remover item" });
    }
  }

  async function clearCart(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      await cartService.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Erro ao limpar carrinho" });
    }
  }

  return {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
