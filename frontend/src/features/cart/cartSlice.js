import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= ADD ITEMS TO CART =================
export const addItemsToCart = createAsyncThunk(
    "cart/addItemsToCart",
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/product/${id}`);
            return {
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.image[0].url,
                stock: data.product.stock,
                quantity,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
        loading: false,
        error: null,
        success: false,
        message: null,
        shippingInfo:JSON.parse(localStorage.getItem("shippingInfo"))||{},
    },
    reducers: {
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter((i) => i.product !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeErrors: (state) => {
            state.error = null;
        },
        removeMessage: (state) => {
            state.message = null;
            state.success = false;
        },
        saveShippingInfo:(state,action)=>{
            state.shippingInfo=action.payload
            localStorage.setItem('shippingInfo',JSON.stringify(state.shippingInfo))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addItemsToCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addItemsToCart.fulfilled, (state, action) => {
            const item = action.payload;
            const existingItem = state.cartItems.find((i) => i.product === item.product);

            if (existingItem) {
                existingItem.quantity = item.quantity;
            } else {
                state.cartItems.push(item);
            }
            state.loading = false;
            state.success = true;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
             state.message = `${item.name}, Added to cart!`
        });
        builder.addCase(addItemsToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { removeErrors, removeMessage, removeCartItem,saveShippingInfo} = cartSlice.actions;
export default cartSlice.reducer;