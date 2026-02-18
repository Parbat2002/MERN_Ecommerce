import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Visibility, Delete, Edit } from '@mui/icons-material'
import { toast } from 'react-toastify'
import AdminLayout from './AdminLayout'
import Loader from '../components/Loader'
import { getAllOrders, updateOrderStatus, deleteOrder, removeErrors, removeSuccess } from '../features/order/orderSlice'
import '../adminStyles/AdminStyles.css'

const ROWS_PER_PAGE = 8

function AdminOrders() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { orders, loading, error, success, message } = useSelector(state => state.order)

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [page, setPage] = useState(1)
    const [editModal, setEditModal] = useState(null)   // order object
    const [deleteModal, setDeleteModal] = useState(null) // order id
    const [newStatus, setNewStatus] = useState('')

    useEffect(() => { dispatch(getAllOrders()) }, [dispatch])

    useEffect(() => {
        if (error) { toast.error(error, { position: 'top-center', autoClose: 3000 }); dispatch(removeErrors()) }
        if (success) { toast.success(message, { position: 'top-center', autoClose: 2500 }); dispatch(removeSuccess()); setEditModal(null); setDeleteModal(null) }
    }, [error, success, message, dispatch])

    const filtered = orders
        .filter(o => statusFilter === 'All' || o.orderStatus === statusFilter)
        .filter(o => o._id.toLowerCase().includes(search.toLowerCase()) || o.user?.name?.toLowerCase().includes(search.toLowerCase()))

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE)
    const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

    const handleUpdateStatus = () => {
        if (!newStatus) { toast.error('Please select a status'); return }
        dispatch(updateOrderStatus({ id: editModal._id, status: newStatus }))
    }

    const handleDelete = () => dispatch(deleteOrder(deleteModal))

    if (loading && orders.length === 0) return <AdminLayout><Loader /></AdminLayout>

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Orders</h1>
                    <p className="admin-page-subtitle">{orders.length} total orders</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {['All', 'Processing', 'Shipped', 'Delivered'].map(s => (
                    <button key={s} className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                        onClick={() => { setStatusFilter(s); setPage(1) }}
                        style={{ padding: '0.4rem 1rem', border: '1.5px solid #e0e0e0', background: statusFilter === s ? '#0d0d0d' : 'white', color: statusFilter === s ? 'white' : '#555', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.18s' }}
                    >{s}</button>
                ))}
            </div>

            <div className="admin-table-wrap">
                <div className="admin-table-toolbar">
                    <input
                        className="admin-search-input"
                        placeholder="Search by order ID or customer..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{filtered.length} results</span>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 && (
                            <tr><td colSpan={7} className="no-data">No orders found</td></tr>
                        )}
                        {paginated.map(order => (
                            <tr key={order._id}>
                                <td className="mono">#{order._id.slice(-8).toUpperCase()}</td>
                                <td>{order.user?.name || 'N/A'}</td>
                                <td>{order.orderItems?.length}</td>
                                <td>Rs. {order.totalPrice?.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge status-${order.orderStatus?.toLowerCase()}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="view-btn" onClick={() => navigate(`/order/${order._id}`)}>
                                            <Visibility fontSize="small" />
                                        </button>
                                        <button className="edit-btn" onClick={() => { setEditModal(order); setNewStatus(order.orderStatus) }}>
                                            <Edit fontSize="small" />
                                        </button>
                                        <button className="delete-btn" onClick={() => setDeleteModal(order._id)}>
                                            <Delete fontSize="small" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="admin-pagination">
                        <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                    </div>
                )}
            </div>

            {/* Edit Status Modal */}
            {editModal && (
                <div className="modal-overlay" onClick={() => setEditModal(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Update Order Status</h2>
                        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                            Order #{editModal._id.slice(-8).toUpperCase()}
                        </p>
                        <div className="modal-form-group">
                            <label>Order Status</label>
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <div className="modal-btns">
                            <button className="modal-cancel-btn" onClick={() => setEditModal(null)}>Cancel</button>
                            <button className="modal-submit-btn" onClick={handleUpdateStatus} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal-box confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">🗑️</div>
                        <h3>Delete Order?</h3>
                        <p>This action cannot be undone. Only delivered orders can be deleted.</p>
                        <div className="modal-btns" style={{ justifyContent: 'center' }}>
                            <button className="modal-cancel-btn" onClick={() => setDeleteModal(null)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default AdminOrders
