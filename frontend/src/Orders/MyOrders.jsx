import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import PageTitle from '../components/PageTitle'
import { getMyOrders, removeErrors } from '../features/order/orderSlice'
import '../orderStyles/OrderStyles.css'

function MyOrders() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { orders, loading, error } = useSelector(state => state.order)
    const { user } = useSelector(state => state.user)
    const [filter, setFilter] = useState('All')

    useEffect(() => {
        dispatch(getMyOrders())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [error, dispatch])

    const statusColors = {
        Processing: { bg: '#fff8e1', color: '#f59e0b', dot: '#f59e0b' },
        Shipped: { bg: '#e8f4fd', color: '#3b82f6', dot: '#3b82f6' },
        Delivered: { bg: '#f0fdf4', color: '#22c55e', dot: '#22c55e' },
    }

    const filters = ['All', 'Processing', 'Shipped', 'Delivered']
    const filtered = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter)

    if (loading) return <><Navbar /><Loader /><Footer /></>

    return (
        <>
            <PageTitle title="My Orders" />
            <Navbar />
            <div className="myorders-page">
                <div className="myorders-header">
                    <div className="myorders-title-group">
                        <h1 className="myorders-title">My Orders</h1>
                        <span className="myorders-count">{orders.length} orders</span>
                    </div>
                    <div className="myorders-filters">
                        {filters.map(f => (
                            <button
                                key={f}
                                className={`filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >{f}</button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="myorders-empty">
                        <div className="empty-icon">📦</div>
                        <h3>No orders found</h3>
                        <p>You haven't placed any {filter !== 'All' ? filter.toLowerCase() : ''} orders yet.</p>
                        <button className="shop-now-btn" onClick={() => navigate('/products')}>Shop Now</button>
                    </div>
                ) : (
                    <div className="myorders-list">
                        {filtered.map(order => (
                            <div className="order-card" key={order._id} onClick={() => navigate(`/order/${order._id}`)}>
                                <div className="order-card-top">
                                    <div className="order-id-group">
                                        <span className="order-label">Order ID</span>
                                        <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div
                                        className="order-status-badge"
                                        style={{
                                            background: statusColors[order.orderStatus]?.bg || '#f5f5f5',
                                            color: statusColors[order.orderStatus]?.color || '#666'
                                        }}
                                    >
                                        <span
                                            className="status-dot"
                                            style={{ background: statusColors[order.orderStatus]?.dot || '#999' }}
                                        />
                                        {order.orderStatus}
                                    </div>
                                </div>

                                <div className="order-card-items">
                                    {order.orderItems.slice(0, 3).map((item, i) => (
                                        <img key={i} src={item.image} alt={item.name} className="order-item-thumb" title={item.name} />
                                    ))}
                                    {order.orderItems.length > 3 && (
                                        <div className="order-items-more">+{order.orderItems.length - 3}</div>
                                    )}
                                </div>

                                <div className="order-card-bottom">
                                    <div className="order-meta">
                                        <span className="order-date">
                                            🗓 {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="order-items-count">{order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="order-total">
                                        <span>Rs. {order.totalPrice?.toFixed(2)}/-</span>
                                        <span className="view-details">View Details →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default MyOrders
