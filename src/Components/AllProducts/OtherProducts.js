import React, {useState, useEffect} from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as UI from '../UI/UI';
import StarRating from 'react-native-star-rating-widget';

import {colors} from '../Design';
import {useNavigation} from '@react-navigation/native';
import {imageUrl} from '../../../config';
import {SkeletonProducts} from '../common/laoding/Skeleton';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchOtherProducts,
  removeOtherProducts,
} from '../../Redux/reducerSlice/OtherProductsSlice';
import ImageFallback from '../common/ImageFallback';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fonts} from '../common/CustomFonts';
const OtherProducts = ({productsDetails, props}) => {
  const {width, fontScale} = Dimensions.get('window');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {otherProducts, otherProductsIsLoading} = useSelector(
    state => state.otherProduct,
  );
  const [star, setStar] = useState(4.2);
  return (
    <UI.Div mt={10}>
      <UI.Container>
        {otherProductsIsLoading ? (
          <UI.Div height={70} width="100%">
            <SkeletonProducts />
          </UI.Div>
        ) : null}
        {otherProducts == null && <UI.Text> </UI.Text>}
        {otherProducts !== null && otherProductsIsLoading === false && (
          <UI.Div bg="#fff" p={6} br={6}>
            <UI.Flex middle spaceb>
              <UI.Div>
                <UI.Text
                  size={15 / fontScale}
                  color={colors.layoutTheme}
                  font={fonts.rm}>
                  Other related products
                </UI.Text>
              </UI.Div>
              <UI.Div>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    dispatch(removeOtherProducts());
                    navigation.navigate('viewAllOtherProducts', {
                      productsDetails: productsDetails,
                      title: 'Other related products',
                    });
                  }}>
                  <UI.Text
                    color={colors.layoutTheme}
                    font={fonts.rm}
                    mr={4}
                    size={14 / fontScale}>
                    View all
                  </UI.Text>
                  <FontAwesome
                    name="angle-right"
                    size={20}
                    color={colors.layoutTheme}
                  />
                </TouchableOpacity>
              </UI.Div>
            </UI.Flex>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              {otherProducts &&
                otherProducts?.data?.map((el, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.replace('ProductsDetails', {
                        el,
                        productId: el.pid,
                      })
                    }
                    key={index}
                    style={{marginRight: 20, width: 160}}>
                    <UI.Div height={160} p={6} bg="#fff" br={6}>
                      <ImageFallback
                        // url={`${imageUrl}a/${el.largeThumbnail}`}
                        url={{uri: `${imageUrl}${el?.largeThumbnail}`}}
                        ImStyle={styles.tinyLogo}
                      />
                    </UI.Div>
                    {/* <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `${imageUrl}${el.largeThumbnail}`,
                      }}
                    /> */}
                    <UI.Div width="100%">
                      <UI.Div pl={8} pt={6} width="100%">
                        <Text
                          style={{
                            fontFamily: fonts.rm,
                            fontSize: 14 / fontScale,
                            textTransform: 'capitalize',
                          }}
                          numberOfLines={1}>
                          {el.productName}
                        </Text>
                      </UI.Div>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 4,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <StarRating
                            maxStars={1}
                            disabled={true}
                            rating={el.rating == null ? 5.0 : el.rating}
                            starSize={16}
                            halfStarColor="red"
                            selectedStar={rating => setStar(rating)}
                            fullStarColor={colors.layoutTheme}
                          />
                          <UI.Text font={fonts.rr} ml={4} size={14 / fontScale}>
                            {el.rating == null ? '5.0' : el.rating.toFixed(1)}
                          </UI.Text>
                        </View>
                        <UI.Div
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          {el.mrp == null ||
                          el.mrp == el?.salePrice ||
                          el.mrp === 0 ? null : (
                            <UI.Text
                              font={fonts.rr}
                              style={{
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                              }}
                              color={colors.layoutTheme}
                              size={14 / fontScale}>
                              ₹{el.mrp}{' '}
                            </UI.Text>
                          )}

                          <UI.Text
                            font={fonts.rr}
                            color={colors.layoutTheme}
                            size={14 / fontScale}>
                            {' '}
                            ₹{el.salePrice}
                          </UI.Text>
                        </UI.Div>
                      </View>
                    </UI.Div>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </UI.Div>
        )}
      </UI.Container>
    </UI.Div>
  );
};

export default OtherProducts;
const styles = StyleSheet.create({
  tinyLogo: {
    resizeMode: 'contain',
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
});
