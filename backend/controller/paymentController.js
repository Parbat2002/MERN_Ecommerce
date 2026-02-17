import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import Order from "../models/orderModel.js";

// ================= DEMO PAYMENT PROCESS =================
// Simulates a payment gateway (no real API keys needed)
// Card ending in 0000 → always fails | any other valid card → succeeds

export const processDemoPayment = handleAsyncError(async (req, res, next) => {
    const { cardNumber, cardHolder, expiryDate, cvv, amount } = req.body;

    // Basic validation
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        return next(new HandleError("Please provide all card details", 400));
    }

    const cleanCard = cardNumber.replace(/\s/g, "");

    if (!/^\d{16}$/.test(cleanCard)) {
        return next(new HandleError("Invalid card number. Must be 16 digits.", 400));
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        return next(new HandleError("Invalid CVV", 400));
    }

    // Simulate payment failure for cards ending in 0000
    if (cleanCard.endsWith("0000")) {
        return res.status(400).json({
            success: false,
            message: "Payment failed. Your card was declined.",
        });
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a fake transaction ID
    const transactionId = "DEMO_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9).toUpperCase();

    res.status(200).json({
        success: true,
        transactionId,
        amount,
        message: "Payment successful!",
    });
});

// ================= CREATE ORDER AFTER PAYMENT =================
export const createOrderAfterPayment = handleAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
        message: "Order placed successfully!",
    });
});
