import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  otherProducts: [],
  status: '',
  isError: '',
  otherProductsIsLoading: false,
};

export const fetchOtherProducts = createAsyncThunk(
  'products/OtherProducts',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `Products/GetRelatedProducts?pid=${values.pid}&CatID=${values.CatID}&pageSize=10&pageNumber=${values.pageNumber}`,
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

const OtherProductsSlice = createSlice({
  name: 'OtherProducts',
  initialState,
  reducers: {
    removeOtherProducts: () => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchOtherProducts.fulfilled]: (state, action) => {
      state.otherProductsIsLoading = false;
      state.otherProducts = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchOtherProducts.pending]: (state, action) => {
      state.otherProductsIsLoading = true;
      state.otherProducts = [];
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchOtherProducts.rejected]: (state, action) => {
      state.otherProductsIsLoading = false;
      state.otherProducts = null;
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
export const {removeOtherProducts} = OtherProductsSlice.actions;
export default OtherProductsSlice.reducer;
