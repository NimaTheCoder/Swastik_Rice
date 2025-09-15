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

const ViewAllProducts = props => {
  const toast = useToast();
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const [allStateProducts, setAllStateProducts] = useState([]);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const [pageNumber, setPageNumber] = useState(1);

  const [prePage, setPrePage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isViewLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {viewAllProducts, isLoading} = useSelector(
    state => state.viewAllProducts,
  );

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {});
    const securityCode = userInfo?.data?.securityCode;
    const data = {
      page: pageNumber,
      id: props.route.params.value,
      securityCode: securityCode,
    };
    dispatch(fetchViewAllProducts(data));

    return () => {
      focused();
    };
  }, []);

  useEffect(() => {
    if (viewAllProducts?.data?.length > 0) {
      setAllStateProducts(prev => [...prev, ...viewAllProducts?.data]);
      setPrePage(viewAllProducts.pageNumber);
      dispatch(resetAllData());
    }
  }, [viewAllProducts]);

  useEffect(() => {
    if (pageNumber !== 1) fetchDataScrollEnd();
  }, [pageNumber]);

  const pullFetch = () => {
    setAllStateProducts([]);
    setPageNumber(1);
    const securityCode = userInfo?.data?.securityCode;
    const data = {
      page: 1,
      id: props.route.params.value,
      securityCode: securityCode,
    };
    dispatch(fetchViewAllProducts(data));
  };

  const fetchDataScrollEnd = () => {
    const securityCode = userInfo?.data?.securityCode;
    const data = {
      page: pageNumber,
      id: props.route.params.value,
      securityCode: securityCode,
    };
    dispatch(fetchViewAllProducts(data));
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
          productID: el.id,
        };
        const securityCode = userInfo?.data?.securityCode;
        dispatch(fetchAddWishlist({data, securityCode}))
          .unwrap()
          .then(res => {
            setAllStateProducts([]);
            setPageNumber(1);
            const data = {
              page: 1,
              id: props.route.params.value,
              securityCode: securityCode,
            };
            dispatch(fetchViewAllProducts(data));
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
              type: 'success',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          });
      } else {
        setIsLoading(true);
        const data = {
          productID: el.id,
        };
        const securityCode = userInfo?.data?.securityCode;
        dispatch(fetchRemoveWishlist({data, securityCode}))
          .unwrap()
          .then(res => {
            console.log('res', res);
            if (res.isSuccess) {
              setAllStateProducts([]);
              setPageNumber(1);
              const data = {
                page: 1,
                id: props.route.params.value,
                securityCode: securityCode,
              };
              dispatch(fetchViewAllProducts(data));
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
      navigation.navigate('login');
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductsDetails', {
            el: item,
            productId: item.id,
          });
        }}
        style={{width: '100%', height: '100%'}}>
        <UI.Div
          mr={'auto'}
          ml={'auto'}
          width={'95%'}
          height={160}
          style={{position: 'relative'}}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: `${imageUrl}${item.mediumThumbnail}`,
              // uri: `https://www.fnp.com/images/pr/l/v20220706124810/love-for-pastel-carnations-bouquet_1.jpg`,
            }}
          />
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
          <UI.Text bold size={18}>
            {item.productName}
          </UI.Text>
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
              <UI.Text mr={10} color={colors.layoutTheme} size={15} bold>
                ₹{item.salePrice}
              </UI.Text>
              <UI.Text
                style={{
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}
                color={colors.layoutTheme}
                size={15}
                bold>
                ₹{item.mrp}
              </UI.Text>
            </UI.Div>
            <UI.Div>
              <UI.Text bold color={'#22c55e'} size={14}>
                {calculatePercentageOff(item.mrp, item.salePrice) !== null &&
                  `${calculatePercentageOff(item.mrp, item.salePrice)} %`}
              </UI.Text>
            </UI.Div>
          </UI.Div>
          <UI.Text size={15}>
            Earliest Delivery: <UI.Text bold>Today</UI.Text>
          </UI.Text>
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
                <UI.Text ml={4} color="#fff">
                  {item.rating == null ? '5.0' : item.rating.toFixed(1)}
                </UI.Text>
              </View>
            </UI.Div>
            <UI.Text>
              {item.ReviewCount == 0 || item.ReviewCount == null
                ? ''
                : `${item.ReviewCount} Reviews`}
            </UI.Text>
          </UI.Div>
        </UI.Div>
      </TouchableOpacity>
    </View>
  );

  // const handleScroll = event => {
  //   const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
  //   const paddingToBottom = 10; // Adjust as needed

  //   if (
  //     layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom
  //   ) {
  //     setPageNumber(pageNumber + 1);
  //     console.log('api call 3 ', pageNumber);
  //   }
  // };
  const handleEndReached = () => {
    if (!refreshing) {
      setPageNumber(pageNumber + 1);
    }
  };
  // console.log('viewAllProducts', viewAllProducts);
  // console.log('isLoading-----------------------', isLoading);
  return (
    <Layout showBar back sBar comProps={props}>
      {isLoading && pageNumber == 1 ? (
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
        <FlatList
          ListHeaderComponent={() => (
            <UI.Div p={12}>
              <UI.Text bold color={colors.layoutTheme} size={18}>
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

      {isLoading && pageNumber !== 1 && (
        <ActivityIndicator size="large" color={colors.layoutTheme} />
      )}
      {/* <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={pullFetch} />
        }>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {viewAllProducts &&
            allStateProducts?.map((el, index) => (
              <View
                key={index}
                style={{
                  width: '50%',
                  height: 250,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: '#cbd5e1',
                }}>
                <TouchableOpacity
                  style={{width: '100%', height: '100%', borderWidth: 1}}>
                  <Text>{el.productName}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView> */}
    </Layout>
  );
};

export default ViewAllProducts;
const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // marginLeft: 'auto',
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // marginRight: 'auto',
  },
  nFlex: {
    position: 'absolute',
    bottom: 0,
    right: -0,
  },
  item: {
    width: '50%',
    height: 300,
    borderWidth: 1,
    padding: 10,
    borderColor: '#e2e8f0',
    // marginBottom: 16,
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
  },
});
