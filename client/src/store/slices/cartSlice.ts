import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios.config";

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  description?: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  price: string;
  product: CartProduct;
}

export interface CartSummary {
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;
  actionLoading: Record<number, boolean>;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  summary: null,
  loading: false,
  actionLoading: {},
  error: null,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await axiosInstance.get("/cart");
  return response.data.data as { items: CartItem[]; summary: CartSummary };
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity = 1 }: { productId: number; quantity?: number },
    { dispatch }
  ) => {
    await axiosInstance.post("/cart/add", { productId, quantity });
    dispatch(fetchCart());
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { itemId, quantity }: { itemId: number; quantity: number },
    { dispatch }
  ) => {
    await axiosInstance.put(`/cart/${itemId}`, { quantity });
    dispatch(fetchCart());
    return itemId;
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId: number, { dispatch }) => {
    await axiosInstance.delete(`/cart/${itemId}`);
    dispatch(fetchCart());
    return itemId;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      });

    builder
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add item to cart";
      });

    builder
      .addCase(updateQuantity.pending, (state, action) => {
        state.actionLoading[action.meta.arg.itemId] = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        delete state.actionLoading[action.payload];
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        delete state.actionLoading[action.meta.arg.itemId];
        state.error = action.error.message || "Failed to update quantity";
      });

    builder
      .addCase(removeItem.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        delete state.actionLoading[action.payload];
      })
      .addCase(removeItem.rejected, (state, action) => {
        delete state.actionLoading[action.meta.arg];
        state.error = action.error.message || "Failed to remove item";
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;