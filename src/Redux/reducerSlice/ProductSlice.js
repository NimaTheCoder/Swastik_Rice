import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  products: [],
  //   cart: [],
  status: '',
  isError: '',
  isLoading: false,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get('Products/GetAllProducts');

      return data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const ProductSlice = createSlice({
  name: 'products',
  initialState,

  extraReducers: {
    [fetchProducts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchProducts.pending]: (state, action) => {
      state.isLoading = true;
      state.products = [];
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchProducts.rejected]: (state, action) => {
      state.isLoading = false;
      state.products = null;
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
// export const {addToCart} = ProductSlice.actions;
export default ProductSlice.reducer;
