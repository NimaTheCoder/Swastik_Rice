import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import axiosInstance from '../../helper/axiosInstance';
import axios from 'axios';
import axiosInstance from '../../../config';

const initialState = {
  contactLoading: false,
  contactLoadingStatus: null,
};
// https://api-tms.goldenbuzz.in/api/Otp/SentOtp?email=&number=1234567890

export const sentContact = createAsyncThunk(
  'home/ContactUs',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(`home/ContactUs`, values);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const sentContactSlice = createSlice({
  name: 'ContactUs',
  initialState,
  //   reducers: {
  //     resetAddress: (state, action) => {
  //       return initialState;
  //     },
  //   },
  extraReducers: {
    [sentContact.fulfilled]: (state, action) => {
      state.contactLoading = false;
      state.contactLoadingStatus = action.payload;
    },
    [sentContact.pending]: (state, action) => {
      state.contactLoading = true;
      state.contactLoadingStatus = null;
    },
    [sentContact.rejected]: (state, action) => {
      state.contactLoading = false;
      state.contactLoadingStatus = action.payload;
    },
  },
});
// export const {resetAddress} = addressSlice.actions;
export default sentContactSlice.reducer;
