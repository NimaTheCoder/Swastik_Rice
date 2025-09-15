import React from 'react';
import {Dimensions, View} from 'react-native';
import CategoryProducts from './CategoryProducts';
import NewProducts from './NewProducts';
import {useSelector} from 'react-redux';
import * as UI from '../UI/UI';
const ALlPRoducts = props => {
  const {products} = useSelector(state => state.products);

  const {getProductsOne, isLoading} = useSelector(
    state => state.productsOneSlice,
  );

  const {getProductsTwo, isLoadingTwo} = useSelector(
    state => state.productsTowSlice,
  );
  const {category} = useSelector(state => state.category);

  return (
    <View
      style={{
        marginBottom: 30,
        width: '100%',
      }}>
      <UI.Div>
        <CategoryProducts />
        <UI.Div mt={10}>
          <NewProducts
            value={3}
            title={getProductsOne?.collectionName}
            isLoading={isLoading}
            products={getProductsOne == undefined ? [] : getProductsOne?.data}
          />
        </UI.Div>

        <UI.Div mt={10}>
          <NewProducts
            value={4}
            title={getProductsTwo?.collectionName}
            isLoading={isLoadingTwo}
            products={getProductsTwo == undefined ? [] : getProductsTwo?.data}
          />
        </UI.Div>
      </UI.Div>

      {/* <NewProducts title="Trending" isLoading={isLoading} products={products} /> */}
    </View>
  );
};

export default ALlPRoducts;
