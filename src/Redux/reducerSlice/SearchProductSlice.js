import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  searchProducts: [],
  //   cart: [],
  status: '',
  isError: '',
  isLoading: false,
};

export const fetchSearchProducts = createAsyncThunk(
  'products/searchProduct',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `Products/SearchFromProduct?Name=${values}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const searchProductSlice = createSlice({
  name: 'searchProduct',
  initialState,
  reducers: {
    resetSearchData: () => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchSearchProducts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.searchProducts = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchSearchProducts.pending]: (state, action) => {
      state.isLoading = true;
      state.searchProducts = [];
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchSearchProducts.rejected]: (state, action) => {
      state.isLoading = false;
      state.searchProducts = null;
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
export const {resetSearchData} = searchProductSlice.actions;
export default searchProductSlice.reducer;
