import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  getAllOrders: [],
  allOrderLoading: null,
  // addReviewLoading
  addReviewLoading: false,
  //getReview
  getReviewLoading: false,
  getProductBR: null,
  // /fetchOrdersDetails
  orderDetailsLoading: false,
  orderDetails: null,
};

export const fetchOrders = createAsyncThunk(
  'orderDetails/fetchOrder',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `order/GetMyOrders?PageNumber=1&PageSize=10`,
        {
          headers: {
            SecurityCode: values,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchOrdersDetails = createAsyncThunk(
  'orderDetails/fetchOrdersDetails',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `order/GetMyOrdersDetails?OderId=${values}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getReviews = createAsyncThunk(
  'orderDetails/getReviews',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `Products/GetProductsReview?id=${values.id}&pageSize=${values.pageSize}&pageNumber=${values.pageNumber}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const submitReview = createAsyncThunk(
  'order/submitReviews',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        `Products/addProductRatingReview`,
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

const orderAndReviewSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    cleanReviews: () => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchOrders.fulfilled]: (state, {payload}) => {
      state.getAllOrders = payload;
      state.allOrderLoading = false;
    },
    [fetchOrders.pending]: (state, {payload}) => {
      state.getAllOrders = [];
      state.allOrderLoading = true;
    },
    [fetchOrders.rejected]: (state, {payload}) => {
      state.getAllOrders = null;
      state.allOrderLoading = false;
    },
    [submitReview.fulfilled]: (state, {payload}) => {
      state.addReviewLoading = false;
    },
    [submitReview.pending]: (state, {payload}) => {
      state.addReviewLoading = true;
    },
    [submitReview.rejected]: (state, {payload}) => {
      state.addReviewLoading = false;
    },
    [getReviews.fulfilled]: (state, {payload}) => {
      state.getReviewLoading = false;
      state.getProductBR = payload;
    },
    [getReviews.pending]: (state, {payload}) => {
      state.getReviewLoading = true;
      state.getProductBR = null;
    },
    [getReviews.rejected]: (state, {payload}) => {
      state.getReviewLoading = false;
      state.getProductBR = null;
    },
    /////
    [fetchOrdersDetails.fulfilled]: (state, {payload}) => {
      state.orderDetailsLoading = false;
      state.orderDetails = payload;
    },
    [fetchOrdersDetails.pending]: (state, {payload}) => {
      state.orderDetailsLoading = true;
      state.orderDetails = null;
    },
    [fetchOrdersDetails.rejected]: (state, {payload}) => {
      state.orderDetailsLoading = false;
      state.orderDetails = null;
    },
  },
});
export const {cleanReviews} = orderAndReviewSlice.actions;
export default orderAndReviewSlice.reducer;
