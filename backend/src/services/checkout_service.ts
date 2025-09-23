import { Order } from '../models/order';
import { CartItem } from '../models/cart_item';
import { OrderItem } from '../models/order_item';
import { Product } from '../models/product';
import { User } from '../models/user';

export interface CheckoutServiceInterface {
    processCheckout: (userId: number) => Promise<Order>;
    getCartItems: (userId: number) => Promise<CartItem[]>;
    clearCart: (userId: number) => Promise<void>;
    createOrderItem: (orderId: number, 
        productId: number, 
        quantity: number, 
        price: number
    ) => Promise<OrderItem>;
}

export function CheckoutService(): CheckoutServiceInterface {
    async function processCheckout(userId: number): Promise<Order> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const cartItems = await CartItem.findAll({ where: { userId } });
        if (cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        let totalAmount = 0;
        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }
            totalAmount += product.price * item.quantity;
        }
        const order = await Order.create({ userId, totalAmount, status: 'Pending' });

        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                await createOrderItem(order.id, item.productId, item.quantity, product.price);
                product.stock -= item.quantity;
                await product.save();
            }
        }
        await clearCart(userId);
        return order;
    }

    async function getCartItems(userId: number): Promise<CartItem[]> {
        const cartItems = await CartItem.findAll({ where: { userId } });
        return cartItems;
    }

    async function clearCart(userId: number): Promise<void> {
        await CartItem.destroy({ where: { userId } });
    }

    async function createOrderItem(orderId: number, productId: number, quantity: number, price: number): Promise<OrderItem> {
        const orderItem = await OrderItem.create({ orderId, productId, quantity, price });
        return orderItem;
    }

    return {
        processCheckout,
        getCartItems,
        clearCart,
        createOrderItem
    };
}