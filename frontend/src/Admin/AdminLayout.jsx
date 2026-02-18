import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
    Dashboard, ShoppingBag, People, Receipt,
    Logout, Menu, Close, TrendingUp, RateReview
} from '@mui/icons-material'
import {logout} from '../features/user/userSlice.js'
import { toast } from 'react-toastify'
import '../Admin/adminStyles/AdminLayout.css'

const navItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { label: 'Products',  icon: <ShoppingBag />, path: '/admin/products' },
    { label: 'Orders',    icon: <Receipt />, path: '/admin/orders' },
    { label: 'Users',     icon: <People />, path: '/admin/users' },
    { label: 'Reviews',   icon: <RateReview />, path: '/admin/reviews' },
]

function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout()).unwrap().then(() => {
            toast.success('Logged out!', { position: 'top-center', autoClose: 2000 })
            navigate('/')
        })
    }

    return (
        <div className={`admin-shell ${collapsed ? 'collapsed' : ''}`}>
            <aside className="admin-sidebar">
                <div className="sidebar-top">
                    <div className="sidebar-brand">
                        <TrendingUp className="brand-icon" />
                        {!collapsed && <span className="brand-text">AdminPanel</span>}
                    </div>
                    <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <Menu /> : <Close />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            title={collapsed ? item.label : ''}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {!collapsed && <span className="nav-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
                    <Logout fontSize="small" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </aside>

            <main className="admin-main">
                {children}
            </main>
        </div>
    )
}

export default AdminLayout
