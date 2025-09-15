// import {createSlice} from '@reduxjs/toolkit';

// const initialState = {
//   cartItems: [],
//   cartTotalQuantity: 0,
//   cartTotalAmount: 0,
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const itemIndex = state.cartItems.findIndex(
//         item => item.id === action.payload.id,
//       );

//       if (itemIndex >= 0) {
//         state.cartItems[itemIndex].cartQuantity += 1;
//       } else {
//         const tempProduct = {...action.payload, cartQuantity: 1};
//         state.cartItems.push(tempProduct);
//       }
//       return state;
//     },
//     removeCart: (state, action) => {
//       const removeItem = state.cartItems.filter(
//         items => items.id !== action.payload,
//       );
//       state.cartItems = removeItem;
//     },
//     decreaseCart(state, action) {
//       const itemIndex = state.cartItems.findIndex(
//         item => item.id === action.payload.id,
//       );
//       if (state.cartItems[itemIndex].cartQuantity > 1) {
//         state.cartItems[itemIndex].cartQuantity -= 1;
//       } else if (state.cartItems[itemIndex].cartQuantity === 1) {
//         const removeItem = state.cartItems.filter(
//           items => items.id !== action.payload.id,
//         );
//         state.cartItems = removeItem;
//       }
//     },
//     getTotal: (state, action) => {
//       let q = 0,
//         t = 0;
//       state.cartItems.forEach(element => {
//         t += element?.salePrice * element?.cartQuantity;
//       });
//       state.cartTotalQuantity = state.cartItems.length;
//       state.cartTotalAmount = t;
//       // let q = 0,
//       //   t = 0;
//       // state.cartItems.forEach(element => {
//       //   // q += element?.cartQuantity;
//       //   t += element?.salePrice;
//       // });
//       // state.cartTotalQuantity = state.cartItems.length;
//       // state.cartTotalAmount = t;
//       return state;
//     },
//   },
// });
// export const {addToCart, removeCart, getTotal, decreaseCart} =
//   cartSlice.actions;
// export default cartSlice.reducer;
// // reference https://github.com/riponhaldar/productsweb/blob/main/src/redux/reducers/CartSlice.js
