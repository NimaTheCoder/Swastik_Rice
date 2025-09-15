import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  uploadProfilePhotoLoading: false,
  uploadProfilePhotoStatus: null,
  //
  getProfilePhotoLoading: false,
  getProfilePhoto: null,
};

export const uploadProfilePhoto = createAsyncThunk(
  'profile/uploadProfilePhoto',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post('User/EditImage', values.data, {
        headers: {
          SecurityCode: values.securityCode,
        },
      });
      return {data};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchProfilePhoto = createAsyncThunk(
  'profile/fetchProfilePhoto',
  async (values, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(`User/GetEditImage`, {
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

const ProfileImageSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileImageData: () => {
      return initialState;
    },
  },
  extraReducers: {
    [uploadProfilePhoto.fulfilled]: (state, action) => {
      state.uploadProfilePhotoLoading = false;
      state.uploadProfilePhotoStatus = action.payload;
    },
    [uploadProfilePhoto.pending]: (state, action) => {
      state.uploadProfilePhotoLoading = true;
      state.uploadProfilePhotoStatus = null;
    },
    [uploadProfilePhoto.rejected]: (state, action) => {
      state.uploadProfilePhotoLoading = false;
      state.uploadProfilePhotoStatus = null;
    },
    [fetchProfilePhoto.fulfilled]: (state, action) => {
      state.getProfilePhotoLoading = false;
      state.getProfilePhoto = action.payload;
    },
    [fetchProfilePhoto.pending]: (state, action) => {
      state.getProfilePhotoLoading = true;
      state.getProfilePhoto = null;
    },
    [fetchProfilePhoto.rejected]: (state, action) => {
      state.getProfilePhotoLoading = false;
      state.getProfilePhoto = null;
    },
  },
});
export const {resetProfileImageData} = ProfileImageSlice.actions;
export default ProfileImageSlice.reducer;
