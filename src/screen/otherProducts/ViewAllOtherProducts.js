import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  BackHandler,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as UI from '../../Components/UI/UI';
import {LoginBg} from '../../Components/common/ALLImages';
import {colors} from '../../Components/Design';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Layout from '../../Components/common/Layouts';
import {
  useNavigation,
  Router,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchViewAllProducts,
  resetAllData,
} from '../../Redux/reducerSlice/ViewAllProductsSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {imageUrl} from '../../../config';
import LottieView from 'lottie-react-native';
import {
  fetchAddWishlist,
  fetchRemoveWishlist,
} from '../../Redux/reducerSlice/WishlistSlice';
import {useToast} from 'react-native-toast-notifications';
import {fetchOtherProducts} from '../../Redux/reducerSlice/OtherProductsSlice';
import ModalLogin from '../../Components/common/auth/ModalLogin';
import ImageFallback from '../../Components/common/ImageFallback';
import {fonts} from '../../Components/common/CustomFonts';
const {width, fontScale} = Dimensions.get('window');
const ViewAllOtherProducts = props => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {isLogin, userInfo} = useSelector(state => state.login);
  const {otherProducts, otherProductsIsLoading} = useSelector(
    state => state.otherProduct,
  );
  const [fullLoading, setFullLoading] = useState(true);
  const [allStateProducts, setAllStateProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isViewLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  useEffect(() => {
    if (otherProducts?.data?.length > 0) {
      setAllStateProducts(prev => [...prev, ...otherProducts?.data]);
      //   setPrePage(otherProducts.pageNumber);
      //   dispatch(resetAllData());
    }
  }, [otherProducts]);

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      fetchViewAllOtherProducts(pageNumber);
    });
    return () => {
      focused();
    };
  }, []);

  useEffect(() => {
    if (pageNumber !== 1) fetchDataScrollEnd();
  }, [pageNumber]);

  const fetchDataScrollEnd = () => {
    fetchViewAllOtherProducts(pageNumber);
  };
  function calculatePercentageOff(mrp, salePrice) {
    if (mrp <= 0 || salePrice < 0) {
      return null;
    }
    const percentageOff = ((mrp - salePrice) / mrp) * 100;
    return percentageOff.toFixed(2); // Return the percentage with two decimal places
  }

  const favorites = el => {
    if (isLogin) {
      if (el.isWish == 0) {
        setIsLoading(true);
        const data = {
          productID: el.pid,
        };
        const securityCode = userInfo?.data?.securityCode;
        dispatch(fetchAddWishlist({data, securityCode}))
          .unwrap()
          .then(res => {
            setPageNumber(1);
            // fetchViewAll(1);
            setAllStateProducts(prevList =>
              prevList.map(item =>
                item.pid === el.pid ? {...item, isWish: true} : item,
              ),
            );

            setIsLoading(false);
            toast.show(`Product is added to My wishlist`, {
              type: 'black',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
            // const securityCode = userInfo?.data?.securityCode;
          })
          .catch(err => {
            setIsLoading(false);
            toast.show(`Something is wrong.`, {
              type: 'error',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          });
      } else {
        setIsLoading(true);
        const data = {
          productID: el.pid,
        };
        const securityCode = userInfo?.data?.securityCode;
        dispatch(fetchRemoveWishlist({data, securityCode}))
          .unwrap()
          .then(res => {
            if (res.isSuccess) {
              setPageNumber(1);
              // fetchViewAll(1);
              setAllStateProducts(prevList =>
                prevList.map(item =>
                  item.pid === el.pid ? {...item, isWish: false} : item,
                ),
              );
              toast.show('Product is removed from My wishlist.', {
                type: 'black',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in | zoom-in',
              });
              setIsLoading(false);
            } else {
              setIsLoading(false);
            }
          })
          .catch(er => {
            setIsLoading(false);
          });
      }
    } else {
      // setShowLogin(true);
      setShowLogin(true);
    }
  };
  // const pullFetch = () => {};
  const fetchViewAllOtherProducts = n => {
    setFullLoading(true);
    const values = {
      pid: props.route.params?.productsDetails?.id,
      CatID: props.route.params?.productsDetails?.parentCatID,
      pageNumber: n,
      securityCode: userInfo?.data?.securityCode,
    };

    dispatch(fetchOtherProducts(values));
    setFullLoading(false);
  };

  const pullFetch = () => {
    setAllStateProducts([]);
    setPageNumber(1);
    fetchViewAllOtherProducts(1);
  };

  const handleEndReached = () => {
    if (!refreshing) {
      setPageNumber(pageNumber + 1);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductsDetails', {
            el: item,
            productId: item.pid,
          });
        }}
        style={{width: '100%', height: '100%'}}>
        <UI.Div
          br={6}
          mr={'auto'}
          ml={'auto'}
          width={'95%'}
          height={Platform.isPad ? 350 : 120}
          style={{position: 'relative'}}>
          <ImageFallback
            // url={`${imageUrl}a/${el.largeThumbnail}`}
            url={{uri: `${imageUrl}${item?.mediumThumbnail}`}}
            ImStyle={styles.tinyLogo}
          />
          {/* <Image
            style={styles.tinyLogo}
            source={{
              uri: `${imageUrl}${item.mediumThumbnail}`,
              // uri: `https://www.fnp.com/images/pr/l/v20220706124810/love-for-pastel-carnations-bouquet_1.jpg`,
            }}
          /> */}
          <UI.Div ml={6} mt={10} style={styles.nFlex}>
            {item.isWish == null || item.isWish == 0 ? (
              <TouchableOpacity onPress={() => favorites(item)}>
                <MaterialIcons
                  name="favorite-border"
                  size={25}
                  color={colors.brownColor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => favorites(item)}>
                <MaterialIcons
                  name="favorite"
                  size={25}
                  color={colors.brownColor}
                />
              </TouchableOpacity>
            )}
          </UI.Div>
        </UI.Div>
        <UI.Div mt={10}>
          <Text
            style={{
              fontFamily: fonts.rm,
              textTransform: 'capitalize',
              fontSize: 14 / fontScale,
            }}
            numberOfLines={2}>
            {item.productName}
          </Text>
          <UI.Div
            mt={4}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <UI.Div
              style={{
                flexDirection: 'row',
              }}>
              <UI.Text
                font={fonts.rr}
                mr={10}
                color={colors.darkPrice}
                size={14 / fontScale}>
                ₹{item.salePrice}
              </UI.Text>
              {item.mrp == null ||
              item.salePrice === item.mrp ||
              item.mrp == 0 ? null : (
                <UI.Text
                  font={fonts.rr}
                  style={{
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  }}
                  color={colors.lightPrice}
                  size={14 / fontScale}>
                  {item.salePrice == item.mrp ? '' : `₹${item.mrp}`}
                </UI.Text>
              )}
            </UI.Div>
            <UI.Div>
              {item.mrp == null ||
              item.salePrice === item.mrp ||
              item.mrp == 0 ? null : (
                <UI.Text
                  font={fonts.rr}
                  color={'#22c55e'}
                  size={14 / fontScale}>
                  {calculatePercentageOff(item.mrp, item.salePrice) !== null &&
                  calculatePercentageOff(item.mrp, item.salePrice) == '0.00'
                    ? ''
                    : `${calculatePercentageOff(item.mrp, item.salePrice)}%`}
                </UI.Text>
              )}
            </UI.Div>
          </UI.Div>
          {/* <UI.Text size={14 / fontScale}>
            Earliest Delivery:{' '}
            <UI.Text bold size={14 / fontScale}>
              Today
            </UI.Text>
          </UI.Text> */}
          <UI.Div
            mt={6}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <UI.Div>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 4,
                  backgroundColor: '#22c55e',
                  paddingHorizontal: 6,

                  borderRadius: 6,
                }}>
                <StarRating
                  maxStars={1}
                  disabled={true}
                  rating={item.rating == null ? 5.0 : item.rating}
                  starSize={16}
                  halfStarColor="red"
                  // selectedStar={rating => setStar(3.5)}
                  fullStarColor={'#fff'}
                />
                <UI.Text
                  font={fonts.rr}
                  ml={4}
                  color="#fff"
                  size={14 / fontScale}>
                  {item.rating == null ? '5.0' : item.rating.toFixed(1)}
                </UI.Text>
              </View>
            </UI.Div>
            <UI.Text font={fonts.rr} size={14 / fontScale}>
              {item?.reviewCount == 0 || item?.reviewCount == null
                ? ''
                : `${item?.reviewCount} Reviews`}
            </UI.Text>
          </UI.Div>
        </UI.Div>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout showBar back comProps={props}>
      {showLogin && (
        <ModalLogin showLogin={showLogin} setShowLogin={setShowLogin} />
      )}
      {isViewLoading && (
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
      )}

      <View style={{height: '90%'}}>
        {(otherProductsIsLoading && pageNumber == 1) ||
        (fullLoading && pageNumber == 1) ? (
          <UI.Div style={{height: '100%'}}>
            <LottieView
              style={{
                borderRadius: 17,
                height: '30%',
                width: '100%',
              }}
              autoPlay={true}
              loop
              resizeMode="cover"
              source={require('../../assets/json/AllProducts.json')}
            />
            <LottieView
              style={{
                borderRadius: 17,
                height: '30%',
                width: '100%',
              }}
              autoPlay={true}
              loop
              resizeMode="cover"
              source={require('../../assets/json/AllProducts.json')}
            />
          </UI.Div>
        ) : (
          <UI.Div style={{height: '100%'}}>
            {otherProducts == null ? (
              <UI.Div>
                <UI.Text font={fonts.rm} center mt={20} size={14 / fontScale}>
                  No Data Found
                </UI.Text>
              </UI.Div>
            ) : (
              <FlatList
                ListHeaderComponent={() => (
                  <UI.Div p={12}>
                    <UI.Text
                      font={fonts.rm}
                      color={colors.layoutTheme}
                      size={15 / fontScale}>
                      {props?.route?.params?.title} :
                    </UI.Text>
                  </UI.Div>
                )}
                contentContainerStyle={styles.container}
                keyExtractor={(item, index) => index}
                data={allStateProducts}
                numColumns={2}
                scrollEnabled={true}
                renderItem={renderItem}
                onRefresh={() => pullFetch()}
                refreshing={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1} // Adjust this threshold as needed
              />
            )}
            {otherProductsIsLoading && pageNumber !== 1 && (
              <ActivityIndicator size="large" color={colors.layoutTheme} />
            )}
          </UI.Div>
        )}
      </View>
    </Layout>
  );
};

export default ViewAllOtherProducts;
const styles = StyleSheet.create({
  container: {
    // marginBottom: 80,
  },
  nFlex: {
    position: 'absolute',
    bottom: 0,
    right: -0,
  },
  item: {
    width: '50%',
    height: Platform.isPad ? 480 : 260,
    borderWidth: 1,
    padding: 10,
    borderColor: '#e2e8f0',
    // marginBottom: 16,
  },
  tinyLogo: {
    borderRadius: 12,
    resizeMode: Platform.isPad ? 'contain' : 'contain',
    width: '100%',
    height: '100%',
  },
});
