import { Router } from "express";
import { CartController } from "../controllers/cart_controller";
import { CartService } from "../services/cart_service";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const cartService = CartService();
const cartController = CartController(cartService);

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Obter itens do carrinho do usuário logado
router.get("/", (req, res) => cartController.getCart(req, res));

// Adicionar item ao carrinho
router.post("/", (req, res) => cartController.addToCart(req, res));

// Atualizar quantidade de um item
router.put("/:productId", (req, res) => cartController.updateCartItem(req, res));

// Remover item do carrinho
router.delete("/:productId", (req, res) => cartController.removeFromCart(req, res));

// Limpar carrinho
router.delete("/", (req, res) => cartController.clearCart(req, res));

export default router;
