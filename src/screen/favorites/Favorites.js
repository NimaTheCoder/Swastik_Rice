import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio,
  RefreshControl,
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCarts} from '../../Redux/reducerSlice/CartSlicer';
import {
  fetchRemoveWishlist,
  fetchWishlist,
} from '../../Redux/reducerSlice/WishlistSlice';
import {imageUrl} from '../../../config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating-widget';
import {SkeletonLayOutProduct} from '../../Components/common/laoding/Skeleton';
import localStorage from 'redux-persist/es/storage';
import {useToast} from 'react-native-toast-notifications';
import LottieView from 'lottie-react-native';
import DataNotFound from '../../Components/common/laoding/DataNotFound';
import {ActivityIndicator} from 'react-native';
import ImageFallback from '../../Components/common/ImageFallback';
import {fonts} from '../../Components/common/CustomFonts';

const Favorites = props => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const {wishlist, getWishlistLoading} = useSelector(state => state.wishlist);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(true);
  const [allWishlist, setAllWishlist] = useState([]);
  const {width, fontScale} = Dimensions.get('window');
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      getWishList();
    });

    return () => {
      focused();
    };
  }, [userInfo?.data?.securityCode]);

  const onRefresh = () => {
    getWishList();
  };

  const removeFavorites = item => {
    setRemoveLoading(true);
    const data = {
      productID: item,
    };
    const securityCode = userInfo?.data?.securityCode;
    dispatch(fetchRemoveWishlist({data, securityCode}))
      .unwrap()
      .then(res => {
        setRemoveLoading(false);
        if (res.isSuccess) {
          const finalData = allWishlist.filter(
            (el, i) => el.productID !== item,
          );
          setAllWishlist(finalData);
          toast.show('Successfully removed from wishlist.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
        }
      })
      .catch(er => {
        setRemoveLoading(true);
      });
  };

  const getWishList = () => {
    setFullLoading(true);
    dispatch(fetchWishlist(userInfo?.data?.securityCode))
      .unwrap()
      .then(res => {
        setFullLoading(false);
        setAllWishlist(res?.data);
      })
      .catch(err => {
        setFullLoading(false);
      });
  };
  const regex = /(<([^>]+)>)/gi;
  function calculatePercentageOff(mrp, salePrice) {
    if (mrp <= 0 || salePrice < 0) {
      return null;
    }
    const percentageOff = ((mrp - salePrice) / mrp) * 100;
    return percentageOff.toFixed(2); // Return the percentage with two decimal places
  }
  return (
    <Layout showBar back Dra comProps={props}>
      {getWishlistLoading || fullLoading ? (
        <View style={{width: '100%', height: '100%'}}>
          <SkeletonLayOutProduct />
          <SkeletonLayOutProduct />
        </View>
      ) : null}
      {removeLoading === true ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.layoutTheme} />
        </View>
      ) : null}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          marginBottom: 80,
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        {wishlist == null || allWishlist?.length == 0 ? (
          <DataNotFound title="Wishlist" />
        ) : null}
        {wishlist &&
          allWishlist?.map((el, index) => (
            <View
              key={index}
              style={{
                borderBottomWidth: 1,
                paddingVertical: 10,
                // borderStyle: 'dashed',
                borderColor: colors.grayMid,
              }}>
              <View style={{width: '100%'}}>
                <UI.Flex center>
                  <UI.Div
                    mr={10}
                    width={Platform.isPad ? '30%' : '40%'}
                    height={Platform.isPad ? 200 : 150}
                    style={{position: 'relative'}}>
                    <TouchableOpacity
                      style={{height: '100%', width: '100%'}}
                      onPress={() =>
                        props.navigation.navigate('ProductsDetails', {
                          el,
                          productId: el.productID,
                        })
                      }>
                      <ImageFallback
                        // url={`${imageUrl}a/${el.largeThumbnail}`}
                        url={{uri: `${imageUrl}${el?.mediumThumbnail}`}}
                        ImStyle={styles.tinyLogo}
                      />
                      {/* <Image
                        style={styles.tinyLogo}
                        source={{
                          uri: `${imageUrl}${el.mediumThumbnail}`,
                        }}
                      /> */}
                    </TouchableOpacity>
                    {/* <View
                        style={{position: 'absolute', bottom: 10, right: 10}}>
                        <TouchableOpacity
                          onPress={() => removeFavorites(el.productID)}>
                          <MaterialIcons
                            name="favorite"
                            size={25}
                            color={'#ef4444'}
                          />
                        </TouchableOpacity>
                      </View> */}
                  </UI.Div>
                  <UI.Div width={'60%'}>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('ProductsDetails', {
                          el,
                          productId: el?.productID,
                        })
                      }>
                      <UI.Flex spaceb>
                        <TouchableOpacity
                          onPress={() =>
                            props.navigation.navigate('ProductsDetails', {
                              el,
                              productId: el?.productID,
                            })
                          }>
                          <UI.Text
                            cp
                            line={2}
                            color={colors.grayBoldMax}
                            font={fonts.rm}
                            size={14 / fontScale}>
                            {el?.productName}
                          </UI.Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                          onPress={() => removeFavorites(el.productID)}>
                          <UI.Text color="#ef4444">Remove</UI.Text>
                        </TouchableOpacity> */}
                      </UI.Flex>
                      <UI.Div
                        mt={7}
                        style={{
                          borderColor: colors.layoutTheme,
                          borderBottomWidth: 1,
                          borderTopWidth: 1,
                        }}>
                        <UI.Text
                          font={fonts.rr}
                          line={3}
                          style={{
                            paddingHorizontal: 4,
                            paddingVertical: 8,
                            fontSize: 13 / fontScale,
                          }}>
                          {/* {el?.shortDesc} */}
                          {el?.shortDesc?.replace(regex, '')?.trim()}
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
                            rating={el?.rating == null ? '5' : el?.rating}
                            starSize={16}
                            halfStarColor="red"
                            selectedStar={rating => setStar(3.2)}
                            fullStarColor={colors.layoutTheme}
                          />
                          <UI.Text font={fonts.rr} ml={4} size={13 / fontScale}>
                            {el?.rating == null
                              ? '5.0'
                              : el?.rating?.toFixed(1)}
                          </UI.Text>
                          <UI.Div ml={6}>
                            {el?.mrp == null ||
                            el?.mrp == el?.salePrice ||
                            el?.mrp == 0 ? null : (
                              <UI.Text
                                font={fonts.rr}
                                color={'#22c55e'}
                                size={13 / fontScale}>
                                {calculatePercentageOff(
                                  el?.mrp,
                                  el?.salePrice,
                                ) !== null &&
                                calculatePercentageOff(
                                  el?.mrp,
                                  el?.salePrice,
                                ) == '0.00'
                                  ? ''
                                  : `${calculatePercentageOff(
                                      el?.mrp,
                                      el?.salePrice,
                                    )}%`}
                              </UI.Text>
                            )}
                          </UI.Div>
                        </View>

                        <UI.Div
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <UI.Text
                            mr={10}
                            color={colors.layoutTheme}
                            size={13 / fontScale}
                            font={fonts.rr}>
                            ₹{el.salePrice}
                          </UI.Text>

                          {el?.mrp == null ||
                          el?.mrp == el?.salePrice ||
                          el?.mrp == 0 ? null : (
                            <UI.Text
                              style={{
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                              }}
                              color={colors.layoutTheme}
                              size={13 / fontScale}
                              font={fonts.rr}>
                              ₹{el?.mrp}
                            </UI.Text>
                          )}
                        </UI.Div>
                      </View>
                    </TouchableOpacity>
                    <UI.Flex mt={10} spaceb>
                      <View></View>
                      <TouchableOpacity
                        onPress={() => removeFavorites(el.productID)}>
                        <UI.Text
                          font={fonts.rm}
                          size={14 / fontScale}
                          color="#ef4444">
                          Remove
                        </UI.Text>
                      </TouchableOpacity>
                    </UI.Flex>
                  </UI.Div>
                </UI.Flex>
              </View>
            </View>
          ))}
      </ScrollView>
    </Layout>
  );
};

export default Favorites;
const styles = StyleSheet.create({
  cartBtn: {
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  tinyLogo: {
    resizeMode: 'content',
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
});
