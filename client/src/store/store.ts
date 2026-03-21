import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import userReducer from "./slices/userSlice"
import addressReducer from "./slices/addressSlice"
import orderReducer from  "./slices/orderSlice"

const store = configureStore({
    reducer:{
        user : userReducer,
        products : productReducer,
        cart : cartReducer,
        address:addressReducer,
        orders:orderReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store