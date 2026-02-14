import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemsToCart, removeCartItem } from '../features/cart/cartSlice';


function CartItem({ item }) {
    const dispatch = useDispatch();

    const increaseQty = () => {
        if (item.stock <= item.quantity) return;
        dispatch(addItemsToCart({ id: item.product, quantity: item.quantity + 1 }));
    };

    const decreaseQty = () => {
        if (item.quantity <= 1) return;
        dispatch(addItemsToCart({ id: item.product, quantity: item.quantity - 1 }));
    };

    const removeHandler = () => {
        dispatch(removeCartItem(item.product));
    };

    return (
        <div className="cart-item">
            <div className="item-info">
                <img src={item.image} alt={item.name} className='item-image' />
                <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price"><strong>Price: </strong>{item.price}/-</p>
                </div>
            </div>
            <div className="quantity-controls">
                <button className="quantity-button" onClick={decreaseQty}>-</button>
                <input type="number" value={item.quantity} className='quantity-input' readOnly />
                <button className="quantity-button" onClick={increaseQty}>+</button>
            </div>
            <div className="item-total">
                <span className="item-total-price">{(item.price * item.quantity).toFixed(2)}/-</span>
            </div>
            <div className="item-actions">
                <button className="remove-item-btn" onClick={removeHandler}>Remove</button>
            </div>
        </div>
    );
}

export default CartItem;