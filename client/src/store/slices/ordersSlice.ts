import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios.config";

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    image: string;
    price: string;
  };
}

export interface Order {
  id: number;
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  total?: string;
  estimatedDelivery?: string;
  items: OrderItem[];
  address?: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

interface OrderState {
  items: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  placing: boolean;
  error: string | null;
}

export const createOrder = createAsyncThunk(
  "orders/create",
  async (addressId: number) => {
    const response = await axiosInstance.post("/orders", { addressId });
    return response.data.data;
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async () => {
    const response = await axiosInstance.get("/orders");
    return response.data.data.orders as Order[];
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId: number) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data.data as Order;
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (orderId: number) => {
    await axiosInstance.put(`/orders/${orderId}/cancel`);
    return orderId;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    selectedOrder: null,
    loading: false,
    placing: false,
    error: null,
  } as OrderState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.placing = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.placing = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.placing = false;
        state.error = action.error.message || "Failed to place order";
      });

    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      });

    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch order";
      });

    builder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.items.find((o) => o.id === action.payload);
        if (order) order.status = "CANCELLED";
        if (state.selectedOrder?.id === action.payload) {
          state.selectedOrder.status = "CANCELLED";
        }
      });
  },
});

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;