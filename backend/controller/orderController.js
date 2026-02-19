import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';

// Create New Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

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

    res.status(201).json({ success: true, order });
});

// Get Single Order (Admin)
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new HandleError('Order not found', 404));
    res.status(200).json({ success: true, order });
});

// Get Single Order (User — own orders only)
export const getUserSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new HandleError('Order not found', 404));
    // Ensure the order belongs to the requesting user
    if (order.user._id.toString() !== req.user._id.toString()) {
        return next(new HandleError('Not authorized to view this order', 403));
    }
    res.status(200).json({ success: true, order });
});

// All My Orders
export const allMyOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, orders });
});

// Getting All Orders (Admin)
export const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find().populate('user', 'name email');
    let totalAmount = 0;
    orders.forEach((order) => { totalAmount += order.totalPrice; });
    res.status(200).json({ success: true, orders, totalAmount });
});

// Update Order Status (Admin)
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new HandleError('Order not found', 404));

    if (order.orderStatus === 'Delivered') {
        return next(new HandleError('This order has already been delivered', 400));
    }

    // Reduce product stock when marking as Delivered
    if (req.body.status === 'Delivered') {
        await Promise.all(
            order.orderItems.map((item) => updateQuantity(item.product, item.quantity, next))
        );
        order.deliveredAt = Date.now();
    }

    order.orderStatus = req.body.status;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, order });
});

async function updateQuantity(id, quantity, next) {
    const product = await Product.findById(id);
    if (!product) return; // silently skip if product was deleted
    product.stock = Math.max(0, product.stock - quantity);
    await product.save({ validateBeforeSave: false });
}

// Delete Order (Admin) — only delivered orders can be deleted
export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new HandleError('Order not found', 404));

    if (order.orderStatus !== 'Delivered') {
        return next(new HandleError('Only delivered orders can be deleted', 400));
    }

    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
});
