import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  productsDetails: [],
  //   cart: [],
  status: '',
  isError: '',
  productsDeIsLoading: false,
};

export const fetchProductsDetails = createAsyncThunk(
  'products/byDetails',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `Products/GetProductDetails?Id=${values.id}`,
        {
          headers: {
            SecurityCode: values.securityCode,
          },
        },
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const ProductDetailsSlice = createSlice({
  name: 'byDetails',
  initialState,
  extraReducers: {
    [fetchProductsDetails.fulfilled]: (state, action) => {
      state.productsDeIsLoading = false;
      state.productsDetails = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchProductsDetails.pending]: (state, action) => {
      state.productsDeIsLoading = true;
      state.productsDetails = null;
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchProductsDetails.rejected]: (state, action) => {
      state.productsDeIsLoading = false;
      state.productsDetails = null;
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
// export const {addToCart} = ProductSlice.actions;
export default ProductDetailsSlice.reducer;
