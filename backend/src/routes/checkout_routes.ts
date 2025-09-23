import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout_controller';
import { CheckoutService } from '../services/checkout_service';

const router = Router();
const checkoutService = new CheckoutService();
const checkoutController = new CheckoutController(checkoutService);

router.post('/checkout', (req, res) => checkoutController.processCheckout(req, res));

export default router;
