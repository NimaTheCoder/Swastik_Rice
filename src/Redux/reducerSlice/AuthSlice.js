import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import axiosInstance from '../../helper/axiosInstance';
import axios from 'axios';
import axiosInstance from '../../../config';

const initialState = {
  userInfo: null,
  isLoading: false,
  isError: '',
  status: '',
  isLogin: false,
  otpDetails: null,
  otpVerifyLoading: false,
  isVerifyToken: false,
};
// https://api-tms.goldenbuzz.in/api/Otp/SentOtp?email=&number=1234567890
export const fetchSendOtp = createAsyncThunk(
  'Otp/sendOtp',
  async (values, {rejectWithValue}) => {
    console.log(
      'Otp/SentOtp?email=${values.emai ',
      `Otp/SentOtp?email=${values.email}&number=${values.phone}&RefferalCode=${values.ref}`,
    );
    try {
      const {data} = await axiosInstance.get(
        `Otp/SentOtp?email=${values.email}&number=${values.phone}&RefferalCode=${values.ref}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchVerifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        `Account/ValidOTP`,
        values.newData,
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

export const verifyToken = createAsyncThunk(
  'user/verifyToken',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(`User/CheckSecurityCode`, {
        headers: {
          SecurityCode: values,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const AuthSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    addIsLogin: (state, action) => {
      state.isLogin = true;
    },
    logout: (state, action) => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchSendOtp.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.otpDetails = action.payload;
      state.status = 'Success';
      state.isError = '';
    },
    [fetchSendOtp.pending]: (state, action) => {
      state.isLoading = true;
      state.otpDetails = null;
      state.status = '';
      state.isError = '';
    },
    [fetchSendOtp.rejected]: (state, action) => {
      state.isLoading = false;
      state.otpDetails = null;
      state.status = '';
      state.isError = action.payload;
    },
    [fetchVerifyOtp.fulfilled]: (state, action) => {
      state.otpVerifyLoading = false;
      state.userInfo = action.payload;
      state.isValidOTPError = '';
    },
    [fetchVerifyOtp.pending]: (state, action) => {
      state.otpVerifyLoading = true;
      state.userInfo = null;
      state.isValidOTPError = '';
    },
    [fetchVerifyOtp.rejected]: (state, action) => {
      state.otpVerifyLoading = false;
      state.userInfo = null;
      state.isValidOTPError = action.payload;
    },
    [verifyToken.fulfilled]: (state, action) => {
      state.isVerifyToken = action.payload;
    },
    [verifyToken.pending]: (state, action) => {
      state.isVerifyToken = null;
    },
    [verifyToken.rejected]: (state, action) => {
      state.isVerifyToken = action.payload;
    },
  },
});
export const {addIsLogin, logout} = AuthSlice.actions;
export default AuthSlice.reducer;
