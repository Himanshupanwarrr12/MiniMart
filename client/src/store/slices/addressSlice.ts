import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios.config";

export interface Address {
  id: number;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  addressType?: string;
  isDefault: boolean;
}

interface AddressState {
  items: Address[];
  loading: boolean;
  error: string | null;
}

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAll",
  async () => {
    const response = await axiosInstance.get("/addresses");
    return response.data.data as Address[];
  }
);

export const createAddress = createAsyncThunk(
  "addresses/create",
  async (data: Omit<Address, "id" | "isDefault">) => {
    const response = await axiosInstance.post("/addresses", data);
    return response.data.data as Address;
  }
);

export const setDefaultAddress = createAsyncThunk(
  "addresses/setDefault",
  async (addressId: number) => {
    await axiosInstance.put(`/addresses/${addressId}/default`);
    return addressId;
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/delete",
  async (addressId: number) => {
    await axiosInstance.delete(`/addresses/${addressId}`);
    return addressId;
  }
);

const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    items: [],
    loading: false,
    error: null,
  } as AddressState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch addresses";
      });

    builder
      .addCase(createAddress.pending, (state) => {
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create address";
      });

    builder
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.items = state.items.map((a) => ({
          ...a,
          isDefault: a.id === action.payload,
        }));
      });

    builder
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;