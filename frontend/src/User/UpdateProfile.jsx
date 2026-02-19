import React, { useEffect, useState } from 'react'
import '../userStyles/UserStyles.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeErrors, removeSuccess, updateProfile } from '../features/user/userSlice'
import Loader from '../components/Loader'

function UpdateProfile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('./images/profile.png');

    const { user, error, success, message, loading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profileImageUpdate = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result); // base64 DataURL — backend uploads to Cloudinary
            }
        }
        reader.onerror = () => { toast.error('Error Reading File!') }
        reader.readAsDataURL(e.target.files[0]);
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('email', email);
        if (avatar) myForm.set('avatar', avatar);  // only set if new image chosen
        dispatch(updateProfile(myForm));
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
            toast.success(message || 'Profile updated!', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            navigate('/profile');
        }
    }, [dispatch, success, message, navigate])

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            // Show Cloudinary avatar if exists, otherwise fallback
            setAvatarPreview(user.avatar?.url || './images/profile.png');
        }
    }, [user])

    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <Navbar />
                    <div className="container update-container">
                        <div className="form-content">
                            <form className="form" encType='multipart/form-data' onSubmit={updateSubmit}>
                                <h2>Update Profile</h2>
                                <div className="input-group avatar-group">
                                    {/* Fixed: accept="image/*" */}
                                    <input type="file" accept='image/*' className="file-input" name='avatar' onChange={profileImageUpdate} />
                                    <img src={avatarPreview} alt="User Profile" className="avatar" />
                                </div>
                                <div className="input-group">
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} name='name' placeholder='Name' />
                                </div>
                                <div className="input-group">
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name='email' placeholder='Email' />
                                </div>
                                <button className="authBtn">Update</button>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    )
}

export default UpdateProfile
