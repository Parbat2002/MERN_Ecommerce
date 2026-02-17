import React, { useState } from 'react'
import '../CartStyles/Payment.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../features/cart/cartSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CreditCard, Lock } from '@mui/icons-material'

function Payment() {
    const orderItem = JSON.parse(sessionStorage.getItem('orderItem'))
    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [cardNumber, setCardNumber] = useState('')
    const [cardHolder, setCardHolder] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [processing, setProcessing] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(null) // 'success' | 'failure' | null

    // Format card number with spaces every 4 digits
    const handleCardNumberChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
        const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw
        setCardNumber(formatted)
    }

    // Format expiry as MM/YY
    const handleExpiryChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
        const formatted = raw.length > 2 ? raw.slice(0, 2) + '/' + raw.slice(2) : raw
        setExpiryDate(formatted)
    }

    const handlePayment = async (e) => {
        e.preventDefault()
        setProcessing(true)
        setPaymentStatus(null)

        try {
            // Step 1: Process demo payment
            const { data: paymentData } = await axios.post('/api/v1/payment/process', {
                cardNumber: cardNumber.replace(/\s/g, ''),
                cardHolder,
                expiryDate,
                cvv,
                amount: orderItem?.total,
            })

            // Step 2: Create order in database
            const orderData = {
                shippingInfo,
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    product: item.product,
                })),
                paymentInfo: {
                    id: paymentData.transactionId,
                    status: 'succeeded',
                },
                itemsPrice: orderItem?.subtotal,
                taxPrice: orderItem?.tax,
                shippingPrice: orderItem?.shipping,
                totalPrice: orderItem?.total,
            }

            await axios.post('/api/v1/payment/order/new', orderData)

            // Step 3: Clear cart and show success
            dispatch(clearCart())
            sessionStorage.removeItem('orderItem')
            setPaymentStatus('success')
            toast.success('Payment Successful! Order Placed 🎉', { position: 'top-center', autoClose: 4000 })

            setTimeout(() => {
                navigate('/orders/user')
            }, 3000)

        } catch (error) {
            setPaymentStatus('failure')
            const msg = error.response?.data?.message || 'Payment failed. Please try again.'
            toast.error(msg, { position: 'top-center', autoClose: 4000 })
        } finally {
            setProcessing(false)
        }
    }

    // -------- Payment Success Screen --------
    if (paymentStatus === 'success') {
        return (
            <>
                <PageTitle title='Payment Successful' />
                <Navbar />
                <div className="payment-result-container success">
                    <div className="payment-result-icon">✅</div>
                    <h2>Payment Successful!</h2>
                    <p>Your order has been placed. Redirecting to your orders...</p>
                </div>
                <Footer />
            </>
        )
    }

    // -------- Payment Failure Screen --------
    if (paymentStatus === 'failure') {
        return (
            <>
                <PageTitle title='Payment Failed' />
                <Navbar />
                <div className="payment-result-container failure">
                    <div className="payment-result-icon">❌</div>
                    <h2>Payment Failed!</h2>
                    <p>Your card was declined or something went wrong.</p>
                    <div className="payment-failure-hint">
                        <p>💡 <strong>Demo Tip:</strong> Card numbers ending in <code>0000</code> always fail. Try a different card number.</p>
                    </div>
                    <button className="payment-btn retry-btn" onClick={() => setPaymentStatus(null)}>
                        Try Again
                    </button>
                </div>
                <Footer />
            </>
        )
    }

    // -------- Payment Form --------
    return (
        <>
            <PageTitle title='Payment Processing' />
            <Navbar />
            <CheckoutPath activePath={2} />
            <div className="payment-container">
                <Link to='/order/confirm' className='payment-go-back'>← Go Back</Link>

                <div className="payment-card-wrapper">
                    <div className="payment-card-preview">
                        <div className="card-preview-chip">
                            <CreditCard fontSize="large" />
                        </div>
                        <div className="card-preview-number">
                            {cardNumber || '**** **** **** ****'}
                        </div>
                        <div className="card-preview-bottom">
                            <span>{cardHolder || 'CARD HOLDER'}</span>
                            <span>{expiryDate || 'MM/YY'}</span>
                        </div>
                    </div>

                    <form className="payment-form" onSubmit={handlePayment}>
                        <h2 className="payment-form-title">
                            <Lock fontSize="small" /> Secure Demo Payment
                        </h2>

                        <div className="payment-demo-notice">
                            🔒 <strong>Demo Mode</strong> — No real money is charged.
                            Use any 16-digit card number. Cards ending in <strong>0000</strong> will fail.
                        </div>

                        <div className="payment-form-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                maxLength={19}
                                required
                            />
                        </div>

                        <div className="payment-form-group">
                            <label>Card Holder Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                required
                            />
                        </div>

                        <div className="payment-form-row">
                            <div className="payment-form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChange={handleExpiryChange}
                                    maxLength={5}
                                    required
                                />
                            </div>
                            <div className="payment-form-group">
                                <label>CVV</label>
                                <input
                                    type="password"
                                    placeholder="***"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
                                    required
                                />
                            </div>
                        </div>

                        <div className="payment-summary">
                            <span>Amount to Pay:</span>
                            <strong>Rs. {orderItem?.total?.toFixed(2) || '0.00'}/-</strong>
                        </div>

                        <button
                            type="submit"
                            className="payment-btn"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="payment-processing-text">
                                    <span className="spinner" /> Processing...
                                </span>
                            ) : (
                                `Pay Rs. ${orderItem?.total?.toFixed(2) || '0.00'}/-`
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Payment

