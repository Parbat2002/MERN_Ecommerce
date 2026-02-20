MERN_Ecommerce
MERN_Ecommerce/
    ├── backend/
    │   ├── config/
    │   │   ├── config.env
    │   │   └── db.js
    │   ├── controller/
    │   │   ├── orderController.js
    │   │   ├── paymentController.js
    │   │   ├── productController.js
    │   │   └── userController.js
    │   ├── middleware/
    │   │   ├── error.js
    │   │   ├── handleAsyncError.js
    │   │   └── userAuth.js
    │   ├── models/
    │   │   ├── orderModel.js
    │   │   ├── productModel.js
    │   │   └── userModel.js
    │   ├── routes/
    │   │   ├── orderRoutes.js
    │   │   ├── paymentRoutes.js
    │   │   ├── productRoutes.js
    │   │   └── userRoutes.js
    │   ├── utils/
    │   │   ├── apiFunctionality.js
    │   │   ├── handleError.js
    │   │   ├── jwtToken.js
    │   │   └── sendEmail.js
    │   ├── app.js
    │   └── server.js
    └── frontend /
        ├── public/
        │   └── images
        └── src /
            ├── Admin/
            │   ├── AdminDashboard.jsx
            │   ├── AdminLayout.jsx
            │   ├── AdminOrders.jsx
            │   ├── AdminProducts.jsx
            │   ├── AdminReviews.jsx
            │   └── AdminUsers.jsx
            ├── adminStyles/
            │   └── AdminStyles.css
            ├── app/
            │   └── store.js
            ├── Cart/
            │   ├── Cart.jsx
            │   ├── CartItem.jsx
            │   ├── CheckoutPath.jsx
            │   ├── OrderConfirm.jsx
            │   ├── Payment.jsx
            │   └── Shipping.jsx
            ├── cartStyles/
            │   └── CartStyles.css
            ├── components/
            │   ├── Footer.jsx
            │   ├── ImageSlider.jsx
            │   ├── Loader.jsx
            │   ├── Navbar.jsx
            │   ├── NoProducts.jsx
            │   ├── PageTitle.jsx
            │   ├── Pagination.jsx
            │   ├── Product.jsx
            │   ├── ProtectedRoute.jsx
            │   ├── Rating.jsx
            │   └── ReviewSection.jsx
            ├── componentStyles/
            │   └── ComponentStyles.css
            ├── features/
            │   ├── admin/
            │   │   └── adminSlice.js
            │   ├── cart/
            │   │   └── cartSlice.js
            │   ├── order/
            │   │   └── orderSlice.js
            │   ├── products/
            │   │   └── productSlice.js
            │   ├── review/
            │   │   └── reviewSlice.js
            │   └── user/
            │       └── userSlice.js
            ├── Orders/
            │   ├── MyOrders.jsx
            │   └── OrderDetail.jsx
            ├── orderStyles/
            │   └── OrderStyles.css
            ├── pages/
            │   ├── Home.jsx
            │   ├── ProductDetails.jsx
            │   └── Products.jsx
            ├── pageStyles/
            │   └── PageStyles.css
            ├── User/
            │   ├── ForgotPassword.jsx
            │   ├── Login.jsx
            │   ├── Profile.jsx
            │   ├── Register.jsx
            │   ├── ResetPassword.jsx
            │   ├── UpdatePassword.jsx
            │   ├── UpdateProfile.jsx
            │   └── UserDashboard.jsx
            ├── userStyles/
            │   └── UserStyles.css
            ├── App.jsx
            └── main.jsx