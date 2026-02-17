import express from 'express';
import { processDemoPayment, createOrderAfterPayment } from '../controller/paymentController.js';
import { verifyUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

// Process demo payment (simulate gateway)
router.route("/payment/process")
    .post(verifyUserAuth, processDemoPayment);

// Create order after successful payment
router.route("/payment/order/new")
    .post(verifyUserAuth, createOrderAfterPayment);

export default router;