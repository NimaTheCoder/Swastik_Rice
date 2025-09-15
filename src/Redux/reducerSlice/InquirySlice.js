import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import axiosInstance from '../../helper/axiosInstance';
import axios from 'axios';
import axiosInstance from '../../../config';

const initialState = {
  inquiryLoading: false,
  inquiryLoadingStatus: null,
};
// https://api-tms.goldenbuzz.in/api/Otp/SentOtp?email=&number=1234567890

export const AddInquiry = createAsyncThunk(
  'inquiry/AddInquiry',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        `home/Addfranchise`,
        values.data,
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

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  //   reducers: {
  //     resetAddress: (state, action) => {
  //       return initialState;
  //     },
  //   },
  extraReducers: {
    [AddInquiry.fulfilled]: (state, action) => {
      state.inquiryLoading = false;
      state.inquiryLoadingStatus = action.payload;
    },
    [AddInquiry.pending]: (state, action) => {
      state.inquiryLoading = true;
      state.inquiryLoadingStatus = null;
    },
    [AddInquiry.rejected]: (state, action) => {
      state.inquiryLoading = false;
      state.inquiryLoadingStatus = action.payload;
    },
  },
});
// export const {resetAddress} = addressSlice.actions;
export default inquirySlice.reducer;
