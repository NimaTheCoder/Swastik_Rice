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
import ImageFallback from '../common/ImageFallback';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fonts} from '../common/CustomFonts';
const NewProducts = ({title, isLoading, value, products}) => {
  const navigation = useNavigation();
  const [star, setStar] = useState(4.2);

  //   useEffect(() => {
  //     const decimalPart = star % 1;
  //     if (decimalPart >= 0.3 && decimalPart <= 0.9) {
  //       console.log('start half');
  //     } else {
  //       console.log('start full');
  //     }
  //   }, [star]);
  // const onError = el => {
  //   console.log('el', el);
  //   console.log('err =>', `${imageUrl}${el.mediumThumbnail}`);
  //   return {
  //     uri: `https://tms.goldenbuzz.in/uploads/ProductImages/4e6d9de8-23ef-4dcf-ba82-687383364f12_dry-apricot-11526066733kqrpv3ial9_medium.png`,
  //   };
  // };

  const {width, fontScale} = Dimensions.get('window');
  function calculatePercentageOff(mrp, salePrice) {
    if (mrp <= 0 || salePrice < 0) {
      return null;
    }
    const percentageOff = ((mrp - salePrice) / mrp) * 100;
    return percentageOff.toFixed(2); // Return the percentage with two decimal places
  }

  return (
    <UI.Container>
      <UI.Div
        mt={10}
        // height: 250
        style={{overflow: 'hidden'}}
        bg="#fff"
        p={6}
        br={6}>
        {isLoading ? (
          <UI.Div style={{height: 280, overflow: 'hidden'}}>
            <SkeletonProducts />
          </UI.Div>
        ) : (
          <UI.Div>
            {products !== null && products?.length !== 0 ? (
              <UI.Div>
                <UI.Flex middle spaceb>
                  <UI.Div>
                    <UI.Text
                      cp
                      size={14 / fontScale}
                      color={colors.layoutTheme}
                      font={fonts.rm}>
                      {title}
                    </UI.Text>
                  </UI.Div>
                  <UI.Div>
                    <TouchableOpacity
                      style={{flexDirection: 'row', alignItems: 'center'}}
                      onPress={() =>
                        navigation.navigate('ViewAllProducts', {value, title})
                      }>
                      <UI.Text
                        mr={4}
                        size={14 / fontScale}
                        color={colors.layoutTheme}
                        font={fonts.rm}>
                        View all
                      </UI.Text>
                      <View>
                        <FontAwesome
                          name="angle-right"
                          size={20}
                          color={colors.layoutTheme}
                        />
                      </View>
                    </TouchableOpacity>
                  </UI.Div>
                </UI.Flex>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}>
                  {products &&
                    products?.map((el, index) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProductsDetails', {
                            el,
                            productId: el.id,
                          })
                        }
                        key={index}
                        style={{marginRight: 20, width: 160}}>
                        <View style={{height: 130, width: '100%', padding: 10}}>
                          <ImageFallback
                            // url={`${imageUrl}a/${el.largeThumbnail}`}
                            url={{uri: `${imageUrl}${el?.mediumThumbnail}`}}
                            ImStyle={styles.tinyLogo}
                          />
                        </View>
                        {/* <Image
                          style={styles.tinyLogo}
                          source={{
                            uri: `${imageUrl}${el.largeThumbnail}`,
                          }}
                          // onError={err => onError(err)}
                        /> */}
                        <UI.Div width="100%">
                          <UI.Div pl={8} pt={6} width="100%">
                            <UI.Text
                              cp
                              color={colors.grayBoldMax}
                              style={{
                                fontSize: 14 / fontScale,
                              }}
                              line={1}
                              font={fonts.rm}>
                              {el.productName}
                            </UI.Text>
                          </UI.Div>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: 4,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <StarRating
                                maxStars={1}
                                disabled={true}
                                rating={el?.rating == null ? 5.0 : el?.rating}
                                starSize={14}
                                halfStarColor="red"
                                selectedStar={ratings => setStar(ratings)}
                                fullStarColor={colors.layoutTheme}
                              />
                              <UI.Text
                                ml={4}
                                size={12 / fontScale}
                                font={fonts.rr}>
                                {el?.rating == null
                                  ? '5.0'
                                  : el?.rating.toFixed(1)}
                              </UI.Text>
                              {el?.mrp == null ||
                              el?.mrp == el?.salePrice ||
                              el?.mrp == 0 ? null : (
                                <UI.Div ml={4}>
                                  <UI.Text
                                    font={fonts.rr}
                                    color={'#22c55e'}
                                    size={12 / fontScale}>
                                    {calculatePercentageOff(
                                      el.mrp,
                                      el.salePrice,
                                    ) !== null &&
                                    calculatePercentageOff(
                                      el.mrp,
                                      el.salePrice,
                                    ) == '0.00'
                                      ? ''
                                      : `${calculatePercentageOff(
                                          el.mrp,
                                          el.salePrice,
                                        )}%`}
                                  </UI.Text>
                                </UI.Div>
                              )}
                            </View>
                            <UI.Div
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              {el?.mrp == null ||
                              el?.mrp == el?.salePrice ||
                              el?.mrp == 0 ? null : (
                                <UI.Text
                                  font={fonts.rr}
                                  style={{
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                  }}
                                  color={colors?.lightPrice}
                                  size={12 / fontScale}>
                                  ₹{el?.mrp}{' '}
                                </UI.Text>
                              )}

                              <UI.Text
                                font={fonts.rr}
                                color={colors.darkPrice}
                                size={12 / fontScale}>
                                {el.salePrice == el.mrp
                                  ? ''
                                  : `₹${el.salePrice}`}
                              </UI.Text>
                            </UI.Div>
                          </View>
                        </UI.Div>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </UI.Div>
            ) : null}
          </UI.Div>
        )}
      </UI.Div>
    </UI.Container>
  );
};

export default NewProducts;
const styles = StyleSheet.create({
  tinyLogo: {
    resizeMode: 'contain',
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
});
