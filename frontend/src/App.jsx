import React, { useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./User/Register";
import Login from "./User/Login";
import { useDispatch, useSelector } from "react-redux";
import UserDashboard from "./User/UserDashboard";
import Profile from "./User/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfile from "./User/UpdateProfile";
import UpdatePassword from "./User/UpdatePassword";
import ForgotPassword from "./User/ForgotPassword";
import ResetPassword from "./User/ResetPassword";
import Cart from "./Cart/Cart";
import Shipping from "./Cart/Shipping";
import OrderConfirm from "./Cart/OrderConfirm";
import Payment from "./Cart/Payment";
import MyOrders from "./Orders/MyOrders";
import OrderDetail from "./Orders/OrderDetail";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminOrders from "./Admin/AdminOrders";
import AdminUsers from "./Admin/AdminUsers";
import AdminProducts from "./Admin/AdminProducts";
import AdminReviews from "./Admin/AdminReviews";
import { loadUser } from "./features/user/userSlice";

function AdminRoute({ element }) {
    const { isAuthenticated, user } = useSelector(state => state.user);
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (user?.role !== 'admin') return <Navigate to="/" />;
    return element;
}

function App() {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) dispatch(loadUser());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:keyword" element={<Products />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/password/forgot" element={<ForgotPassword />} />
                <Route path="/reset/:token" element={<ResetPassword />} />
                <Route path="/cart" element={<Cart />} />

                {/* Protected — User */}
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
                <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />
                <Route path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
                <Route path="/order/confirm" element={<ProtectedRoute element={<OrderConfirm />} />} />
                <Route path="/process/payment" element={<ProtectedRoute element={<Payment />} />} />

                {/* Orders */}
                <Route path="/orders/user" element={<ProtectedRoute element={<MyOrders />} />} />
                <Route path="/order/:id" element={<ProtectedRoute element={<OrderDetail />} />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
                <Route path="/admin/orders"    element={<AdminRoute element={<AdminOrders />} />} />
                <Route path="/admin/users"     element={<AdminRoute element={<AdminUsers />} />} />
                <Route path="/admin/products"  element={<AdminRoute element={<AdminProducts />} />} />
                <Route path="/admin/reviews"   element={<AdminRoute element={<AdminReviews />} />} />
            </Routes>

            {isAuthenticated && <UserDashboard user={user} />}
        </Router>
    );
}

export default App;
