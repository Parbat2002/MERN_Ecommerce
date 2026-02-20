import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ================= REGISTER =================
export const register = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/v1/register', userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration Failed!');
        }
    }
);

// ================= LOGIN =================
export const login = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/v1/login', { email, password }, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login Failed!');
        }
    }
);

// ================= LOAD USER =================
export const loadUser = createAsyncThunk(
    'user/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/profile');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Loading User Profile Failed!');
        }
    }
);

// ================= LOGOUT =================
export const logout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/v1/logout', {}, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error Logging Out!');
        }
    }
);

// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.put('/api/v1/profile/update', userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Profile update failed! Please try again later');
        }
    }
);

// ================= UPDATE PASSWORD =================
export const updatePassword = createAsyncThunk(
    'user/updatePassword',
    async (formData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.put('/api/v1/password/update', formData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password update failed! Please try again later');
        }
    }
);

// ================= FORGOT PASSWORD =================
// Receives { email } object — sends as JSON
export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async ( email , { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/v1/password/forgot',  email , config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Sending Email failed! Please try again later');
        }
    }
);

// ================= RESET PASSWORD =================
export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async ({ token, userData }, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(`/api/v1/password/reset/${token}`, userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Reset Password failed');
        }
    }
);
// ================= SLICE =================
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
        message: null,
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; state.message = null; },
    },
    extraReducers: (builder) => {
        builder

            // REGISTER
            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                localStorage.setItem('user', JSON.stringify(state.user));
                localStorage.setItem('isAuthenticated', String(state.isAuthenticated));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            })

            // LOGIN
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                localStorage.setItem('user', JSON.stringify(state.user));
                localStorage.setItem('isAuthenticated', String(state.isAuthenticated));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            })

            // LOAD USER
            .addCase(loadUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                localStorage.setItem('user', JSON.stringify(state.user));
                localStorage.setItem('isAuthenticated', String(state.isAuthenticated));
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = null;   // silently fail on page load (no cookie = not authenticated)
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            })

            // LOGOUT
            .addCase(logout.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE PROFILE
            .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || state.user;
                state.success = action.payload?.success;
                state.message = action.payload?.message;
                // Update localStorage with fresh avatar url
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE PASSWORD
            .addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FORGOT PASSWORD
            .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
                state.message = action.payload?.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // RESET PASSWORD
            .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
