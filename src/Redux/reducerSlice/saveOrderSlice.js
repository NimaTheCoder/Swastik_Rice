import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  updateSaveOrderLoading: false,
  updateSaveOrderStatus: null,
  // fetchCoupon
  fetchCouponLoading: false,
  fetchCouponStatus: null,
};

export const updateSaveOrder = createAsyncThunk(
  'order/SaveOrder',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        `order/saveorder`,
        values.newValues,
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
export const fetchCoupon = createAsyncThunk(
  'order/fetchCoupon',
  async (values, {rejectWithValue}) => {
    console.log('values', values);
    try {
      const {data} = await axiosInstance.post(
        `Home/Coupancheck?cpncode=${values.co}&subtotal=${values.price}`,
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

const saveOrderSlice = createSlice({
  name: 'order',
  initialState,
  extraReducers: {
    [updateSaveOrder.fulfilled]: (state, {payload}) => {
      state.updateSaveOrderLoading = false;
      state.updateSaveOrderStatus = payload;
    },
    [updateSaveOrder.pending]: (state, {payload}) => {
      state.updateSaveOrderLoading = true;
      state.updateSaveOrderStatus = null;
    },
    [updateSaveOrder.rejected]: (state, {payload}) => {
      state.updateSaveOrderLoading = false;
      state.updateSaveOrderStatus = payload;
    },
    [fetchCoupon.fulfilled]: (state, {payload}) => {
      state.fetchCouponLoading = false;
      state.fetchCouponStatus = payload;
    },
    [fetchCoupon.pending]: (state, {payload}) => {
      state.fetchCouponLoading = true;
      state.fetchCouponStatus = null;
    },
    [fetchCoupon.rejected]: (state, {payload}) => {
      state.fetchCouponLoading = false;
      state.fetchCouponStatus = payload;
    },
  },
});

export default saveOrderSlice.reducer;
