import { Request, Response } from 'express';
import { CheckoutServiceInterface } from '../services/checkout_service';

export interface CheckoutRequestBody {
    userId: number;
}

export function CheckoutController(checkoutService: CheckoutServiceInterface) {
    async function processCheckout(req: Request, res: Response) {
        try {
            const { userId } = req.body as CheckoutRequestBody;
            const order = await checkoutService.processCheckout(userId);
            res.status(201).json(order);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Erro ao processar checkout' });
        }
    }

    async function getCartItems(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);
            const cartItems = await checkoutService.getCartItems(userId);
            res.status(200).json(cartItems);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Erro ao obter itens do carrinho' });
        }
    }

    async function clearCart(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);
            await checkoutService.clearCart(userId);
            res.status(204).send();
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Erro ao limpar carrinho' });
        }
    }

    interface CreateOrderItemRequestBody {
        orderId: number;
        productId: number;
        quantity: number;
        price: number;
    }

    async function createOrderItem(req: Request, res: Response) {
        try {
            const { orderId, productId, quantity, price } = req.body as CreateOrderItemRequestBody;
            const orderItem = await checkoutService.createOrderItem(orderId, productId, quantity, price);
            res.status(201).json(orderItem);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Erro ao criar item do pedido' });
        }
    }

    return {
        processCheckout,
        getCartItems,
        clearCart,
        createOrderItem
    };
}
