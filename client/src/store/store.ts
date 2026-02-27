import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import userReducer from "./slices/userSlice"

const store = configureStore({
    reducer:{
        user : userReducer,
        products : productReducer,
        cart : cartReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store