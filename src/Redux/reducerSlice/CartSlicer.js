import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  carts: [],
  getCartLoading: false,
  getCartError: '',

  //  addToCart
  addCartLoading: false,
  addToCartError: '',
  addCartStatus: '',
  //removeCard
  removeCardLoading: false,
  removeCardStatus: null,
};

export const fetchAddCarts = createAsyncThunk(
  'cart/addCart',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        'Products/addToCart',
        values.data,
        {
          headers: {
            SecurityCode: values.securityCode,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchCarts = createAsyncThunk(
  'cart/getCarts',
  async (values, {rejectWithValue}) => {
    try {
      const data = await axiosInstance.get(`Products/GetAddToCart`, {
        headers: {
          SecurityCode: values,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchRemoveCarts = createAsyncThunk(
  'cart/removeCart',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        'Products/RemoveAddToCart',
        values.data,
        {
          headers: {
            SecurityCode: values.securityCode,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const cartSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    resetCartData: () => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchCarts.fulfilled]: (state, action) => {
      state.getCartLoading = false;
      state.carts = action.payload.data;
      state.getCartError = '';
    },

    [fetchCarts.pending]: (state, action) => {
      state.getCartLoading = true;
      state.carts = [];
      state.getCartError = '';
    },

    [fetchCarts.rejected]: (state, action) => {
      state.getCartLoading = false;
      state.carts = null;
      state.getCartError = action.payload;
    },
    [fetchAddCarts.fulfilled]: (state, action) => {
      state.addCartLoading = false;
      state.addCartStatus = true;
      state.addToCartError = action.payload;
    },
    [fetchAddCarts.pending]: (state, action) => {
      state.addCartLoading = true;
      state.addCartStatus = false;
      state.addToCartError = action.payload;
    },
    [fetchAddCarts.rejected]: (state, action) => {
      state.addCartLoading = false;
      state.addCartStatus = false;
      state.addToCartError = action.payload;
    },
    [fetchRemoveCarts.fulfilled]: (state, action) => {
      state.removeCardStatus = action.payload;
      state.removeCardLoading = false;
    },
    [fetchRemoveCarts.pending]: (state, action) => {
      state.removeCardStatus = null;
      state.removeCardLoading = true;
    },
    [fetchRemoveCarts.rejected]: (state, action) => {
      state.removeCardStatus = action.payload;
      state.removeCardLoading = false;
    },
  },
});
export const {resetCartData} = cartSlice.actions;
export default cartSlice.reducer;
