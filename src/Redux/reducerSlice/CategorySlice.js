import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';
const initialState = {
  category: [],
  //   cart: [],

  status: '',
  isError: '',
  isLoading: false,
  //  categoryByProduct: [],
  categoryByProduct: [],
  categoryByProductIsLoading: false,
  categoryByProductsError: '',
};

export const fetchCategory = createAsyncThunk(
  'Category/fetchCategory',
  async (values, {rejectWithValue}) => {
    console.log('values', values);
    try {
      const {data} = await axiosInstance.get(
        `Category/GetCategorys?pageNumber=${values}&pageSize=10`,
      );
      console.log('data', data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const fetchCategoryByProduct = createAsyncThunk(
  'Category/fetchCategoryByProduct',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `Home/GetSearchByCategory?categoryid=${values.data}`,
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

const CategorySlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetCategory: (state, action) => {
      state.categoryByProduct = null;
    },
  },
  extraReducers: {
    [fetchCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchCategory.pending]: (state, action) => {
      state.isLoading = true;
      state.category = null;
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchCategory.rejected]: (state, action) => {
      state.isLoading = false;
      state.category = null;
      state.status = 'error';
      state.isError = action.payload;
    },
    [fetchCategoryByProduct.fulfilled]: (state, action) => {
      state.categoryByProductIsLoading = false;
      state.categoryByProduct = action.payload;
      state.status = 'Success';
      state.categoryByProductsError = '';
    },
    [fetchCategoryByProduct.pending]: (state, action) => {
      state.categoryByProductIsLoading = true;
      state.categoryByProduct = null;
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.categoryByProductsError = '';
    },
    [fetchCategoryByProduct.rejected]: (state, action) => {
      state.categoryByProductIsLoading = false;
      state.categoryByProduct = null;
      state.status = 'error';
      state.categoryByProductsError = action.payload;
    },
  },
});
export const {resetCategory} = CategorySlice.actions;
export default CategorySlice.reducer;
