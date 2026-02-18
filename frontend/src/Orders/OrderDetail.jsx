import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import PageTitle from '../components/PageTitle'
import { getSingleOrder, removeErrors } from '../features/order/orderSlice'
import '../orderStyles/OrderStyles.css'

function OrderDetail() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { order, loading, error } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(getSingleOrder(id))
    }, [dispatch, id])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [error, dispatch])

    const steps = ['Processing', 'Shipped', 'Delivered']
    const currentStep = steps.indexOf(order?.orderStatus)

    if (loading) return <><Navbar /><Loader /><Footer /></>
    if (!order) return null

    return (
        <>
            <PageTitle title="Order Details" />
            <Navbar />
            <div className="orderdetail-page">
                <button className="back-btn" onClick={() => navigate('/orders/user')}>← Back to Orders</button>

                <div className="orderdetail-grid">
                    {/* Left Column */}
                    <div className="orderdetail-left">
                        {/* Status Tracker */}
                        <div className="od-card">
                            <h2 className="od-card-title">Order Status</h2>
                            <div className="status-tracker">
                                {steps.map((step, i) => (
                                    <div key={step} className={`tracker-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}>
                                        <div className="tracker-circle">{i < currentStep ? '✓' : i + 1}</div>
                                        <span className="tracker-label">{step}</span>
                                        {i < steps.length - 1 && <div className={`tracker-line ${i < currentStep ? 'done' : ''}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="od-card">
                            <h2 className="od-card-title">Items Ordered ({order.orderItems.length})</h2>
                            <div className="od-items-list">
                                {order.orderItems.map((item, i) => (
                                    <div key={i} className="od-item">
                                        <img src={item.image} alt={item.name} className="od-item-img" />
                                        <div className="od-item-info">
                                            <p className="od-item-name">{item.name}</p>
                                            <p className="od-item-qty">Qty: {item.quantity} × Rs. {item.price}/-</p>
                                        </div>
                                        <p className="od-item-total">Rs. {(item.quantity * item.price).toFixed(2)}/-</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="orderdetail-right">
                        {/* Order Summary */}
                        <div className="od-card">
                            <h2 className="od-card-title">Order Summary</h2>
                            <div className="od-summary-row">
                                <span>Order ID</span>
                                <span className="mono">#{order._id.slice(-10).toUpperCase()}</span>
                            </div>
                            <div className="od-summary-row">
                                <span>Placed On</span>
                                <span>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="od-summary-row">
                                <span>Payment</span>
                                <span className="payment-badge">✓ Paid</span>
                            </div>
                            <hr className="od-divider" />
                            <div className="od-summary-row">
                                <span>Subtotal</span>
                                <span>Rs. {order.itemsPrice?.toFixed(2)}/-</span>
                            </div>
                            <div className="od-summary-row">
                                <span>Tax (13%)</span>
                                <span>Rs. {order.taxPrice?.toFixed(2)}/-</span>
                            </div>
                            <div className="od-summary-row">
                                <span>Shipping</span>
                                <span>Rs. {order.shippingPrice?.toFixed(2)}/-</span>
                            </div>
                            <hr className="od-divider" />
                            <div className="od-summary-row total-row">
                                <span>Total</span>
                                <span>Rs. {order.totalPrice?.toFixed(2)}/-</span>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="od-card">
                            <h2 className="od-card-title">Shipping Address</h2>
                            <div className="od-shipping">
                                <p className="od-shipping-name">{order.user?.name}</p>
                                <p>{order.shippingInfo?.address}</p>
                                <p>{order.shippingInfo?.city}, {order.shippingInfo?.state}</p>
                                <p>{order.shippingInfo?.country} — {order.shippingInfo?.pinCode}</p>
                                <p>📞 {order.shippingInfo?.phoneNo}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="od-card">
                            <h2 className="od-card-title">Payment Info</h2>
                            <div className="od-summary-row">
                                <span>Transaction ID</span>
                                <span className="mono small">{order.paymentInfo?.id}</span>
                            </div>
                            <div className="od-summary-row">
                                <span>Status</span>
                                <span className="payment-badge">✓ {order.paymentInfo?.status}</span>
                            </div>
                            {order.paidAt && (
                                <div className="od-summary-row">
                                    <span>Paid At</span>
                                    <span>{new Date(order.paidAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default OrderDetail
