// import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import thunk from 'redux-thunk';
// import {combineReducers, createStore} from 'redux';
// import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './reducer';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer, {
//   middleware: [thunk],
// });
// // export const store = createStore(persistedReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: [thunk],
// });
// export const persistor = persistStore(store);

import {configureStore} from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import {combineReducers, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';

// import SampleSlice from './reducerSlice/SampleSlice';
// import loginSlice from './reducerSlice/LoginSlice';
// import PropertySlice from './reducerSlice/PropertySlice';
// import BookingSlice from './reducerSlice/BookingSlice';
// import CreateBookingSlice from './reducerSlice/CreateBooking';

// const reducers = combineReducers({
//   details: SampleSlice,
//   login: loginSlice,
//   property: PropertySlice,
//   booking: BookingSlice,
//   createBooking: CreateBookingSlice,
// });

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer, {
  middleware: [thunk],
});
// export const store = createStore(persistedReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
export const persistor = persistStore(store);
