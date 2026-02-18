import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= ADMIN: ALL USERS =================
export const getAllUsers = createAsyncThunk(
    "admin/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/admin/users");
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
        }
    }
);

// ================= ADMIN: UPDATE USER ROLE =================
export const updateUserRole = createAsyncThunk(
    "admin/updateUserRole",
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/user/${id}`, { role });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update user role");
        }
    }
);

// ================= ADMIN: DELETE USER =================
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
            return { ...data, id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete user");
        }
    }
);

// ================= ADMIN: CREATE PRODUCT =================
export const createProduct = createAsyncThunk(
    "admin/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/v1/admin/product/create", productData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create product");
        }
    }
);

// ================= ADMIN: UPDATE PRODUCT =================
export const updateProduct = createAsyncThunk(
    "admin/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/product/${id}`, productData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update product");
        }
    }
);

// ================= ADMIN: DELETE PRODUCT =================
export const deleteProduct = createAsyncThunk(
    "admin/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/product/${id}`);
            return { ...data, id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete product");
        }
    }
);

// ================= ADMIN: GET ALL PRODUCTS =================
export const getAdminProducts = createAsyncThunk(
    "admin/getAdminProducts",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/admin/products");
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        products: [],
        loading: false,
        error: null,
        success: false,
        message: null,
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; state.message = null; },
    },
    extraReducers: (builder) => {
        const pending = (state) => { state.loading = true; state.error = null; };
        const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

        builder
            .addCase(getAllUsers.pending, pending)
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(getAllUsers.rejected, rejected)

            .addCase(updateUserRole.pending, pending)
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "User role updated!";
                const idx = state.users.findIndex(u => u._id === action.payload.user._id);
                if (idx !== -1) state.users[idx] = action.payload.user;
            })
            .addCase(updateUserRole.rejected, rejected)

            .addCase(deleteUser.pending, pending)
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "User deleted!";
                state.users = state.users.filter(u => u._id !== action.payload.id);
            })
            .addCase(deleteUser.rejected, rejected)

            .addCase(getAdminProducts.pending, pending)
            .addCase(getAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(getAdminProducts.rejected, rejected)

            .addCase(createProduct.pending, pending)
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Product created!";
                state.products.push(action.payload.product);
            })
            .addCase(createProduct.rejected, rejected)

            .addCase(updateProduct.pending, pending)
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Product updated!";
                const idx = state.products.findIndex(p => p._id === action.payload.product._id);
                if (idx !== -1) state.products[idx] = action.payload.product;
            })
            .addCase(updateProduct.rejected, rejected)

            .addCase(deleteProduct.pending, pending)
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Product deleted!";
                state.products = state.products.filter(p => p._id !== action.payload.id);
            })
            .addCase(deleteProduct.rejected, rejected)
    }
});

export const { removeErrors, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;
