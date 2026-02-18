import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, People, Receipt, AttachMoney } from '@mui/icons-material'
import AdminLayout from './AdminLayout'
import { getAllOrders } from '../features/order/orderSlice'
import { getAllUsers, getAdminProducts } from '../features/admin/adminSlice'
import Loader from '../components/Loader'
import '../Admin/adminStyles/AdminLayout.css'
import '../Admin/adminStyles/AdminDashboard.css'

function AdminDashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { orders, totalAmount, loading: orderLoading } = useSelector(state => state.order)
    const { users, products, loading: adminLoading } = useSelector(state => state.admin)

    useEffect(() => {
        dispatch(getAllOrders())
        dispatch(getAllUsers())
        dispatch(getAdminProducts())
    }, [dispatch])

    const stats = [
        {
            label: 'Total Revenue',
            value: `Rs. ${Number(totalAmount || 0).toFixed(0)}`,
            icon: <AttachMoney />,
            bg: '#fef9c3',
            iconColor: '#ca8a04',
        },
        {
            label: 'Total Orders',
            value: orders.length,
            icon: <Receipt />,
            bg: '#eff6ff',
            iconColor: '#3b82f6',
        },
        {
            label: 'Total Products',
            value: products.length,
            icon: <ShoppingBag />,
            bg: '#fdf4ff',
            iconColor: '#a855f7',
        },
        {
            label: 'Total Users',
            value: users.length,
            icon: <People />,
            bg: '#f0fdf4',
            iconColor: '#22c55e',
        },
    ]

    const statusCount = (status) => orders.filter(o => o.orderStatus === status).length
    const outOfStock = products.filter(p => p.stock === 0).length
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

    if (orderLoading || adminLoading) return <AdminLayout><Loader /></AdminLayout>

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Dashboard</h1>
                    <p className="admin-page-subtitle">Welcome back, here's what's happening.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-icon" style={{ background: s.bg }}>
                            <span style={{ color: s.iconColor, display: 'flex' }}>{s.icon}</span>
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick insights row */}
            <div className="dashboard-insights">
                <div className="insight-card">
                    <h3 className="insight-title">Order Status</h3>
                    <div className="insight-bars">
                        {['Processing', 'Shipped', 'Delivered'].map(s => (
                            <div key={s} className="insight-bar-row">
                                <span className="insight-bar-label">{s}</span>
                                <div className="insight-bar-track">
                                    <div
                                        className={`insight-bar-fill status-fill-${s.toLowerCase()}`}
                                        style={{ width: orders.length ? `${(statusCount(s) / orders.length) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="insight-bar-count">{statusCount(s)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="insight-card">
                    <h3 className="insight-title">Quick Stats</h3>
                    <div className="quick-stat-list">
                        <div className="quick-stat">
                            <span className="qs-label">Out of Stock</span>
                            <span className="qs-value danger">{outOfStock}</span>
                        </div>
                        <div className="quick-stat">
                            <span className="qs-label">Low Stock (≤5)</span>
                            <span className="qs-value warn">{products.filter(p => p.stock > 0 && p.stock <= 5).length}</span>
                        </div>
                        <div className="quick-stat">
                            <span className="qs-label">Admin Users</span>
                            <span className="qs-value">{users.filter(u => u.role === 'admin').length}</span>
                        </div>
                        <div className="quick-stat">
                            <span className="qs-label">Pending Orders</span>
                            <span className="qs-value warn">{statusCount('Processing')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-table-wrap" style={{ marginTop: '1.5rem' }}>
                <div className="admin-table-toolbar">
                    <span style={{ fontWeight: 700, fontFamily: 'Syne, sans-serif', fontSize: '1rem' }}>Recent Orders</span>
                    <button className="admin-primary-btn" onClick={() => navigate('/admin/orders')}>View All</button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.length === 0 && (
                            <tr><td colSpan={5} className="no-data">No orders yet</td></tr>
                        )}
                        {recentOrders.map(order => (
                            <tr key={order._id}>
                                <td className="mono">#{order._id.slice(-8).toUpperCase()}</td>
                                <td>{order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}</td>
                                <td>Rs. {order.totalPrice?.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard
