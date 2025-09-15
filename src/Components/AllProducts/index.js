// import React from 'react';
// import {Dimensions, View} from 'react-native';
// import CategoryProducts from './CategoryProducts';
// import NewProducts from './NewProducts';
// import {useSelector} from 'react-redux';
// import * as UI from '../UI/UI';
// const ALlPRoducts = props => {
//   const {products} = useSelector(state => state.products);

//   const {getProductsOne, isLoading} = useSelector(
//     state => state.productsOneSlice,
//   );

//   const {getProductsTwo, isLoadingTwo} = useSelector(
//     state => state.productsTowSlice,
//   );
//   const {category} = useSelector(state => state.category);

//   return (
//     <View
//       style={{
//         marginBottom: 30,
//         width: '100%',
//       }}>
//       <UI.Div>
//         <CategoryProducts />
//         <UI.Div mt={10}>
//           <NewProducts
//             value={3}
//             title={getProductsOne?.collectionName}
//             isLoading={isLoading}
//             products={getProductsOne == undefined ? [] : getProductsOne?.data}
//           />
//         </UI.Div>

//         <UI.Div mt={10}>
//           <NewProducts
//             value={4}
//             title={getProductsTwo?.collectionName}
//             isLoading={isLoadingTwo}
//             products={getProductsTwo == undefined ? [] : getProductsTwo?.data}
//           />
//         </UI.Div>
//       </UI.Div>

//       {/* <NewProducts title="Trending" isLoading={isLoading} products={products} /> */}
//     </View>
//   );
// };

// export default ALlPRoducts;


import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

const products = [
  {id: 1, name: 'Basmati Rice 1kg', price: 120},
  {id: 2, name: 'Brown Rice 1kg', price: 90},
  {id: 3, name: 'White Rice 1kg', price: 100},
];

const OrderBookingScreen = () => {
  const [cart, setCart] = useState([]);

  const addToCart = item => {
    setCart([...cart, item]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const checkout = () => {
    alert(`Order placed! Total: ₹${getTotal()}`);
    setCart([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Booking</Text>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.productRow}>
            <Text>{item.name} - ₹{item.price}</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToCart(item)}>
              <Text style={styles.addText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Cart Summary */}
      <View style={styles.cartBox}>
        <Text style={styles.cartText}>Items in Cart: {cart.length}</Text>
        <Text style={styles.cartText}>Total: ₹{getTotal()}</Text>
        <TouchableOpacity style={styles.checkoutBtn} onPress={checkout}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderBookingScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addText: {color: '#fff'},
  cartBox: {
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  cartText: {fontSize: 16, marginVertical: 4},
  checkoutBtn: {
    backgroundColor: '#ff5722',
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutText: {color: '#fff', fontWeight: 'bold'},
});
