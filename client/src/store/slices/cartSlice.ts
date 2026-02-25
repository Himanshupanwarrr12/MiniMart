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

function calcSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + tax + shipping;
  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await axiosInstance.get("/cart");
  return res.data.data as { items: CartItem[]; summary: CartSummary };
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
    const res = await axiosInstance.post("/cart/add", { productId, quantity });
    return res.data.data as CartItem;
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
    await axiosInstance.put(`/cart/${itemId}`, { quantity });
    return { itemId, quantity };
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId: number) => {
    await axiosInstance.delete(`/cart/${itemId}`);
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
        state.error = action.error.message ?? "Failed to fetch cart";
      });

    builder
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const exists = state.items.find((i) => i.id === action.payload.id);
        if (exists) {
          exists.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.summary = calcSummary(state.items);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to add item";
      });

    builder
      .addCase(updateQuantity.pending, (state, action) => {
        state.actionLoading[action.meta.arg.itemId] = true;
        const item = state.items.find((i) => i.id === action.meta.arg.itemId);
        if (item) item.quantity = action.meta.arg.quantity;
        state.summary = calcSummary(state.items);
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        delete state.actionLoading[action.payload.itemId];
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        delete state.actionLoading[action.meta.arg.itemId];
        state.error = action.error.message ?? "Failed to update quantity";
      });

    builder
      .addCase(removeItem.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
        state.items = state.items.filter((i) => i.id !== action.meta.arg);
        state.summary = calcSummary(state.items);
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        delete state.actionLoading[action.payload];
      })
      .addCase(removeItem.rejected, (state, action) => {
        delete state.actionLoading[action.meta.arg];
        state.error = action.error.message ?? "Failed to remove item";
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;