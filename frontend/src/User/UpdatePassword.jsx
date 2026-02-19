import React, { useEffect, useState } from 'react'
import '../userStyles/UserStyles.css'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeErrors, removeSuccess, updatePassword } from '../features/user/userSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

function UpdatePassword() {
    const { success, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        // thunk uses application/json — send plain object
        dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
    }

    useEffect(() => {
        if (error) {
            toast.dismiss();
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            toast.dismiss();
            toast.success('Password Updated Successfully!', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            navigate('/profile');
        }
    }, [dispatch, success, navigate])

    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <Navbar />
                    <PageTitle title="Password Update" />
                    <div className="container update-container">
                        <div className="form-content">
                            <form className="form" onSubmit={updatePasswordSubmit}>
                                <h2>Update Password</h2>
                                <div className="input-group">
                                    <input type="password" name='oldPassword' placeholder='Old Password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <input type="password" name='newPassword' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <input type="password" name='confirmPassword' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                                <button className="authBtn">Update Password</button>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    )
}

export default UpdatePassword
