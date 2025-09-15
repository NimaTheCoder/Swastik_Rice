import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  getProductsOne: [],
  //   cart: [],
  status: '',
  isError: '',
  isLoading: false,
};

export const fetchProductsOne = createAsyncThunk(
  'products/productsOne',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        'Products/GetProductByCollectionID?collectionID=3&pageNumber=1',
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

const productsOneSlice = createSlice({
  name: 'productsOne',
  initialState,
  extraReducers: {
    [fetchProductsOne.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.getProductsOne = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchProductsOne.pending]: (state, action) => {
      state.isLoading = true;
      state.getProductsOne = [];
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchProductsOne.rejected]: (state, action) => {
      state.isLoading = false;
      state.getProductsOne = null;
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
// export const {addToCart} = ProductSlice.actions;
export default productsOneSlice.reducer;
