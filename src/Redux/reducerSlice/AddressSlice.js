import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import axiosInstance from '../../helper/axiosInstance';
import axios from 'axios';
import axiosInstance from '../../../config';

const initialState = {
  addAddLoading: false,
  addressStatus: null,
  address: [],
  getAddressLoading: false,
  getAddressError: null,
  // search state
  getState: null,
  getStateLoading: false,
  getStateError: null,
  //delete address

  deleteAddressLoading: false,
  deleteAddressError: null,
};
// https://api-tms.goldenbuzz.in/api/Otp/SentOtp?email=&number=1234567890

export const fetchAddAddress = createAsyncThunk(
  'address/addAddress',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(`User/AddAddress`, values.data, {
        headers: {
          SecurityCode: values.securityCode,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchAddress = createAsyncThunk(
  'address/getAddress',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(`User/GetAddress`, {
        headers: {
          SecurityCode: values,
        },
      });

      if (data?.isSuccess == true) {
        return data?.data;
      } else {
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const fetchAddressState = createAsyncThunk(
  'address/getAddressState',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `Home/SearchState?searchState=${values}`,
      );

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(`user/DeleteAddress?Id=${values}`);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const addressSlice = createSlice({
  name: 'addAddress',
  initialState,
  reducers: {
    resetAddress: (state, action) => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchAddAddress.fulfilled]: (state, action) => {
      state.addAddLoading = false;
      state.addressStatus = action.payload;
    },
    [fetchAddAddress.pending]: (state, action) => {
      state.addAddLoading = true;
      state.addressStatus = null;
    },
    [fetchAddAddress.rejected]: (state, action) => {
      state.addAddLoading = false;
      state.addressStatus = action.payload;
    },
    [fetchAddress.fulfilled]: (state, action) => {
      state.address = action.payload;
      state.getAddressLoading = false;
      state.getAddressError = null;
    },
    [fetchAddress.pending]: (state, action) => {
      state.address = null;
      state.getAddressLoading = true;
      state.getAddressError = action.payload;
    },
    [fetchAddress.rejected]: (state, action) => {
      state.address = null;
      state.getAddressLoading = false;
      state.getAddressError = action.payload;
    },

    [fetchAddressState.fulfilled]: (state, action) => {
      state.getState = action.payload;
      state.getStateLoading = false;
      state.getStateError = null;
    },
    [fetchAddressState.pending]: (state, action) => {
      state.getState = null;
      state.getStateLoading = true;
      state.getStateError = null;
    },
    [fetchAddressState.rejected]: (state, action) => {
      state.getState = null;
      state.getStateLoading = false;
      state.getStateError = action.payload;
    },

    [deleteAddress.fulfilled]: (state, action) => {
      state.deleteAddressLoading = false;
      state.deleteAddressError = action.payload;
    },
    [deleteAddress.pending]: (state, action) => {
      state.deleteAddressLoading = true;
      state.deleteAddressError = null;
    },
    [deleteAddress.rejected]: (state, action) => {
      state.deleteAddressLoading = false;
      state.deleteAddressError = action.payload;
    },
  },
});
export const {resetAddress} = addressSlice.actions;
export default addressSlice.reducer;
