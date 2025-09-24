import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout_controller';
import { CheckoutService } from '../services/checkout_service';

const router = Router();
const checkoutService = CheckoutService();
const checkoutController = CheckoutController(checkoutService);

router.post('/checkout', (req, res) => checkoutController.processCheckout(req, res));
router.get('/cart/:userId', (req, res) => checkoutController.getCartItems(req, res));
router.delete('/cart/:userId', (req, res) => checkoutController.clearCart(req, res));
router.post('/order-item', (req, res) => checkoutController.createOrderItem(req, res));

export default router;
