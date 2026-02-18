import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Delete, Search } from '@mui/icons-material'
import { toast } from 'react-toastify'
import AdminLayout from './AdminLayout'
import { getAdminProducts } from '../features/admin/adminSlice'
import {
    getProductReviews, deleteReview,
    removeErrors, removeSuccess, clearReviews
} from '../features/review/reviewSlice'
import '../Admin/adminStyles/AdminLayout.css'
import '../Admin/adminStyles/AdminReviews.css'

function StarDisplay({ rating }) {
    return (
        <span className="admin-stars">
            {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
        </span>
    )
}

function AdminReviews() {
    const dispatch = useDispatch()
    const { products } = useSelector(state => state.admin)
    const { reviews, loading, error, success, message } = useSelector(state => state.review)

    const [selectedProduct, setSelectedProduct] = useState('')
    const [productSearch, setProductSearch] = useState('')
    const [deleteModal, setDeleteModal] = useState(null)

    useEffect(() => {
        dispatch(getAdminProducts())
        return () => dispatch(clearReviews())
    }, [dispatch])

    useEffect(() => {
        if (selectedProduct) dispatch(getProductReviews(selectedProduct))
    }, [selectedProduct, dispatch])

    useEffect(() => {
        if (error) { toast.error(error, { position: 'top-center', autoClose: 3000 }); dispatch(removeErrors()) }
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 2500 })
            dispatch(removeSuccess())
            setDeleteModal(null)
            if (selectedProduct) dispatch(getProductReviews(selectedProduct))
        }
    }, [error, success, message, dispatch, selectedProduct])

    const handleDelete = () => {
        dispatch(deleteReview({ reviewId: deleteModal, productId: selectedProduct }))
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    )

    const selectedProductObj = products.find(p => p._id === selectedProduct)

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Reviews</h1>
                    <p className="admin-page-subtitle">Manage product reviews</p>
                </div>
            </div>

            <div className="reviews-admin-grid">

                {/* ── Product Picker ── */}
                <div className="product-picker-panel">
                    <div className="picker-search-wrap">
                        <Search style={{ color: '#aaa', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} fontSize="small" />
                        <input
                            className="picker-search"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                        />
                    </div>
                    <div className="picker-list">
                        {filteredProducts.length === 0 && (
                            <p className="no-data" style={{ padding: '1.5rem' }}>No products found</p>
                        )}
                        {filteredProducts.map(p => (
                            <div
                                key={p._id}
                                className={`picker-item ${selectedProduct === p._id ? 'selected' : ''}`}
                                onClick={() => setSelectedProduct(p._id)}
                            >
                                <img
                                    src={p.image?.[0]?.url || '/images/placeholder.png'}
                                    alt={p.name}
                                    className="picker-thumb"
                                />
                                <div className="picker-info">
                                    <p className="picker-name">{p.name}</p>
                                    <p className="picker-meta">
                                        ⭐ {p.ratings?.toFixed(1)} · {p.numberOfReviews} review{p.numberOfReviews !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Reviews Panel ── */}
                <div className="reviews-panel">
                    {!selectedProduct ? (
                        <div className="select-product-prompt">
                            <span className="prompt-icon">👈</span>
                            <p>Select a product to view its reviews</p>
                        </div>
                    ) : (
                        <>
                            {/* Product header */}
                            <div className="reviews-panel-header">
                                <div className="panel-product-info">
                                    <img
                                        src={selectedProductObj?.image?.[0]?.url || '/images/placeholder.png'}
                                        alt={selectedProductObj?.name}
                                        className="panel-product-img"
                                    />
                                    <div>
                                        <h3 className="panel-product-name">{selectedProductObj?.name}</h3>
                                        <div className="panel-stats">
                                            <span className="panel-avg">⭐ {avgRating}</span>
                                            <span className="panel-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews table */}
                            {loading ? (
                                <div className="no-data" style={{ padding: '3rem' }}>Loading reviews...</div>
                            ) : reviews.length === 0 ? (
                                <div className="no-reviews-admin">
                                    <span>💬</span>
                                    <p>No reviews for this product yet.</p>
                                </div>
                            ) : (
                                <div className="admin-table-wrap" style={{ borderRadius: '12px', border: 'none', boxShadow: 'none' }}>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Reviewer</th>
                                                <th>Rating</th>
                                                <th>Comment</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reviews.map(review => (
                                                <tr key={review._id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                            <div className="reviewer-initials">
                                                                {review.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span style={{ fontWeight: 500 }}>{review.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <StarDisplay rating={review.rating} />
                                                        <span style={{ marginLeft: '0.3rem', fontSize: '0.8rem', color: '#888' }}>
                                                            ({review.rating}/5)
                                                        </span>
                                                    </td>
                                                    <td style={{ maxWidth: '260px' }}>
                                                        <p className="review-comment-cell">{review.comment}</p>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => setDeleteModal(review._id)}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal-box confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">🗑️</div>
                        <h3>Delete Review?</h3>
                        <p>This will permanently remove this customer review.</p>
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

export default AdminReviews
