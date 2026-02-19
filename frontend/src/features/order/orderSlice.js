import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ================= MY ORDERS =================
export const getMyOrders = createAsyncThunk(
    'order/getMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/orders/user');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// ================= SINGLE ORDER (user's own order) =================
export const getSingleOrder = createAsyncThunk(
    'order/getSingleOrder',
    async (id, { rejectWithValue }) => {
        try {
            // Uses the user-level route — backend verifies ownership
            const { data } = await axios.get(`/api/v1/order/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

// ================= ADMIN: ALL ORDERS =================
export const getAllOrders = createAsyncThunk(
    'order/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/admin/orders');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch all orders');
        }
    }
);

// ================= ADMIN: UPDATE ORDER STATUS =================
export const updateOrderStatus = createAsyncThunk(
    'order/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/order/${id}`, { status });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order');
        }
    }
);

// ================= ADMIN: DELETE ORDER =================
export const deleteOrder = createAsyncThunk(
    'order/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
            return { ...data, id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete order');
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        order: null,
        loading: false,
        error: null,
        success: false,
        message: null,
        totalAmount: 0,
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; state.message = null; },
    },
    extraReducers: (builder) => {
        // MY ORDERS
        builder
            .addCase(getMyOrders.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // SINGLE ORDER
        builder
            .addCase(getSingleOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getSingleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(getSingleOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // ALL ORDERS (admin)
        builder
            .addCase(getAllOrders.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // UPDATE ORDER STATUS
        builder
            .addCase(updateOrderStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Order status updated!';
                const idx = state.orders.findIndex(o => o._id === action.payload.order._id);
                if (idx !== -1) state.orders[idx] = action.payload.order;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // DELETE ORDER
        builder
            .addCase(deleteOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Order deleted!';
                state.orders = state.orders.filter(o => o._id !== action.payload.id);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
