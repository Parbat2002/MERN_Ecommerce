import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Delete, Add } from '@mui/icons-material'
import { toast } from 'react-toastify'
import AdminLayout from './AdminLayout'
import Loader from '../components/Loader'
import {
    getAdminProducts, createProduct, updateProduct,
    deleteProduct, removeErrors, removeSuccess
} from '../features/admin/adminSlice'
import '../adminStyles/AdminStyles.css'

const ROWS_PER_PAGE = 8
const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Books', 'Home', 'Beauty', 'Sports', 'Toys', 'Other']
const emptyForm = { name: '', description: '', price: '', category: '', stock: '', images: '' }

function AdminProducts() {
    const dispatch = useDispatch()
    const { products, loading, error, success, message } = useSelector(state => state.admin)

    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [page, setPage] = useState(1)
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(null)
    const [deleteModal, setDeleteModal] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [imagePreview, setImagePreview] = useState('')

    useEffect(() => { dispatch(getAdminProducts()) }, [dispatch])

    useEffect(() => {
        if (error) { toast.error(error, { position: 'top-center', autoClose: 3000 }); dispatch(removeErrors()) }
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 2500 })
            dispatch(removeSuccess())
            setCreateModal(false)
            setEditModal(null)
            setDeleteModal(null)
            setForm(emptyForm)
            setImagePreview('')
        }
    }, [error, success, message, dispatch])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            // Store the base64 DataURL — backend will upload it to Cloudinary
            setImagePreview(reader.result)
            setForm(f => ({ ...f, images: reader.result }))
        }
        reader.readAsDataURL(file)
    }

    const handleCreate = () => {
        const { name, description, price, category, stock, images } = form
        if (!name || !description || !price || !category || !stock) {
            toast.error('Please fill all required fields')
            return
        }
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
        }
        // images is a base64 DataURL string; adminSlice wraps it in an array for backend
        if (images) productData.images = images
        dispatch(createProduct(productData))
    }

    const handleUpdate = () => {
        const { name, description, price, category, stock, images } = form
        if (!name || !description || !price || !category || !stock) {
            toast.error('Please fill all required fields')
            return
        }
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
        }
        // Only send new image if user chose one; otherwise backend keeps existing images
        if (images) productData.images = images
        dispatch(updateProduct({ id: editModal._id, productData }))
    }

    const openEdit = (product) => {
        setEditModal(product)
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            images: '', // don't re-send existing Cloudinary image
        })
        setImagePreview(product.image?.[0]?.url || '')
    }

    const categories = ['All', ...new Set(products.map(p => p.category))]

    const filtered = products
        .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
        .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE)
    const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

    if (loading && products.length === 0) return <AdminLayout><Loader /></AdminLayout>

    const ProductForm = ({ onSubmit, submitLabel }) => (
        <>
            {/* Image Upload */}
            <div className="modal-form-group">
                <label>Product Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {imagePreview && (
                        <img src={imagePreview} alt="preview"
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                        />
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.85rem' }} />
                </div>
            </div>
            <div className="modal-form-group">
                <label>Product Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter product name" />
            </div>
            <div className="modal-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="modal-form-group">
                    <label>Price (Rs.)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" min="0" />
                </div>
                <div className="modal-form-group">
                    <label>Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" min="0" />
                </div>
            </div>
            <div className="modal-form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="modal-btns">
                <button className="modal-cancel-btn" onClick={() => {
                    setCreateModal(false); setEditModal(null); setForm(emptyForm); setImagePreview('')
                }}>Cancel</button>
                <button className="modal-submit-btn" onClick={onSubmit} disabled={loading}>
                    {loading ? 'Saving...' : submitLabel}
                </button>
            </div>
        </>
    )

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Products</h1>
                    <p className="admin-page-subtitle">{products.length} products in store</p>
                </div>
                <button className="admin-primary-btn" onClick={() => {
                    setForm(emptyForm); setImagePreview(''); setCreateModal(true)
                }}>
                    <Add fontSize="small" /> Add Product
                </button>
            </div>

            {/* Category filters */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {categories.map(c => (
                    <button key={c} onClick={() => { setCategoryFilter(c); setPage(1) }}
                        style={{
                            padding: '0.4rem 1rem', border: '1.5px solid #e0e0e0',
                            background: categoryFilter === c ? '#0d0d0d' : 'white',
                            color: categoryFilter === c ? 'white' : '#555',
                            borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.18s'
                        }}
                    >{c}</button>
                ))}
            </div>

            <div className="admin-table-wrap">
                <div className="admin-table-toolbar">
                    <input
                        className="admin-search-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{filtered.length} results</span>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 && (
                            <tr><td colSpan={7} className="no-data">No products found</td></tr>
                        )}
                        {paginated.map(product => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={product.image?.[0]?.url || '/images/placeholder.png'}
                                        alt={product.name}
                                        className="product-thumb"
                                    />
                                </td>
                                <td style={{ fontWeight: 500, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {product.name}
                                </td>
                                <td>
                                    <span style={{ background: '#f5f5f5', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', color: '#555' }}>
                                        {product.category}
                                    </span>
                                </td>
                                <td>Rs. {product.price}</td>
                                <td>
                                    <span style={{
                                        fontWeight: 600,
                                        color: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#22c55e'
                                    }}>
                                        {product.stock === 0 ? 'Out of Stock' : product.stock}
                                    </span>
                                </td>
                                <td>⭐ {product.ratings?.toFixed(1) || '0.0'} ({product.numberOfReviews})</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => openEdit(product)}>
                                            <Edit fontSize="small" /> Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => setDeleteModal(product._id)}>
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

            {/* Create Modal */}
            {createModal && (
                <div className="modal-overlay" onClick={() => { setCreateModal(false); setForm(emptyForm); setImagePreview('') }}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Add New Product</h2>
                        <ProductForm onSubmit={handleCreate} submitLabel="Create Product" />
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="modal-overlay" onClick={() => { setEditModal(null); setForm(emptyForm); setImagePreview('') }}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Edit Product</h2>
                        <ProductForm onSubmit={handleUpdate} submitLabel="Save Changes" />
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal-box confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">🗑️</div>
                        <h3>Delete Product?</h3>
                        <p>This will permanently remove the product from your store.</p>
                        <div className="modal-btns" style={{ justifyContent: 'center' }}>
                            <button className="modal-cancel-btn" onClick={() => setDeleteModal(null)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={() => dispatch(deleteProduct(deleteModal))} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default AdminProducts
