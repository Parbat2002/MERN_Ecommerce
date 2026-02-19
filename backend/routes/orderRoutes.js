import express from 'express';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
import {
    allMyOrders,
    createNewOrder,
    deleteOrder,
    getAllOrders,
    getSingleOrder,
    getUserSingleOrder,
    updateOrderStatus,
} from '../controller/orderController.js';

const router = express.Router();

// User routes
router.route('/new/order').post(verifyUserAuth, createNewOrder);
router.route('/orders/user').get(verifyUserAuth, allMyOrders);
// User can view their own single order
router.route('/order/:id').get(verifyUserAuth, getUserSingleOrder);

// Admin routes
router.route('/admin/orders').get(verifyUserAuth, roleBasedAccess('admin'), getAllOrders);
router
    .route('/admin/order/:id')
    .get(verifyUserAuth, roleBasedAccess('admin'), getSingleOrder)
    .put(verifyUserAuth, roleBasedAccess('admin'), updateOrderStatus)
    .delete(verifyUserAuth, roleBasedAccess('admin'), deleteOrder);

export default router;
