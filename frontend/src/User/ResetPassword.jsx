import React, { useEffect, useState } from 'react'
import '../userStyles/UserStyles.css'
import PageTitle from '../components/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice';
import { toast } from 'react-toastify'


function ResetPassword() {
    const { success, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        const data = { password, confirmPassword };
        dispatch(resetPassword({ token, userData: data }));
    }
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeErrors());
        } 
        if (success) {
            toast.success("Password Reset Successfully!",{ position: 'top-center', autoClose: 3000 });
            navigate('/login');
            dispatch(removeSuccess());
        }
    }, [dispatch, error, success, navigate]);
    return (
        <>
            <PageTitle title="Reset Password" />
            <div className="container form-container">
                <div className="form-content">
                    <form className="form" onSubmit={resetPasswordSubmit}>
                        <h2>Reset Password</h2>

                        <div className="input-group">
                            <input type="password" name='password' placeholder='Enter your new password..' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type="password" name='confirmPassword' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <button className="authBtn">Reset Password</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
