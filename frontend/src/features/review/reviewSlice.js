import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= CREATE / UPDATE REVIEW =================
export const createReview = createAsyncThunk(
    "review/createReview",
    async (reviewData, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const { data } = await axios.put("/api/v1/review", reviewData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to submit review");
        }
    }
);

// ================= GET PRODUCT REVIEWS =================
export const getProductReviews = createAsyncThunk(
    "review/getProductReviews",
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/reviews?id=${productId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
        }
    }
);

// ================= ADMIN: DELETE REVIEW =================
export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async ({ reviewId, productId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/reviews?id=${reviewId}&productId=${productId}`);
            return { ...data, reviewId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete review");
        }
    }
);

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        success: false,
        message: null,
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; state.message = null; },
        clearReviews: (state) => { state.reviews = []; },
    },
    extraReducers: (builder) => {
        builder
            // CREATE REVIEW
            .addCase(createReview.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createReview.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.message = "Review submitted successfully!";
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET REVIEWS
            .addCase(getProductReviews.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE REVIEW
            .addCase(deleteReview.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Review deleted!";
                state.reviews = state.reviews.filter(r => r._id !== action.payload.reviewId);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { removeErrors, removeSuccess, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
