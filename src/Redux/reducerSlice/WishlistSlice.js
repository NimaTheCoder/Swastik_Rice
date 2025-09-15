import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  wishlist: [],
  getWishlistLoading: false,
  getWishlistError: '',

  //  addToCart
  addWishlistLoading: false,
  addToWishlistError: '',
  addWishlistStatus: '',

  //removeCard
  removeWishlistLoading: false,
  removeWishlistStatus: null,
};

export const fetchAddWishlist = createAsyncThunk(
  'cart/addWishlist',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        'Products/AddWishlist',
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

export const fetchWishlist = createAsyncThunk(
  'wishlist/GetWishlist',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get('Products/GetWishlist', {
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

export const fetchRemoveWishlist = createAsyncThunk(
  'wishlist/RemoveWishlist',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        'Products/RemoveWishlist',
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

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlistData: () => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchAddWishlist.fulfilled]: (state, action) => {
      state.addWishlistLoading = false;
      state.addWishlistStatus = true;
      state.addToWishlistError = action.payload;
    },
    [fetchAddWishlist.pending]: (state, action) => {
      state.addWishlistLoading = true;
      state.addWishlistStatus = false;
      state.addToWishlistError = action.payload;
    },
    [fetchAddWishlist.rejected]: (state, action) => {
      state.addWishlistLoading = false;
      state.addWishlistStatus = false;
      state.addToWishlistError = action.payload;
    },
    [fetchWishlist.fulfilled]: (state, action) => {
      state.getWishlistLoading = false;
      state.wishlist = action.payload.data;
      state.getWishlistError = '';
    },
    [fetchWishlist.pending]: (state, action) => {
      state.getWishlistLoading = true;
      state.wishlist = [];
      state.getWishlistError = '';
    },
    [fetchWishlist.rejected]: (state, action) => {
      state.getWishlistLoading = false;
      state.wishlist = null;
      state.getWishlistError = action.payload;
    },

    [fetchRemoveWishlist.fulfilled]: (state, action) => {
      state.removeWishlistStatus = action.payload;
      state.removeWishlistLoading = false;
    },
    [fetchRemoveWishlist.pending]: (state, action) => {
      state.removeWishlistStatus = null;
      state.removeWishlistLoading = true;
    },
    [fetchRemoveWishlist.rejected]: (state, action) => {
      state.removeWishlistStatus = action.payload;
      state.removeWishlistLoading = false;
    },
  },
});
export const {resetWishlistData} = wishlistSlice.actions;
export default wishlistSlice.reducer;
