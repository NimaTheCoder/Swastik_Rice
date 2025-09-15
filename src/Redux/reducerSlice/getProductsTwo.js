import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  getProductsTwo: [],
  //   cart: [],
  status: '',
  isError: '',
  isLoadingTwo: false,
};

export const fetchProductsTwo = createAsyncThunk(
  'products/productsTwo',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        'Products/GetProductByCollectionID?collectionID=4&pageNumber=1',
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

const productsTwoSlice = createSlice({
  name: 'productsTwo',
  initialState,
  extraReducers: {
    [fetchProductsTwo.fulfilled]: (state, action) => {
      state.isLoadingTwo = false;
      state.getProductsTwo = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchProductsTwo.pending]: (state, action) => {
      state.isLoadingTwo = true;
      state.getProductsTwo = [];
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchProductsTwo.rejected]: (state, action) => {
      state.isLoadingTwo = false;
      state.getProductsTwo = null;
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
// export const {addToCart} = ProductSlice.actions;
export default productsTwoSlice.reducer;
