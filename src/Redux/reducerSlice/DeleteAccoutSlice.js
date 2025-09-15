import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  deleteStatus: null,
  deleteAccountLoading: false,
};

export const fetchDeleteAccount = createAsyncThunk(
  'home/deleteAccount',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(`User/DeleteProfile`, {
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

const deleteAccountSlice = createSlice({
  name: 'deleteAccount',
  initialState,
  extraReducers: {
    [fetchDeleteAccount.fulfilled]: (state, {payload}) => {
      state.deleteAccountLoading = false;
      state.deleteStatus = payload;
    },
    [fetchDeleteAccount.pending]: (state, {payload}) => {
      state.deleteAccountLoading = true;
      state.deleteStatus = null;
    },
    [fetchDeleteAccount.rejected]: (state, {payload}) => {
      state.deleteAccountLoading = false;
      state.deleteStatus = payload;
    },
  },
});

export default deleteAccountSlice.reducer;
