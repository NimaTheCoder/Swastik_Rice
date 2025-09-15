import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  bannerImages: [],
  //   cart: [],
  status: '',
  isError: '',
  bannerImagesIsLoading: false,
};

export const fetchBannerImages = createAsyncThunk(
  'Home/bannerImg',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(`Home/GetBanners`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const BannerImagesSlice = createSlice({
  name: 'bannerImg',
  initialState,
  extraReducers: {
    [fetchBannerImages.fulfilled]: (state, action) => {
      state.bannerImagesIsLoading = false;
      state.bannerImages = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchBannerImages.pending]: (state, action) => {
      state.bannerImagesIsLoading = true;
      state.bannerImages = [];
      state.status = 'pending'; // Corrected typo 'pading' to 'pending'
      state.isError = '';
    },
    [fetchBannerImages.rejected]: (state, action) => {
      state.bannerImagesIsLoading = false;
      state.bannerImages = [];
      state.status = 'error';
      state.isError = action.payload;
    },
  },
});
// export const {addToCart} = ProductSlice.actions;
export default BannerImagesSlice.reducer;
