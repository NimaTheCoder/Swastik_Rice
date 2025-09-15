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
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import StarRating from 'react-native-star-rating-widget';
import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import RadioGroup from 'react-native-radio-buttons-group';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import {imageUrl} from '../../../config';
import {useNavigation} from '@react-navigation/native';
import {fetchCategoryByProduct} from '../../Redux/reducerSlice/CategorySlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  SkeletonLayOutProduct,
  SkeletonProducts,
} from '../../Components/common/laoding/Skeleton';
import RBSheet from 'react-native-raw-bottom-sheet';

import DataNotFound from '../../Components/common/laoding/DataNotFound';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  fetchAddWishlist,
  fetchRemoveWishlist,
} from '../../Redux/reducerSlice/WishlistSlice';
import {useToast} from 'react-native-toast-notifications';
import ModalLogin from '../../Components/common/auth/ModalLogin';
import ImageFallback from '../../Components/common/ImageFallback';
import FilterProducts from './FilterProducts';

const CategoryByProduct = props => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const refRBSheet = useRef();
  const [selectedId, setSelectedId] = useState('1');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [fullloading, setFullIsLoading] = useState(true);

  const {isLogin, userInfo} = useSelector(state => state.login);
  const [showLogin, setShowLogin] = useState(false);
  const [allProductList, setAllProductList] = useState([]);
  const {categoryByProduct, categoryByProductIsLoading} = useSelector(
    state => state.category,
  );
  const [priceValue, setPriceValue] = useState(null);
  const [alLWishlist, setAlLWishlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isNumberInWishlist = numberToCheck => {
    return alLWishlist.includes(numberToCheck);
  };

  useEffect(() => {
    setFullIsLoading(true);
    const securityCode = userInfo?.data?.securityCode;
    const data = props.route.params.cateID;
    dispatch(fetchCategoryByProduct({data, securityCode}))
      .unwrap()
      .then(res => setAllProductList(res))
      .catch(err => console.log('err', err));
    setFullIsLoading(false);
  }, [props.route.params]);

  const onRefresh = () => {
    setFullIsLoading(true);
    setPriceValue(null);
    setSelectedId('1');
    const securityCode = userInfo?.data?.securityCode;
    const data = props.route.params.cateID;
    dispatch(fetchCategoryByProduct({data, securityCode}))
      .unwrap()
      .then(res => {
        setAllProductList(res);
      })
      .catch(err => console.log('err', err));
    setFullIsLoading(false);
  };

  const favorites = el => {
    if (isLogin) {
      if (el.wishlist == false) {
        addFavorites(el);
        setAlLWishlist([...alLWishlist, el.productId]);
      } else {
        removeFavorites(el);
      }
    } else {
      setShowLogin(true);
    }
  };

  const removeFavorites = el => {
    setIsLoading(true);
    const data = {
      productID: el.productId,
    };
    const securityCode = userInfo?.data?.securityCode;
    dispatch(fetchRemoveWishlist({data, securityCode}))
      .unwrap()
      .then(res => {
        if (res.isSuccess) {
          toast.show('Product is removed from My wishlist.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });

          setAllProductList(prevList =>
            prevList.map(item =>
              item.productId === el.productId
                ? {...item, wishlist: false}
                : item,
            ),
          );

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(er => {
        setIsLoading(false);
      });
  };

  const addFavorites = el => {
    setIsLoading(true);
    const data = {
      productID: el.productId,
    };
    const securityCode = userInfo?.data?.securityCode;
    dispatch(fetchAddWishlist({data, securityCode}))
      .unwrap()
      .then(res => {
        setIsLoading(false);
        toast.show(`Product is added to My wishlist`, {
          type: 'black',
          placement: 'bottom',
          duration: 2000,
          offset: 30,
          animationType: 'slide-in | zoom-in',
        });
        setAllProductList(prevList =>
          prevList.map(item =>
            item.productId === el.productId ? {...item, wishlist: true} : item,
          ),
        );
        // const securityCode = userInfo?.data?.securityCode;
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
  };
  function calculatePercentageOff(mrp, salePrice) {
    if (mrp <= 0 || salePrice < 0) {
      return null;
    }
    const percentageOff = ((mrp - salePrice) / mrp) * 100;
    return percentageOff.toFixed(2); // Return the percentage with two decimal places
  }

  useEffect(() => {
    if (selectedId == 2) {
      // Price (highest first) ------------------------->
      const res2 = allProductList
        .slice()
        .sort((a, b) => b.salePrice - a.salePrice);

      setAllProductList(res2);
    } else if (selectedId == 4) {
      // Discount ------------------------->
      const products = allProductList.map(el => ({
        ...el,
        discountPercentage:
          ((el.productPrice - el.salePrice) / el.productPrice) * 100,
      }));
      const percentage = products
        .slice()
        .sort((a, b) => b.discountPercentage - a.discountPercentage);

      setAllProductList(percentage);
    } else if (selectedId == 3) {
      // Price (lowest first) ------------------------->
      const res2 = allProductList
        .slice()
        .sort((a, b) => a.salePrice - b.salePrice);

      setAllProductList(res2);
    } else if (selectedId == 1) {
      // What's New ------------------------->

      setAllProductList(categoryByProduct);
    }
  }, [selectedId]);

  const radioButtons = useMemo(
    () => [
      {
        id: '1',
        label: `What's New`,
        value: 'new',
      },
      {
        id: '2', // acts as primary key, should be unique and non-empty string
        label: 'Price (highest first)',
        value: 'PriceHighest',
      },

      {
        id: '3',
        label: 'Price (lowest first)',
        value: 'PriceLowest',
      },
      {
        id: '4',
        label: 'Discount',
        value: 'option2',
      },
    ],
    [],
  );
  const [headerHeight, setHeaderHeight] = useState(0);
  const [percentageBelowHeader, setPercentageBelowHeader] = useState(0);

  // useEffect(() => {
  //   // Calculate percentage below header
  //   const screenHeight = Dimensions.get('window').height;
  //   const calculatedPercentage = (headerHeight / screenHeight) * 100;
  //   setPercentageBelowHeader(calculatedPercentage);
  // }, [headerHeight]);

  // const onHeaderLayout = event => {
  //   const {height} = event.nativeEvent.layout;
  //   setHeaderHeight(height);
  // };

  return (
    <Layout showBar back sBar comProps={props}>
      {showLogin && (
        <ModalLogin showLogin={showLogin} setShowLogin={setShowLogin} />
      )}
      <FilterProducts
        allProductList={allProductList}
        setAllProductList={setAllProductList}
        percentageBelowHeader={percentageBelowHeader}
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        categoryByProduct={categoryByProduct}
        priceValue={priceValue}
        setPriceValue={setPriceValue}
      />

      <Modal
        animationType="slide"
        transparent={true}
        animationOut="slideInDown"
        visible={showSortModal}
        onRequestClose={() => {
          setShowSortModal(!showSortModal);
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity
            onPress={() => setShowSortModal(!showSortModal)}
            style={{
              backgroundColor: '',
              width: '100%',
              height: '80%',
            }}></TouchableOpacity>
          <View style={styles.modalView}>
            <UI.Flex p={0} spaceb middle>
              <UI.Div></UI.Div>
              <TouchableOpacity
                style={{marginLeft: 'auto'}}
                onPress={() => setShowSortModal(!showSortModal)}>
                <AntDesign name="close" size={30} color={colors.layoutTheme} />
              </TouchableOpacity>
            </UI.Flex>
            <RadioGroup
              color="red"
              containerStyle={{
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
              radioButtons={radioButtons}
              onPress={e => {
                setShowSortModal(!showSortModal);
                setSelectedId(e);
              }}
              // layout="row"

              selectedId={selectedId}
            />
          </View>
        </View>
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

      {fullloading || categoryByProductIsLoading ? (
        <SkeletonLayOutProduct />
      ) : null}

      {categoryByProduct == null || categoryByProduct?.length == 0 ? (
        <UI.Div
          ml={'auto'}
          mr={'auto'}
          br={10}
          style={{
            width: '100%',
            position: 'relative',
            height: '80%',
            justifyContent: 'center',
          }}>
          <LottieView
            style={{
              borderRadius: 17,
              height: Platform.OS == 'ios' ? 300 : 100,
              width: 450,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            autoPlay={true}
            loop
            resizeMode="cover"
            source={require('../../assets/json/Data_not_found.json')}
          />
          <UI.Text
            ml={'auto'}
            mr={'auto'}
            center
            bold
            size={30}
            mt={50}
            color={colors.grayBoldMax}>
            No Data Found
          </UI.Text>
        </UI.Div>
      ) : null}
      {categoryByProduct !== null &&
        categoryByProduct?.length !== 0 &&
        categoryByProductIsLoading === false && (
          <View
            style={{
              height: '80%',
              borderWidth: 1,
              backgroundColor: '#fff',
            }}>
            <UI.Div width="90%" mr={'auto'} ml="auto">
              <UI.Flex spaceb>
                <UI.Div p={4}>
                  <UI.Text color={colors.layoutTheme} bold size={16}>
                    {props.route.params.categoryType}
                  </UI.Text>
                </UI.Div>
                <UI.Flex p={4}>
                  <TouchableOpacity
                    onPress={() => setShowFilterModal(true)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <FontAwesome
                      name="filter"
                      size={20}
                      color={colors.brownColor}
                    />
                    <UI.Text color={colors.layoutTheme} ml={2} size={16}>
                      Filter
                    </UI.Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowSortModal(true)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome
                      name="sort"
                      size={20}
                      color={colors.brownColor}
                    />
                    <UI.Text color={colors.layoutTheme} ml={2} size={16}>
                      Sort
                    </UI.Text>
                  </TouchableOpacity>
                </UI.Flex>
              </UI.Flex>
              {allProductList?.length == 0 && (
                <>
                  <LottieView
                    style={{
                      borderRadius: 17,
                      height: Platform.OS == 'ios' ? 300 : 100,
                      width: 450,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                    autoPlay={true}
                    loop
                    resizeMode="cover"
                    source={require('../../assets/json/Data_not_found.json')}
                  />
                  <UI.Text
                    ml={'auto'}
                    mr={'auto'}
                    center
                    bold
                    size={30}
                    mt={50}
                    color={colors.grayBoldMax}>
                    No Data Found
                  </UI.Text>
                </>
              )}
              {/* ************************************All Products********************* */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                style={{
                  height: '100%',
                  // marginBottom: Platform.isPad ? '0%' : '40%',
                }}>
                {categoryByProduct &&
                  allProductList?.map((el, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductsDetails', {
                          el,
                          productId: el.productId,
                        })
                      }
                      key={index}>
                      <View style={{width: '100%'}}>
                        <UI.Flex center>
                          <UI.Div
                            mr={10}
                            width={'40%'}
                            height={160}
                            style={{position: 'relative'}}>
                            <ImageFallback
                              url={{uri: `${imageUrl}${el?.imagePath}`}}
                              ImStyle={styles.tinyLogo}
                            />
                            {/* <Image
                          style={styles.tinyLogo}
                          source={{
                            uri: `${imageUrl}${el.imagePath}`,
                          }}
                        /> */}
                            <View
                              style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                              }}>
                              {el?.wishlist == null || el?.wishlist == false ? (
                                <TouchableOpacity onPress={() => favorites(el)}>
                                  <MaterialIcons
                                    name="favorite-border"
                                    size={25}
                                    color={colors.brownColor}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity onPress={() => favorites(el)}>
                                  <MaterialIcons
                                    name="favorite"
                                    size={25}
                                    color={colors.brownColor}
                                  />
                                </TouchableOpacity>
                              )}
                              {/* <TouchableOpacity onPress={() => favorites(el)}>
                            <MaterialIcons
                              name="favorite-border"
                              size={25}
                              color={colors.brownColor}
                            />
                          </TouchableOpacity> */}
                            </View>
                          </UI.Div>
                          <UI.Div width={'60%'}>
                            <UI.Text color={colors.grayBoldMax} bold size={18}>
                              {el?.productName}
                            </UI.Text>
                            <UI.Div
                              mt={7}
                              style={{
                                borderColor: colors.layoutTheme,
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                              }}>
                              <Text
                                numberOfLines={3}
                                style={{
                                  paddingHorizontal: 4,
                                  paddingVertical: 8,
                                }}>
                                {el?.description}
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
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <StarRating
                                  maxStars={1}
                                  disabled={true}
                                  rating={el.rating === null ? '5' : el.rating}
                                  starSize={16}
                                  halfStarColor="red"
                                  selectedStar={rating => setStar(3.2)}
                                  fullStarColor={colors.layoutTheme}
                                />
                                <UI.Text ml={4}>
                                  {el?.rating === null
                                    ? '5.00'
                                    : el?.rating?.toFixed(2)}
                                </UI.Text>
                                <UI.Text
                                  bold
                                  color={'#22c55e'}
                                  ml={10}
                                  size={14}>
                                  {calculatePercentageOff(
                                    el.productPrice,
                                    el.salePrice,
                                  ) !== null &&
                                    `${calculatePercentageOff(
                                      el.productPrice,
                                      el.salePrice,
                                    )} %`}
                                </UI.Text>
                              </View>
                              <UI.Div
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}>
                                <UI.Text
                                  mr={10}
                                  color={colors.darkPrice}
                                  size={14}
                                  bold>
                                  ₹{el.salePrice}
                                </UI.Text>
                                <UI.Text
                                  style={{
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                  }}
                                  color={colors.lightPrice}
                                  size={14}
                                  bold>
                                  ₹{el.productPrice}
                                </UI.Text>
                              </UI.Div>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}></View>
                          </UI.Div>
                        </UI.Flex>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </UI.Div>
          </View>
        )}
    </Layout>
  );
};

export default CategoryByProduct;
const styles = StyleSheet.create({
  cartBtn: {
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  tinyLogo: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  centeredView: {
    flex: 1,

    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 210,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
