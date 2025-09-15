import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  viewAllProducts: [],
  status: '',
  isError: '',
  isLoading: false,
};

export const fetchViewAllProducts = createAsyncThunk(
  'products/viewAllProducts',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `Products/GetProductByCollectionID?collectionID=${values.id}&pageNumber=${values.page}`,
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

const viewAllProductsSlice = createSlice({
  name: 'viewAllProducts',
  initialState,
  reducers: {
    resetAllData: () => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchViewAllProducts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.viewAllProducts = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchViewAllProducts.pending]: (state, action) => {
      state.isLoading = true;
      state.viewAllProducts = [];
      state.status = 'pending';
      state.isError = '';
    },
    [fetchViewAllProducts.rejected]: (state, action) => {
      state.isLoading = false;
      state.viewAllProducts = null;
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
export const {resetAllData} = viewAllProductsSlice.actions;
export default viewAllProductsSlice.reducer;
