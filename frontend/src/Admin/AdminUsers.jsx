import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Delete } from '@mui/icons-material'
import { toast } from 'react-toastify'
import AdminLayout from './AdminLayout'
import Loader from '../components/Loader'
import { getAllUsers, updateUserRole, deleteUser, removeErrors, removeSuccess } from '../features/admin/adminSlice'
import '../adminStyles/AdminStyles.css'

const ROWS_PER_PAGE = 8

function AdminUsers() {
    const dispatch = useDispatch()
    const { users, loading, error, success, message } = useSelector(state => state.admin)

    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')
    const [page, setPage] = useState(1)
    const [editModal, setEditModal] = useState(null)
    const [deleteModal, setDeleteModal] = useState(null)
    const [newRole, setNewRole] = useState('user')

    useEffect(() => { dispatch(getAllUsers()) }, [dispatch])

    useEffect(() => {
        if (error) { toast.error(error, { position: 'top-center', autoClose: 3000 }); dispatch(removeErrors()) }
        if (success) { toast.success(message, { position: 'top-center', autoClose: 2500 }); dispatch(removeSuccess()); setEditModal(null); setDeleteModal(null) }
    }, [error, success, message, dispatch])

    const filtered = users
        .filter(u => roleFilter === 'All' || u.role === roleFilter)
        .filter(u =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        )

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE)
    const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

    const handleUpdateRole = () => {
        dispatch(updateUserRole({ id: editModal._id, role: newRole }))
    }

    const handleDelete = () => dispatch(deleteUser(deleteModal))

    if (loading && users.length === 0) return <AdminLayout><Loader /></AdminLayout>

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Users</h1>
                    <p className="admin-page-subtitle">{users.length} registered users</p>
                </div>
            </div>

            {/* Role filters */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {['All', 'admin', 'user'].map(r => (
                    <button key={r} onClick={() => { setRoleFilter(r); setPage(1) }}
                        style={{ padding: '0.4rem 1rem', border: '1.5px solid #e0e0e0', background: roleFilter === r ? '#0d0d0d' : 'white', color: roleFilter === r ? 'white' : '#555', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.18s', textTransform: 'capitalize' }}
                    >{r}</button>
                ))}
            </div>

            <div className="admin-table-wrap">
                <div className="admin-table-toolbar">
                    <input
                        className="admin-search-input"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{filtered.length} results</span>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 && (
                            <tr><td colSpan={5} className="no-data">No users found</td></tr>
                        )}
                        {paginated.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <img
                                            src={user.avatar?.url || '/images/profile.png'}
                                            alt={user.name}
                                            className="user-avatar-small"
                                        />
                                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                                    </div>
                                </td>
                                <td style={{ color: '#888' }}>{user.email}</td>
                                <td>
                                    <span className={`status-badge ${user.role === 'admin' ? 'status-admin' : 'status-user'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => { setEditModal(user); setNewRole(user.role) }}>
                                            <Edit fontSize="small" /> Role
                                        </button>
                                        <button className="delete-btn" onClick={() => setDeleteModal(user._id)}>
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

            {/* Edit Role Modal */}
            {editModal && (
                <div className="modal-overlay" onClick={() => setEditModal(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Update User Role</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '0.85rem', background: '#fafafa', borderRadius: '10px' }}>
                            <img src={editModal.avatar?.url || '/images/profile.png'} className="user-avatar-small" style={{ width: 44, height: 44 }} alt="" />
                            <div>
                                <div style={{ fontWeight: 600 }}>{editModal.name}</div>
                                <div style={{ fontSize: '0.82rem', color: '#888' }}>{editModal.email}</div>
                            </div>
                        </div>
                        <div className="modal-form-group">
                            <label>Role</label>
                            <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="modal-btns">
                            <button className="modal-cancel-btn" onClick={() => setEditModal(null)}>Cancel</button>
                            <button className="modal-submit-btn" onClick={handleUpdateRole} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal-box confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">⚠️</div>
                        <h3>Delete User?</h3>
                        <p>This will permanently remove the user and all their data.</p>
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

export default AdminUsers
