import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  profilePicture: '',
  defaultAddress: null,
};

const allActionSLice = createSlice({
  name: 'allActionSLice',
  initialState,
  reducers: {
    addProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    addDefaultAddress: (state, action) => {
      state.defaultAddress = action.payload;
    },
  },
});
export const {addProfilePicture, addDefaultAddress} = allActionSLice.actions;
export default allActionSLice.reducer;
// reference https://github.com/riponhaldar/productsweb/blob/main/src/redux/reducers/CartSlice.js
