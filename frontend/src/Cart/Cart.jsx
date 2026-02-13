import React from 'react';
import '../CartStyles/Cart.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';

function Cart() {
    const { cartItems } = useSelector(state => state.cart);

    // Dynamic Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const tax = subtotal * 0.13;
    const shipping = cartItems.length > 0 ? 100 : 0;
    const total = subtotal + tax + shipping;

    return (
        <>
            <PageTitle title='Your Cart' />
            <Navbar />
            <div className="cart-page">
                <div className="cart-items">
                    <div className="cart-items-heading">Your Cart ({cartItems.length} items)</div>
                    <div className="cart-table">
                        <div className="cart-table-header">
                            <div className="header-product">Product</div>
                            <div className="header-quantity">Quantity</div>
                            <div className="header-total item-total-heading">Item Total</div>
                            <div className="header-action item-total-heading">Actions</div>
                        </div>
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">Your cart is empty</div>
                        ) : (
                            cartItems.map(item => <CartItem item={item} key={item.product} />)
                        )}
                    </div>
                </div>

                <div className="price-summary">
                    <h3 className="price-summary-heading">Price Summary</h3>
                    <div className="summary-item">
                        <p className="summary-label">Subtotal: </p>
                        <p className="summary-value">{subtotal.toFixed(2)}/-</p>
                    </div>
                    <div className="summary-item">
                        <p className="summary-label">Tax (13%): </p>
                        <p className="summary-value">{tax.toFixed(2)}/-</p>
                    </div>
                    <div className="summary-item">
                        <p className="summary-label">Shipping: </p>
                        <p className="summary-value">{shipping}/-</p>
                    </div>
                    <hr />
                    <div className="summary-total">
                        <p className="total-label">Total: </p>
                        <p className="total-value">{total.toFixed(2)}/-</p>
                    </div>
                    <button className="checkout-btn" disabled={cartItems.length === 0}>
                        Checkout
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Cart;