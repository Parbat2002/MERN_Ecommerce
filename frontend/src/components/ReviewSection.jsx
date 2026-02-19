import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Star, StarBorder, Delete } from '@mui/icons-material'
import { toast } from 'react-toastify'
import {
    createReview, getProductReviews, deleteReview,
    removeErrors, removeSuccess
} from '../features/review/reviewSlice'
import '../componentStyles/componentStyles.css'

function StarInput({ value, onChange }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="star-input">
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    className="star-input-icon"
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)}
                >
                    {n <= (hovered || value)
                        ? <Star style={{ color: '#f59e0b', fontSize: '1.6rem' }} />
                        : <StarBorder style={{ color: '#d1d5db', fontSize: '1.6rem' }} />
                    }
                </span>
            ))}
            <span className="star-input-label">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hovered || value] || ''}
            </span>
        </div>
    )
}

function StarDisplay({ rating, size = '1rem' }) {
    return (
        <div className="star-display">
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n}>
                    {n <= Math.round(rating)
                        ? <Star style={{ color: '#f59e0b', fontSize: size }} />
                        : <StarBorder style={{ color: '#d1d5db', fontSize: size }} />
                    }
                </span>
            ))}
        </div>
    )
}

function ReviewSection({ productId }) {
    const dispatch = useDispatch()
    const { reviews, loading, error, success, message } = useSelector(state => state.review)
    const { user, isAuthenticated } = useSelector(state => state.user)

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        dispatch(getProductReviews(productId))
    }, [dispatch, productId])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 2500 })
            dispatch(removeSuccess())
            setRating(0)
            setComment('')
            setShowForm(false)
            dispatch(getProductReviews(productId))
        }
    }, [error, success, message, dispatch, productId])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!rating) { toast.error('Please select a star rating', { position: 'top-center' }); return }
        if (!comment.trim()) { toast.error('Please write a comment', { position: 'top-center' }); return }
        dispatch(createReview({ rating, comment, productId }))
    }

    const handleDelete = (reviewId) => {
        dispatch(deleteReview({ reviewId, productId }))
    }

    const myReview = reviews.find(r => r.user?.toString() === user?._id?.toString())

    const openForm = () => {
        if (myReview) {
            setRating(myReview.rating)
            setComment(myReview.comment)
        }
        setShowForm(true)
    }

    const avgRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    const ratingBreakdown = [5, 4, 3, 2, 1].map(n => ({
        star: n,
        count: reviews.filter(r => Math.round(r.rating) === n).length,
        pct: reviews.length ? Math.round((reviews.filter(r => Math.round(r.rating) === n).length / reviews.length) * 100) : 0
    }))

    return (
        <div className="review-section">

            {/* ── Summary Bar ── */}
            <div className="review-summary">
                <div className="review-avg-block">
                    <span className="review-avg-number">{avgRating}</span>
                    <StarDisplay rating={Number(avgRating)} size="1.3rem" />
                    <span className="review-avg-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="review-breakdown">
                    {ratingBreakdown.map(({ star, count, pct }) => (
                        <div key={star} className="breakdown-row">
                            <span className="breakdown-star">{star} ★</span>
                            <div className="breakdown-bar-track">
                                <div className="breakdown-bar-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="breakdown-count">{count}</span>
                        </div>
                    ))}
                </div>
                {isAuthenticated && (
                    <button className="write-review-btn" onClick={openForm}>
                        {myReview ? '✏️ Edit Your Review' : '✍️ Write a Review'}
                    </button>
                )}
                {!isAuthenticated && (
                    <p className="login-to-review">
                        <a href="/login">Login</a> to write a review
                    </p>
                )}
            </div>

            {/* ── Review Form ── */}
            {showForm && (
                <div className="review-form-wrap">
                    <div className="review-form-card">
                        <div className="review-form-header">
                            <h3>{myReview ? 'Update Your Review' : 'Write a Review'}</h3>
                            <button className="close-form-btn" onClick={() => setShowForm(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Your Rating</label>
                                <StarInput value={rating} onChange={setRating} />
                            </div>
                            <div className="form-group">
                                <label>Your Review</label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    rows={4}
                                    maxLength={500}
                                />
                                <span className="char-count">{comment.length}/500</span>
                            </div>
                            <button type="submit" className="submit-review-btn" disabled={loading}>
                                {loading ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Reviews List ── */}
            <div className="reviews-list-header">
                <h3 className="reviews-list-title">Customer Reviews</h3>
            </div>

            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <span className="no-reviews-icon">💬</span>
                    <p>No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map(review => {
                        const isOwn = review.user?.toString() === user?._id?.toString()
                        const isAdmin = user?.role === 'admin'
                        return (
                            <div key={review._id} className={`review-card ${isOwn ? 'own-review' : ''}`}>
                                <div className="review-card-top">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">
                                            {review.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="reviewer-name">
                                                {review.name}
                                                {isOwn && <span className="own-badge">You</span>}
                                            </p>
                                            <StarDisplay rating={review.rating} size="0.9rem" />
                                        </div>
                                    </div>
                                    {(isOwn || isAdmin) && (
                                        <button
                                            className="delete-review-btn"
                                            onClick={() => handleDelete(review._id)}
                                            title="Delete review"
                                            disabled={loading}
                                        >
                                            <Delete fontSize="small" />
                                        </button>
                                    )}
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export { StarDisplay }
export default ReviewSection
