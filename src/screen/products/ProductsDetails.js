import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Animated,
  Modal,
  Dimensions,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Platform,
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import React, {useState, useEffect, useRef} from 'react';
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
import {SliderBox} from 'react-native-image-slider-box';
import StarRating from 'react-native-star-rating-widget';
import NewProducts from '../../Components/AllProducts/NewProducts';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  fetchAddCarts,
  getTotal,
} from '../../Redux/reducerSlice/CartSlicer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useToast} from 'react-native-toast-notifications';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  useCollapsibleHeader,
  CollapsibleSubHeaderAnimator,
} from 'react-navigation-collapsible';

import {useScrollToTop} from '@react-navigation/native';
import {imageUrl} from '../../../config';
import {
  fetchAddWishlist,
  fetchRemoveWishlist,
} from '../../Redux/reducerSlice/WishlistSlice';
import {fetchProductsDetails} from '../../Redux/reducerSlice/ProductByIdSlice';
import {SkeletonLayOutProductById} from '../../Components/common/laoding/Skeleton';
import ImageViewer from 'react-native-image-zoom-viewer';
import ModalLogin from '../../Components/common/auth/ModalLogin';
import OtherProducts from '../../Components/AllProducts/OtherProducts';
import {fetchOtherProducts} from '../../Redux/reducerSlice/OtherProductsSlice';
import {
  cleanReviews,
  getReviews,
} from '../../Redux/reducerSlice/GetOrderAndReviewSlice';
import {fonts} from '../../Components/common/CustomFonts';

const FirstRoute = () => <View style={{flex: 1, backgroundColor: '#ff4081'}} />;

const SecondRoute = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}} />
);

// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
// });

const ProductsDetails = props => {
  const toast = useToast();
  const {width, fontScale} = Dimensions.get('window');
  const {isLogin, userInfo} = useSelector(state => state.login);
  const {addCartLoading} = useSelector(state => state.cart);
  // const {products, isLoading} = useSelector(state => state.products);
  const {cartItems} = useSelector(state => state.cart);
  const {productsDetails, productsDeIsLoading} = useSelector(
    state => state.productDetails,
  );
  const {getProductBR} = useSelector(state => state.order);
  const routeID = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [fullLoading, setFullLoading] = useState(true);
  const [quantity, setQuantity] = useState([2, 3, 4]);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [qtyNumber, setQtyNumber] = useState(1);
  const [quantityShow, setQuantityShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [star, setStar] = useState(4.2);
  const [updateWishlist, setUpdateWishlist] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [zoomImages, setZoomImages] = useState([]);
  const [zoomImageShow, setZoomImageShow] = useState(null);
  const [attribute, setAttribute] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [continueLogin, setContinueLogin] = useState(false);
  const [price, setPrice] = useState(null);
  const [routes] = React.useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  // ********************************************testing*********************************************
  // const ref = useRef(null);
  // useScrollToTop(ref);
  // const {onScroll, containerPaddingTop, scrollIndicatorInsetTop, translateY} =
  //   useCollapsibleHeader({
  //     navigationOptions: {
  //       headerStyle: {
  //         backgroundColor: colors.layoutTheme,
  //         textAlign: 'center',
  //         elevation: 0,
  //         shadowOpacity: 0,
  //       },
  //     },
  //   });

  // const stickyHeaderHeight = 20;
  // ********************************************end testing*********************************************

  const [images, setImages] = useState([]);

  const changeQty = el => {
    if (el >= 2) {
      setTotalQuantity(el);
      setQuantity([1, 2, 3, 4]);
    } else {
      setTotalQuantity(el);
      setQuantity([2, 3, 4]);
    }
  };

  const handelBuyNow = el => {
    if (isLogin) {
      if (attribute !== null) {
        const data = el.attribute.find(el => el.id === attribute);
        navigation.navigate('Checkout', {
          data: [
            {
              id: el?.id,
              mediumThumbnail: el?.mediumThumbnail,
              productQty: qtyNumber,
              productName: el?.productName,
              productID: el?.id,
              name: data.name,
              shortDesc: el?.shortDesc,
              regularPrice: data?.regularPrice * qtyNumber,
              attributePrice: data?.sellPrice * qtyNumber,
              subAttributeID: data?.id,
            },
          ],
        });
      } else {
        navigation.navigate('Checkout', {
          data: [
            {
              id: el?.id,
              mediumThumbnail: el?.mediumThumbnail,
              productQty: qtyNumber,
              productName: el?.productName,
              productID: el?.id,
              name: null,
              shortDesc: el?.shortDesc,
              regularPrice: el?.mrp * qtyNumber,
              attributePrice: el?.salePrice * qtyNumber,
              subAttributeID: 0,
            },
          ],
        });
      }
    } else {
      setShowLogin(true);
    }
  };

  const writeAReview = () => {
    if (isLogin) {
      navigation.navigate('Reviews', {data: productsDetails});
    } else {
      setShowLogin(true);
    }
  };
  const handelAddToCart = () => {
    if (isLogin) {
      setIsLoading(true);
      const data = {
        productID: productsDetails.id,
        productQty: qtyNumber,
        subAttributeID: attribute,
      };

      const securityCode = userInfo?.data?.securityCode;
      const values = {data, securityCode};

      dispatch(fetchAddCarts({data, securityCode}))
        .unwrap()
        .then(res => {
          setIsLoading(false);
          toast.hideAll();
          toast.show(`Successfully added to cart.`, {
            type: 'custom',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            url: 'cart',
            page: 'cart',
            animationType: 'slide-in | zoom-in',
          });
        })
        .catch(err => {
          setIsLoading(false);
        });
      // dispatch(getTotal());
    } else {
      setShowLogin(true);
      // navigation.navigate('login', routeID?.name);
    }
  };

  const removeFavorites = item => {
    setIsLoading(true);
    const data = {
      productID: item,
    };
    setUpdateWishlist(0);
    const securityCode = userInfo?.data?.securityCode;
    dispatch(fetchRemoveWishlist({data, securityCode}))
      .unwrap()
      .then(res => {
        if (res.isSuccess) {
          setUpdateWishlist(0);
          toast.hideAll();
          toast.show('Product is removed from My wishlist.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
          setIsLoading(false);
        }
      })
      .catch(er => {
        setIsLoading(false);
      });
  };

  const favorites = id => {
    if (isLogin) {
      setIsLoading(true);
      const data = {
        productID: id,
        // productQty: qtyNumber,
      };
      const securityCode = userInfo?.data?.securityCode;
      // const values = {data, securityCode};
      // console.log('values', values);
      dispatch(fetchAddWishlist({data, securityCode}))
        .unwrap()
        .then(res => {
          setIsLoading(false);

          if (res.isSuccess == true) {
            setUpdateWishlist(1);
            toast.show(`Product is added to My wishlist`, {
              type: 'black',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          }

          // const securityCode = userInfo?.data?.securityCode;
          // const values = {
          //   id: routeID.params.productId,
          //   securityCode: securityCode,
          // };
          // dispatch(fetchProductsDetails(values));
        })
        .catch(err => {
          setIsLoading(false);
          toast.show(`Something is wrong.`, {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
        });
      // dispatch(getTotal());
    } else {
      setShowLogin(true);
      // navigation.navigate('login', routeID?.name);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setQtyNumber(1);
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation, qtyNumber]);

  const handleScroll = event => {
    if (event.nativeEvent.contentOffset.y > 400) {
    } else {
    }
  };

  const fetchOtherRelatedProducts = res => {
    const values = {
      pid: res?.id,
      CatID: res?.parentCatID,
      pageNumber: 1,
      securityCode: userInfo?.data?.securityCode,
    };

    dispatch(fetchOtherProducts(values))
      .unwrap()
      .then(res => console.log())
      .catch(err => console.log('err', err));
  };

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      fetchProducts(routeID);
      fetchReviews(routeID);
    });
    return () => {
      focused();
    };
  }, [routeID]);

  const fetchProducts = routeID => {
    setFullLoading(true);
    const securityCode = userInfo?.data?.securityCode;
    const values = {
      id: routeID.params.productId,
      securityCode: securityCode,
    };
    dispatch(fetchProductsDetails(values))
      .unwrap()
      .then(res => {
        setFullLoading(false);
        fetchOtherRelatedProducts(res);
        if (res?.attribute?.length !== 0) {
          setAttribute(res?.attribute[0].id);
          setPrice({
            salePrice: res?.attribute[0]?.sellPrice,
            mrp: res?.attribute[0]?.regularPrice,
          });
        } else {
          setAttribute(null);
          setPrice({
            salePrice: res?.salePrice,
            mrp: res?.mrp,
          });
        }
        setUpdateWishlist(res?.isWish);
      })
      .catch(err => {
        setFullLoading(false);
      });
  };
  // useEffect(() => {
  //   const securityCode = userInfo?.data?.securityCode;
  //   const values = {
  //     id: routeID.params.productId,
  //     securityCode: securityCode,
  //   };
  //   dispatch(fetchProductsDetails(values))
  //     .unwrap()
  //     .then(res => setUpdateWishlist(res?.isWish));
  // }, [routeID, userInfo?.data?.securityCode]);

  useEffect(() => {
    if (productsDetails !== null && productsDetails?.imgColl?.length > 0) {
      const res = productsDetails?.imgColl?.map(
        el => `${imageUrl}${el.mediumThumbnail}`,
      );
      const res2 = productsDetails?.imgColl?.map(el => {
        return {
          url: `${imageUrl}${el.mediumThumbnail}`,
        };
      });

      setImages(res);
      setZoomImages(res2);
    } else {
      setImages([
        require('../../assets/img/placeholder_image.jpg'),
        // `https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=`,
      ]);
      setZoomImages([]);
    }
  }, [productsDetails]);

  const handelUpdatePrice = id => {
    setPrice({
      salePrice: id?.sellPrice,
      mrp: id?.regularPrice,
    });
  };
  const onRefresh = () => {
    setRefreshing(true);
    setQtyNumber(1);
    fetchProducts(routeID);
    fetchReviews(routeID);
    setRefreshing(false);
  };

  const fetchReviews = routeID => {
    const data = {
      id: routeID.params.productId,
      pageSize: 10,
      pageNumber: 1,
    };
    dispatch(getReviews(data))
      .unwrap()
      .then(res => console.log('res -----x--------------->', res))
      .catch(err => console.log('err -----', err));
  };
  // const updateMoreQty = () => {
  //   if (qtyNumber == 0) {
  //     // setQuantityShow(false);
  //   } else {
  //     setQuantityShow(false);
  //     const data = {
  //       productID: props.route.params.el.id,
  //       productQty: qtyNumber,
  //     };
  //     // const data = {
  //     //   productID: qtyDivID,
  //     //   productQty: qtyNumber,
  //     // };
  //     const securityCode = userInfo?.data?.securityCode;
  //     // const values = {data, securityCode};
  //     // console.log('values', values);
  //     dispatch(fetchAddCarts({data, securityCode}))
  //       .unwrap()
  //       .then(res => {
  //         // setQtyDivId(null);
  //         // setQtyNumber(1);
  //         dispatch(fetchCarts(userInfo?.data?.securityCode));
  //       });
  //   }
  // };
  const [show, setShow] = useState(false);
  const regex = /(<([^>]+)>)/gi;
  function removeStyleTags(paragraph) {
    // Remove <style> tags
    paragraph = paragraph.replace(
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      '',
    );
    // Remove other HTML tags
    paragraph = paragraph.replace(/<\/?[^>]+(>|$)/g, '');
    // Remove leading and trailing whitespaces
    paragraph = paragraph.trim();
    return paragraph;
  }
  return (
    <Layout showBar back comProps={props}>
      {showLogin && (
        <ModalLogin
          setContinueLogin={setContinueLogin}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />
      )}
      {zoomImages?.length !== 0 && (
        <Modal
          visible={zoomImageShow !== null ? true : false}
          transparent={true}>
          <ImageViewer
            onCancel={() => setZoomImageShow(null)}
            index={zoomImageShow}
            backgroundColor="rgba(0,0,0,0.8)"
            renderHeader={() => (
              <TouchableOpacity
                onPress={() => setZoomImageShow(null)}
                style={{
                  marginLeft: 'auto',
                  position: 'absolute',
                  right: 0,
                  top: 50,
                  zIndex: 21,
                  margin: 30,
                }}>
                <AntDesign name="close" size={30} color={'#fff'} />
              </TouchableOpacity>
            )}
            style={{width: '100%', height: '30%'}}
            imageUrls={zoomImages}
          />
        </Modal>
      )}

      {loading && (
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

      {/* <UI.Container style={{width: '100%', height: '100%'}}> */}
      {productsDeIsLoading || fullLoading ? (
        <SkeletonLayOutProductById />
      ) : null}
      {productsDetails !== null ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // contentContainerStyle={{
          //   paddingTop: containerPaddingTop + stickyHeaderHeight,
          // }}
          // scrollIndicatorInsets={{
          //   top: scrollIndicatorInsetTop + stickyHeaderHeight,
          // }}
          // ref={ref}
          onScroll={e => handleScroll(e)}
          // style={{
          //   width: '95%',
          //   marginLeft: 'auto',
          //   marginRight: 'auto',
          // }}
        >
          <View></View>
          <UI.Div
            mt={10}
            style={{overflow: 'hidden', width: '95%'}}
            mr="auto"
            ml="auto">
            <SliderBox
              onCurrentImagePressed={text => {
                setZoomImageShow(text);
              }}
              autoplayInterval={3000}
              autoplay={false}
              dotStyle={{
                width: 15,
                height: 15,
                borderRadius: 15,
                marginHorizontal: 1,
              }}
              resizeMode={'contain'}
              ImageComponentStyle={{
                width: '100%',
                borderRadius: 6,
                // marginRight: 6,
                height: Platform.isPad ? 400 : 350,
              }}
              images={images}
            />
            <UI.Div>
              <UI.Div mt={10}>
                <UI.Text
                  cp
                  pl={6}
                  color={colors.grayBoldMax}
                  size={16 / fontScale}
                  font={fonts.rm}>
                  {productsDetails.productName}
                </UI.Text>
                <View
                  style={[
                    styles.nFlex,
                    {justifyContent: 'space-between', marginTop: 10},
                  ]}>
                  <UI.Div ml={6} style={styles.nFlex}>
                    <UI.Text
                      color={colors.brownColor}
                      mr={2}
                      size={16 / fontScale}
                      font={fonts.rm}>
                      ₹
                    </UI.Text>
                    <UI.Text
                      color={colors.darkPrice}
                      size={16 / fontScale}
                      font={fonts.rm}>
                      {price && price?.salePrice}
                    </UI.Text>
                  </UI.Div>
                  <UI.Div ml={6} mt={10} style={styles.nFlex}>
                    {updateWishlist == null || updateWishlist == 0 ? (
                      <TouchableOpacity
                        onPress={() => favorites(productsDetails?.id)}>
                        <MaterialIcons
                          name="favorite-border"
                          size={25}
                          color={colors.brownColor}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => removeFavorites(productsDetails?.id)}>
                        <MaterialIcons
                          name="favorite"
                          size={25}
                          color={colors.brownColor}
                        />
                      </TouchableOpacity>
                    )}
                  </UI.Div>
                </View>
                <View style={styles.nFlex}>
                  {price?.mrp == null ||
                  price?.mrp == price?.salePrice ||
                  price?.mrp == 0 ? null : (
                    <UI.Div ml={6} style={styles.nFlex}>
                      <UI.Text
                        color={colors.brownColor}
                        mr={2}
                        size={14 / fontScale}
                        font={fonts.rm}>
                        M.R.P. :
                      </UI.Text>
                      <UI.Text
                        style={{
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                        }}
                        color={colors.lightPrice}
                        mr={2}
                        size={14 / fontScale}
                        font={fonts.rm}>
                        ₹
                      </UI.Text>
                      <UI.Text
                        style={{
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                        }}
                        color={colors.lightPrice}
                        size={14 / fontScale}
                        font={fonts.rm}>
                        {price && price?.mrp}
                      </UI.Text>
                    </UI.Div>
                  )}
                </View>
                <UI.Flex wrap>
                  {productsDetails?.attribute?.map((el, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        handelUpdatePrice(el);
                        setAttribute(el.id);
                      }}
                      key={index}
                      style={{
                        borderWidth: 2,
                        width: '30%',
                        padding: 6,
                        marginTop: 10,
                        borderStyle: 'dotted',
                        borderRadius: 6,
                        marginRight: 10,
                        borderColor:
                          attribute == el.id ? colors.layoutTheme : 'gray',
                      }}>
                      <UI.Text center font={fonts.rm} size={14 / fontScale}>
                        {el.name}
                      </UI.Text>
                    </TouchableOpacity>
                  ))}
                </UI.Flex>

                <UI.Div
                  pt={2}
                  pb={2}
                  mb={10}
                  mt={10}
                  style={styles.productDetailsText}>
                  <UI.Div mt={4}>
                    <Text
                      numberOfLines={show ? null : 3}
                      style={{
                        fontFamily: fonts.rr,
                        fontSize: 13 / fontScale,
                      }}>
                      {productsDetails?.shortDesc?.replace(regex, '')?.trim()}
                    </Text>
                  </UI.Div>

                  {show && (
                    <UI.Div>
                      <Text
                        style={{
                          marginVertical: 6,
                          fontFamily: fonts.rr,
                          fontSize: 13 / fontScale,
                        }}>
                        {productsDetails?.longDesc?.replace(regex, '')?.trim()}
                      </Text>
                    </UI.Div>
                  )}
                  {productsDetails?.shortDesc == null ||
                  productsDetails?.shortDesc.length == 0 ? null : (
                    <TouchableOpacity
                      style={{marginLeft: 'auto'}}
                      onPress={() => setShow(!show)}>
                      <UI.Text
                        font={fonts.rr}
                        size={13}
                        color={colors.layoutTheme}>
                        {!show ? `View More` : 'View Less'}
                      </UI.Text>
                    </TouchableOpacity>
                  )}
                </UI.Div>

                <UI.Flex spaceb>
                  <View style={styles.rating}>
                    <StarRating
                      maxStars={5}
                      disabled={true}
                      rating={
                        productsDetails.rating == null
                          ? 5.0
                          : productsDetails.rating
                      }
                      starSize={16}
                      selectedStar={rating => setStar(rating)}
                      fullStarColor={colors.layoutTheme}
                    />
                    <UI.Text
                      font={fonts.rr}
                      ml={4}
                      size={14 / fontScale}
                      color={colors.grayBoldMax}>
                      {productsDetails?.rating == null
                        ? '5.0'
                        : productsDetails?.rating.toFixed(1)}
                      {console.log(
                        'productsDetails?.rating',
                        productsDetails?.rating,
                      )}
                    </UI.Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: 100,
                      height: 35,
                      borderRadius: 6,
                      elevation: 4,
                      backgroundColor: colors.layoutThemeLight,
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        if (qtyNumber !== 1) {
                          setQtyNumber(qtyNumber - 1);
                        } else {
                        }
                      }}
                      style={{padding: 6}}>
                      <AntDesign name="minus" size={20} color={colors.white} />
                    </TouchableOpacity>
                    <UI.Text
                      font={fonts.rr}
                      center
                      size={14 / fontScale}
                      style={{
                        borderRightWidth: 1,
                        borderLeftWidth: 1,
                        borderColor: '#fff',
                        padding: 6,
                        width: 30,
                      }}
                      color={colors.white}>
                      {qtyNumber}
                    </UI.Text>
                    <TouchableOpacity
                      onPress={() => setQtyNumber(qtyNumber + 1)}
                      style={{padding: 6}}>
                      <AntDesign name="plus" size={20} color={colors.white} />
                    </TouchableOpacity>
                  </View>

                  {/* <TouchableOpacity
                      onPress={() => setQuantityShow(!quantityShow)}
                      style={{
                        borderWidth: 1,
                        borderColor: colors.grayBold,
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        borderRadius: 6,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <UI.Text center>Qty: {qtyNumber}</UI.Text>
                      <Entypo
                        name="chevron-small-down"
                        size={30}
                        color={colors.brownColor}
                      />
                    </TouchableOpacity> */}
                </UI.Flex>
                <UI.Div mt={10} width="80%" ml="auto" mr="auto">
                  <UI.Button
                    onPress={() => handelBuyNow(productsDetails)}
                    gpb={10}
                    size={18 / fontScale}
                    gpt={10}
                    text="Buy now"
                    width="100%"
                  />
                  <UI.Div mt={6}>
                    <UI.Button
                      onPress={() => handelAddToCart()}
                      gpb={10}
                      gpt={10}
                      size={18 / fontScale}
                      text="Add to cart"
                      width="100%"
                    />
                  </UI.Div>
                </UI.Div>
                {/* reviews ****************************** */}

                <UI.Div
                  mt={25}
                  width={Platform.isPad ? '80%' : '100%'}
                  ml={'auto'}
                  mr={'auto'}>
                  <UI.Flex middle spaceb>
                    <UI.Text
                      font={fonts.rr}
                      Text
                      color={colors.grayBoldMax}
                      size={14 / fontScale}>
                      Reviews
                    </UI.Text>
                    <TouchableOpacity
                      style={{padding: 6}}
                      onPress={() => writeAReview()}>
                      <UI.Text
                        font={fonts.rr}
                        size={14 / fontScale}
                        u
                        color={colors.layoutThemeLight}>
                        Write Review
                      </UI.Text>
                    </TouchableOpacity>
                  </UI.Flex>
                  {getProductBR?.data !== null
                    ? getProductBR?.data?.reviews?.map((el, index) => (
                        <UI.Div key={index} mt={25}>
                          <UI.Text
                            mt={10}
                            width={'90%'}
                            color={colors.grayBoldMax}
                            center
                            font={fonts.rr}
                            size={14 / fontScale}
                            style={{
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}>
                            {el?.review}
                          </UI.Text>
                          <UI.Flex spaceb middle>
                            <UI.Div>
                              <UI.Text
                                size={14 / fontScale}
                                font={fonts.rr}
                                color={colors.layoutTheme}>
                                {el?.name}
                              </UI.Text>
                              <UI.Text
                                font={fonts.rr}
                                size={14 / fontScale}
                                color={colors.grayBoldMax}>
                                {new Date(el.reviewDate).toLocaleDateString()}
                              </UI.Text>
                            </UI.Div>
                            <UI.Div>
                              <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={el?.rating}
                                starSize={20}
                                selectedStar={rating => setStar(rating)}
                                fullStarColor={colors.layoutTheme}
                                starStyle={{padding: 6}}
                              />
                            </UI.Div>
                          </UI.Flex>
                        </UI.Div>
                      ))
                    : null}
                  {getProductBR?.data !== null && (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(cleanReviews());
                        navigation.navigate('ViewAllReview', {
                          id: productsDetails.id,
                        });
                      }}
                      style={{
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginTop: 10,
                        padding: 6,
                      }}>
                      <UI.Text
                        font={fonts.rm}
                        center
                        size={14 / fontScale}
                        color={colors.layoutTheme}>
                        View All Review
                      </UI.Text>
                    </TouchableOpacity>
                  )}
                </UI.Div>
              </UI.Div>
              <UI.Div mt={10}>
                <OtherProducts
                  props={props}
                  productsDetails={productsDetails}
                />
              </UI.Div>
            </UI.Div>
          </UI.Div>
        </ScrollView>
      ) : null}

      {/* <Animated.View
          style={{
            transform: [{translateY: 0}],
            position: 'absolute',
            backgroundColor: colors.background,
            top: containerPaddingTop,
            height: 80,
            paddingHorizontal: 4,
            width: '100%',
          }}>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={props => <TabBar {...props} />}
          />
        </Animated.View> */}
      {/* </UI.Container> */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={quantityShow}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setQuantityShow(!quantityShow);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <UI.Div p={20}>
              <UI.Text bold color={'#000'}>
                Enter Quantity
              </UI.Text>
              <TextInput
                value={qtyNumber}
                onChangeText={text => {
                  const numericText = text.replace(/[^0-9]/g, '');

                  const numericValue = Math.min(
                    Math.max(parseInt(numericText) || 0, 0),
                    100,
                  );

                  setQtyNumber(numericValue.toString());
                }}
                autoFocus={true}
                placeholder="Quantity"
                enterKeyHint={'done'}
                inputMode="numeric"
                keyboardType="number-pad"
                style={{
                  borderWidth: 1,
                  height: 40,
                  marginTop: 10,
                  borderColor: colors.grayMid,
                  borderRadius: 6,
                  padding: 6,
                }}
              />
            </UI.Div>

            <UI.Flex
              spaceb
              middle
              style={{
                borderTopWidth: 1,
                padding: 0,
                borderColor: colors.grayMid,
              }}>
              <TouchableOpacity
                onPress={() => setQuantityShow(!quantityShow)}
                style={{
                  padding: 10,
                  width: '50%',
                  borderRightWidth: 1,
                  borderColor: colors.garyMidMaxBold,
                }}>
                <UI.Text center>CANCEL</UI.Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateMoreQty()}
                style={{
                  padding: 8,
                  width: '50%',
                }}>
                <UI.Text center>APPLY</UI.Text>
              </TouchableOpacity>
            </UI.Flex>
          </View>
        </View>
      </Modal> */}
    </Layout>
  );
};

export default ProductsDetails;
const styles = StyleSheet.create({
  tinyLogo: {
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    height: '70%',
  },
  nFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetailsText: {
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.layoutTheme,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',

    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rating: {flexDirection: 'row', alignItems: 'center'},
});
