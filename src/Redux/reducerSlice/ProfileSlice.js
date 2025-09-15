import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  profileData: null,
  getProfileLoading: false,
  getProfileStatus: '',
  ///
  updateProfileLoading: false,
  updateProfileStatus: null,
};

export const fetchUpdateProfile = createAsyncThunk(
  'user/updateProfile',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        `User/EditMyProfile`,
        values.newValues,
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

export const fetchProfileData = createAsyncThunk(
  'user/updateProfle',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(`User/myProfiledetails`, {
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

const profileSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserProfileData: () => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchUpdateProfile.fulfilled]: (state, {payload}) => {
      state.updateProfileLoading = false;
      state.updateProfileStatus = payload;
    },
    [fetchUpdateProfile.pending]: (state, {payload}) => {
      state.updateProfileLoading = true;
      state.updateProfileStatus = null;
    },
    [fetchUpdateProfile.rejected]: (state, {payload}) => {
      state.updateProfileLoading = false;
      state.updateProfileStatus = payload;
    },
    [fetchProfileData.fulfilled]: (state, {payload}) => {
      state.getProfileLoading = false;
      state.profileData = payload;
      state.getProfileStatus = '';
    },
    [fetchProfileData.pending]: (state, {payload}) => {
      state.getProfileLoading = true;
      state.profileData = null;
      state.getProfileStatus = '';
    },
    [fetchProfileData.rejected]: (state, {payload}) => {
      state.getProfileLoading = false;
      state.profileData = null;
      state.getProfileStatus = payload;
    },
  },
});

export const {resetUserProfileData} = profileSlice.actions;
export default profileSlice.reducer;
