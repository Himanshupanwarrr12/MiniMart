import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios.config";

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
  stockQuantity?: number;  
  inStock?: boolean;       
  stockStatus?: string; 
}

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;  
  loading: boolean;
  error: string | null;
}


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axiosInstance.get("/products");
    return response.data.data.products;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: number) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data.data.product
  }
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
  } as ProductState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });

    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;