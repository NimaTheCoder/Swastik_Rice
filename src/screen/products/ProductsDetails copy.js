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
  const {isLogin, userInfo} = useSelector(state => state.login);
  const {addCartLoading} = useSelector(state => state.cart);
  // const {products, isLoading} = useSelector(state => state.products);
  const {cartItems} = useSelector(state => state.cart);
  const {productsDetails, productsDeIsLoading} = useSelector(
    state => state.productDetails,
  );
  const routeID = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

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
              id: el.id,
              mediumThumbnail: el.mediumThumbnail,
              productQty: qtyNumber,
              productName: el.productName,
              productID: el.id,
              name: data.name,
              regularPrice: data.regularPrice * qtyNumber,
              attributePrice: data.sellPrice * qtyNumber,
              subAttributeID: data.id,
            },
          ],
        });
      } else {
        navigation.navigate('Checkout', {
          data: [
            {
              id: el.id,
              mediumThumbnail: el.mediumThumbnail,
              productQty: qtyNumber,
              productName: el.productName,
              productID: el.id,
              name: null,
              regularPrice: el.mrp * qtyNumber,
              attributePrice: el.salePrice * qtyNumber,
              subAttributeID: 0,
            },
          ],
        });
      }
    } else {
      setShowLogin(true);
    }

    // navigation.navigate('Checkout', {
    //   data: [
    //     {
    //       id: el.id,
    //       mediumThumbnail: el.mediumThumbnail,
    //       productQty: qtyNumber,
    //       productName: el.productName,
    //       productID: el.id,
    //       name: null,
    //       regularPrice: el.mrp * qtyNumber,
    //       attributePrice: el.salePrice * qtyNumber,
    //       subAttributeID: 0,
    //     },
    //   ],
    // });
  };

  const handelAddToCart = () => {
    if (isLogin) {
      setIsLoading(true);
      const data = {
        productID: productsDetails.id,
        productQty: totalQuantity,
        subAttributeID: attribute,
      };

      const securityCode = userInfo?.data?.securityCode;
      const values = {data, securityCode};

      dispatch(fetchAddCarts({data, securityCode}))
        .unwrap()
        .then(res => {
          setIsLoading(false);
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
          console.log('err => fetchAddCarts', err);
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

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      const securityCode = userInfo?.data?.securityCode;
      const values = {
        pid: productsDetails?.id,
        CatID: productsDetails?.parentCatID,
        pageNumber: 1,
        securityCode: securityCode,
      };
      dispatch(fetchOtherProducts(values))
        .unwrap()
        .then(res => console.log('res =>', res));
    });
    return () => {
      focused();
    };
  }, [productsDetails]);

  useEffect(() => {
    // const focused = props.navigation.addListener('focus', async () => {
    // });
    // return () => {
    //   focused();
    // };
    fetchProducts(routeID);
  }, [routeID]);

  const fetchProducts = routeID => {
    const securityCode = userInfo?.data?.securityCode;
    const values = {
      id: routeID.params.productId,
      securityCode: securityCode,
    };
    dispatch(fetchProductsDetails(values))
      .unwrap()
      .then(res => {
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
    if (productsDetails !== null && productsDetails?.imgCol > 0) {
      const res = productsDetails?.imgCol?.map(
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
        `https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=`,
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
    fetchProducts(routeID);
    // const securityCode = userInfo?.data?.securityCode;
    // const values = {
    //   id: routeID.params.productId,
    //   securityCode: securityCode,
    // };
    // dispatch(fetchProductsDetails(values))
    //   .unwrap()
    //   .then(res => {
    //     if (res?.attribute?.length !== 0) {
    //       setAttribute(res?.attribute[0].id);
    //       setPrice({
    //         salePrice: res?.attribute[0]?.sellPrice,
    //         mrp: res?.attribute[0]?.regularPrice,
    //       });
    //     } else {
    //       setAttribute(null);

    //       setPrice({
    //         salePrice: res?.salePrice,
    //         mrp: res?.mrp,
    //       });
    //     }
    //     setUpdateWishlist(res?.isWish);
    //   });
    setRefreshing(false);
  };
  const updateMoreQty = () => {
    if (qtyNumber == 0) {
      // setQuantityShow(false);
    } else {
      setQuantityShow(false);
      const data = {
        productID: props.route.params.el.id,
        productQty: qtyNumber,
      };
      // const data = {
      //   productID: qtyDivID,
      //   productQty: qtyNumber,
      // };
      const securityCode = userInfo?.data?.securityCode;
      // const values = {data, securityCode};
      // console.log('values', values);
      dispatch(fetchAddCarts({data, securityCode}))
        .unwrap()
        .then(res => {
          // setQtyDivId(null);
          // setQtyNumber(1);
          dispatch(fetchCarts(userInfo?.data?.securityCode));
        });
    }
  };

  const regex = /(<([^>]+)>)/gi;
  return (
    <Layout showBar back sBar comProps={props}>
      {showLogin && (
        <ModalLogin
          setContinueLogin={setContinueLogin}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />
      )}
      <Modal visible={zoomImageShow !== null ? true : false} transparent={true}>
        <ImageViewer
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
      {productsDeIsLoading && <SkeletonLayOutProductById />}
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
          style={{width: '95%', marginLeft: 'auto', marginRight: 'auto'}}>
          <UI.Div mt={10} style={{flex: 1, width: '100%'}}>
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
              ImageComponentStyle={{
                width: '95%',
                borderRadius: 6,
                marginRight: 4,
                height: 350,
              }}
              images={images}
            />
            <UI.Container>
              <UI.Div mt={10}>
                <UI.Text color={colors.grayBoldMax} size={22} bold>
                  {productsDetails.productName}
                </UI.Text>
                <View style={[styles.nFlex, {justifyContent: 'space-between'}]}>
                  <UI.Div ml={6} style={styles.nFlex}>
                    <UI.Text color={colors.brownColor} mr={2} size={18} bold>
                      ₹
                    </UI.Text>
                    <UI.Text color={colors.grayBoldMax} size={20} bold>
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
                  <UI.Div ml={6} style={styles.nFlex}>
                    <UI.Text color={colors.brownColor} mr={2} size={14} bold>
                      M.R.P. :
                    </UI.Text>
                    <UI.Text
                      style={{
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}
                      color={colors.brownColor}
                      mr={2}
                      size={14}
                      bold>
                      ₹
                    </UI.Text>
                    <UI.Text
                      style={{
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}
                      color={colors.grayBoldMax}
                      size={14}
                      bold>
                      {price && price?.mrp}
                    </UI.Text>
                  </UI.Div>
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
                      <UI.Text center bold>
                        {el.name}
                      </UI.Text>
                    </TouchableOpacity>
                  ))}
                </UI.Flex>
                <UI.Div mt={10} style={styles.productDetails}>
                  <UI.Text mt={10} mb={10} size={14}>
                    {productsDetails?.description?.replace(regex, '')}
                  </UI.Text>
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
                      starSize={20}
                      selectedStar={rating => setStar(rating)}
                      fullStarColor={colors.layoutTheme}
                    />
                    <UI.Text ml={4} size={20} color={colors.grayBoldMax}>
                      {productsDetails?.rating == null
                        ? '5.0'
                        : productsDetails?.rating}
                    </UI.Text>
                  </View>
                  <UI.Div>
                    <TouchableOpacity
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
                    </TouchableOpacity>

                    {/* {quantityShow && (
                      <View
                        style={{
                          // bottom: 0,
                          borderColor: colors.grayBold,
                          borderRadius: 6,
                          top: 40,
                          backgroundColor: '#fff',
                          position: 'absolute',
                          width: '100%',
                          zIndex: 1,
                          opacity: 1,
                          borderWidth: 1,
                          elevation: 4,
                        }}>
                        {quantity.map((el, index) => (
                          <TouchableOpacity
                            onPress={() => {
                              changeQty(el);
                              setQuantityShow(!quantityShow);
                            }}
                            key={index}
                            style={{marginVertical: 6}}>
                            <UI.Text center>{el}</UI.Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )} */}
                  </UI.Div>
                </UI.Flex>
                <UI.Div mt={10} width="80%" ml="auto" mr="auto">
                  <UI.Button
                    onPress={() => handelBuyNow(productsDetails)}
                    gpb={10}
                    gpt={10}
                    text="Buy now"
                    width="100%"
                  />
                  <UI.Div mt={6}>
                    <UI.Button
                      onPress={() => handelAddToCart()}
                      gpb={10}
                      gpt={10}
                      text="Add to cart"
                      width="100%"
                    />
                  </UI.Div>
                </UI.Div>
                {/* reviews ****************************** */}

                <UI.Div mt={25}>
                  <UI.Text color={colors.grayBoldMax} center size={20} bold>
                    Reviews
                  </UI.Text>

                  {images?.map((el, index) => (
                    <UI.Div key={index} mt={25}>
                      <UI.Text
                        mt={10}
                        width={'90%'}
                        color={colors.grayBoldMax}
                        center
                        size={14}
                        style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore.
                        quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat.
                      </UI.Text>
                      <UI.Flex spaceb middle>
                        <UI.Div>
                          <UI.Text size={20} bold color={colors.layoutTheme}>
                            Mack Parker
                          </UI.Text>
                          <UI.Text size={14} color={colors.grayBoldMax}>
                            2/05/2023
                          </UI.Text>
                        </UI.Div>
                        <UI.Div>
                          <StarRating
                            maxStars={5}
                            disabled={false}
                            rating={3.5}
                            starSize={20}
                            selectedStar={rating => setStar(rating)}
                            fullStarColor={colors.layoutTheme}
                            starStyle={{padding: 6}}
                          />
                        </UI.Div>
                      </UI.Flex>
                    </UI.Div>
                  ))}
                </UI.Div>
              </UI.Div>
              <UI.Div mt={10}>
                <OtherProducts
                  props={props}
                  productsDetails={productsDetails}
                />
              </UI.Div>
            </UI.Container>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={quantityShow}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setQuantityShow(!quantityShow);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* {quantity.map((el, index) => (
                            <TouchableOpacity
                              onPress={() => {
                                changeQty(el);
                                setQuantityShow(!quantityShow);
                              }}
                              key={index}
                              style={{
                                marginTop: 10,
                                paddingVertical: 10,
                                borderColor: colors.grayMid,
                                borderBottomWidth: 1,
                              }}>
                              <UI.Text center>{el}</UI.Text>
                            </TouchableOpacity>
                          ))} */}
            <UI.Div p={20}>
              <UI.Text bold color={'#000'}>
                Enter Quantity
              </UI.Text>
              <TextInput
                value={qtyNumber}
                onChangeText={text => {
                  const numericText = text.replace(/[^0-9]/g, '');

                  // Ensure the value is between 1 and 100
                  const numericValue = Math.min(
                    Math.max(parseInt(numericText) || 0, 0),
                    100,
                  );

                  // Update the state with the sanitized numeric value
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
            {/* <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                          </Pressable> */}
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
      </Modal>
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
  productDetails: {
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
