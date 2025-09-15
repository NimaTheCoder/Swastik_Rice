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
  TextInput,
} from 'react-native';
import React, {useState, useMemo, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  decreaseCart,
  getTotal,
  removeCart,
} from '../../Redux/reducerSlice/asdasd';
import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import StarRating from 'react-native-star-rating-widget';
import RBSheet from 'react-native-raw-bottom-sheet';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import {imageUrl} from '../../../config';
import {useToast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import {
  fetchAddCarts,
  fetchCarts,
  fetchRemoveCarts,
} from '../../Redux/reducerSlice/CartSlicer';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';

import {SkeletonLayOutProduct} from '../../Components/common/laoding/Skeleton';
import {fetchAddress} from '../../Redux/reducerSlice/AddressSlice';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {addDefaultAddress} from '../../Redux/reducerSlice/AllactionSlice';
import DataNotFound from '../../Components/common/laoding/DataNotFound';
import ImageFallback from '../../Components/common/ImageFallback';
import {fonts} from '../../Components/common/CustomFonts';
// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const Cart = props => {
  const {width, fontScale} = Dimensions.get('window');
  const navigation = useNavigation();
  const toast = useToast();
  const refRBSheet = useRef();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {address, getAddressError, getAddressLoading} = useSelector(
    state => state.address,
  );
  const {defaultAddress} = useSelector(state => state.allActionSLice);
  const [fullLoading, setFullLoading] = useState(true);
  const [qtyDivID, setQtyDivId] = useState(null);
  const [qtyNumber, setQtyNumber] = useState(null);
  const [openQtyDivId, setOpenQtyDivId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qtyModalShow, setQtyModalShow] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [showChangeAddress, setShowChangeAddress] = useState(false);
  const [allCarts, setAllCarts] = useState([]);
  const {carts, getCartLoading, removeCardStatus, removeCardLoading} =
    useSelector(state => state.cart);

  const favorites = () => {};

  const handleRemoveCart = item => {
    const data = {
      productID: item.productID,
      SubAttributeID: item.subAttributeID,
    };

    const securityCode = userInfo?.data?.securityCode;

    dispatch(fetchRemoveCarts({data, securityCode}))
      .unwrap()
      .then(res => {
        if (res.isSuccess) {
          allfetchCarts();
          toast.show('Successfully removed from cart.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,

            animationType: 'slide-in | zoom-in',
          });
        }
      })
      .catch(er => {
        console.log('er', er);
      });
  };

  function calculatePercentageOff(mrp, salePrice) {
    if (mrp <= 0 || salePrice < 0) {
      return null;
    }
    const percentageOff = ((mrp - salePrice) / mrp) * 100;
    return percentageOff.toFixed(2); // Return the percentage with two decimal places
  }

  const updateQty = num => {
    const data = {
      productID: num.productID,
      productQty: num.productQty,
      subAttributeID: num.subAttributeID,
    };
    const securityCode = userInfo?.data?.securityCode;
    // const values = {data, securityCode};
    // console.log('values', values);
    dispatch(fetchAddCarts({data, securityCode}))
      .unwrap()
      .then(res => {
        dispatch(fetchCarts(userInfo?.data?.securityCode));
      });
  };

  const increaseQty = el => {
    // setAllCarts(prevData => ({
    //   ...prevData,
    //   data: prevData.data.map(product =>
    //     product.id === el.id
    //       ? {...product, productQty: product.productQty + 1}
    //       : product,
    //   ),
    // }));
    const data = {
      productID: el.productID,
      productQty: el.productQty + 1,
      subAttributeID: el.subAttributeID,
    };
    const securityCode = userInfo?.data?.securityCode;
    // const values = {data, securityCode};
    // console.log('values', values);
    dispatch(fetchAddCarts({data, securityCode}))
      .unwrap()
      .then(res => {
        setQtyDivId(null);
        setQtyNumber(null);
        allfetchCarts();
      });
  };
  const decrease = el => {
    const data = {
      productID: el.productID,
      productQty: el.productQty - 1,
      subAttributeID: el.subAttributeID,
    };
    const securityCode = userInfo?.data?.securityCode;
    // const values = {data, securityCode};
    // console.log('values', values);
    dispatch(fetchAddCarts({data, securityCode}))
      .unwrap()
      .then(res => {
        setQtyDivId(null);
        setQtyNumber(null);
        allfetchCarts();
      });
  };
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      allfetchCarts();

      dispatch(fetchAddress(userInfo?.data?.securityCode))
        .unwrap()
        .then(res => {
          if (res?.length == 0) {
            dispatch(addDefaultAddress(null));
          }
        })
        .catch(err => console.log('err', err));
    });
    return () => {
      focused();
    };
  }, [userInfo?.data?.securityCode]);

  const onRefresh = () => {
    setRefreshing(true);
    allfetchCarts();
    setRefreshing(false);
  };

  const allfetchCarts = () => {
    setLoading(true);
    dispatch(fetchCarts(userInfo?.data?.securityCode))
      .unwrap()
      .then(res => {
        setAllCarts(res?.data);
      })
      .catch(err => console.log('err------------------', err));
    setLoading(false);
  };
  const handelOpenAddress = () => {
    setShowChangeAddress(!showChangeAddress);
  };

  const radioButtons = useMemo(
    () =>
      address &&
      address?.map(item => ({
        id: `${item.id}`,
        label: `${item?.firstName} ${item?.lastName}`,
        value: item.newAddress,
        description: item.newAddress,
      })),
    [address],
  );

  const changeDefaultAddress = e => {
    setSelectedId(e);
    setShowChangeAddress(!showChangeAddress);
    const deafult = address?.find(el => el.id == e);
    dispatch(addDefaultAddress(deafult));
  };

  useEffect(() => {
    if (
      (defaultAddress == undefined || defaultAddress == null) &&
      address?.length !== 0
    ) {
      const deafult = address?.find((el, index) => index == 0);

      setSelectedId(`${deafult?.id}`);
      dispatch(addDefaultAddress(deafult));
    }
  }, [address]);
  const regex = /(<([^>]+)>)/gi;
  return (
    <Layout showBar back Dra comProps={props}>
      <Modal
        animationType="slide"
        transparent={true}
        animationOut="slideInDown"
        visible={showChangeAddress}
        onRequestClose={() => {
          setShowChangeAddress(!showChangeAddress);
        }}>
        <View style={styles.changeAddressCenteredView}>
          <View style={styles.changeAddressModalView}>
            <UI.Flex p={0} spaceb middle>
              <View></View>
              <TouchableOpacity
                onPress={() => setShowChangeAddress(!showChangeAddress)}>
                <AntDesign name="close" size={30} color={colors.layoutTheme} />
              </TouchableOpacity>
            </UI.Flex>
            <UI.Flex column p={0}>
              <UI.Div mt={10}>
                <Text size={14 / fontScale}>
                  {getAddressLoading ? 'loading....' : ''}
                </Text>
              </UI.Div>
              {radioButtons !== null ? (
                <RadioGroup
                  color="red"
                  containerStyle={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                  radioButtons={radioButtons}
                  onPress={e => changeDefaultAddress(e)}
                  // layout="row"

                  selectedId={selectedId}
                />
              ) : null}
            </UI.Flex>
          </View>
        </View>
      </Modal>
      {getCartLoading || loading ? <SkeletonLayOutProduct /> : null}
      {getCartLoading || loading ? <SkeletonLayOutProduct /> : null}

      <UI.Div mr={'auto'} ml={'auto'} width={'95%'} height={'80%'}>
        {isLogin == false || carts == null || carts?.data?.length == 0 ? (
          <View>
            <DataNotFound title={'cart'} isCart={true} />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{marginBottom: '10%'}}>
            {/* progress bar  */}
            <View
              style={{
                borderBottomWidth: 1,
                height: 100,
                borderBottomColor: colors.layoutTheme,
              }}>
              <ProgressSteps
                labelFontSize={14 / fontScale}
                labelColor={colors.grayMidBold}
                activeStep={0}
                progressBarColor={colors.grayMid}
                disabledStepIconColor={colors.grayMid}
                completedProgressBarColor={colors.layoutTheme}
                completedStepIconColor={colors.layoutTheme}
                activeStepIconBorderColor={colors.layoutTheme}
                activeLabelColor={colors.layoutTheme}
                topOffset={15}>
                <ProgressStep
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  label="Cart"></ProgressStep>
                <ProgressStep
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  label="Order Summary"></ProgressStep>
                <ProgressStep
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  label="Address"></ProgressStep>
                <ProgressStep
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  label="Payment"></ProgressStep>
              </ProgressSteps>
            </View>
            {/* address *********************************** */}
            {/* <UI.Div style={styles.addBox}>
              {address == null || address?.length == 0 ? (
                <UI.Flex>
                  <UI.Div width="60%"></UI.Div>
                  <UI.Div width="40%">
                    <UI.Button
                      onPress={() => navigation.navigate('address')}
                      border
                      pt={8}
                      size={14}
                      pb={8}
                      pl={6}
                      pr={6}
                      bg="#fff"
                      width={'90%'}
                      ml={'auto'}
                      mr="auto"
                      b={2}
                      bR={6}
                      text="Add Address"
                      bColor={colors.layoutTheme}
                    />
                  </UI.Div>
                </UI.Flex>
              ) : (
                <UI.Flex>
                  <UI.Div width="70%">
                    <UI.Text>
                      Deliver to:{' '}
                      <UI.Text bold>
                        {defaultAddress?.firstName} {defaultAddress?.lastName},{' '}
                        {defaultAddress?.pincode}
                      </UI.Text>
                    </UI.Text>
                    <UI.Text size={14}>{defaultAddress?.newAddress}</UI.Text>
                  </UI.Div>
                  <UI.Div width="30%">
                    <UI.Button
                      onPress={() => handelOpenAddress()}
                      border
                      pt={8}
                      size={14}
                      pb={8}
                      bg="#fff"
                      width={'80%'}
                      ml={'auto'}
                      mr="auto"
                      b={2}
                      bR={6}
                      text="Change"
                      bColor={colors.layoutTheme}
                    />
                  </UI.Div>
                </UI.Flex>
              )}
            </UI.Div> */}

            {carts?.data?.map((el, index) => (
              <UI.Div
                key={index}
                mt={16}
                mb={16}
                bg={'#fff'}
                br={6}
                p={10}
                style={{
                  position: 'relative',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProductsDetails', {
                        el,
                        productId: el.productID,
                      })
                    }
                    style={{width: '25%', height: Platform.isPad ? 150 : 80}}>
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
                  <UI.Div width="70%">
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductsDetails', {
                          el,
                          productId: el.productID,
                        })
                      }>
                      <UI.Text
                        font={fonts.rm}
                        size={16 / fontScale}
                        color={colors.layoutTheme}>
                        {el.productName}
                      </UI.Text>
                    </TouchableOpacity>
                    <UI.Text font={fonts.rr} line={3}>
                      {el?.shortDesc?.replace(regex, '')?.trim()}
                    </UI.Text>
                    <UI.Div width="30%" mt={4}>
                      {/* <StarRating
                        maxStars={5}
                        disabled={true}
                        rating={4.7}
                        starSize={16}
                        halfStarColor={colors.layoutTheme}
                        selectedStar={rating => setStar(rating)}
                        fullStarColor={colors.layoutTheme}
                      /> */}
                    </UI.Div>
                  </UI.Div>
                </View>
                {/* price details ************* */}
                <UI.Div
                  mt={10}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    // justifyContent: 'space-between',
                    position: 'relative',
                  }}>
                  {/*     QTY ************* */}
                  <UI.Div width="28%" style={{position: 'relative'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        height: 30,
                        borderRadius: 6,
                        elevation: 4,
                        backgroundColor: colors.layoutThemeLight,
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity
                        onPress={() => decrease(el)}
                        style={{
                          padding: 6,
                          width: Platform.isPad ? '25%' : '32%',
                        }}>
                        <AntDesign
                          name="minus"
                          size={20}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                      <UI.Text
                        font={fonts.rr}
                        size={14 / fontScale}
                        center
                        color={colors.white}
                        style={{
                          borderRightWidth: 1,
                          borderLeftWidth: 1,
                          borderColor: '#fff',
                          width: Platform.isPad ? '50%' : '30%',
                        }}>
                        {el.productQty}
                      </UI.Text>
                      <TouchableOpacity
                        onPress={() => increaseQty(el)}
                        style={{
                          padding: 6,
                          width: Platform.isPad ? '25%' : '32%',
                        }}>
                        <AntDesign
                          name="plus"
                          size={14 / fontScale}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                    </View>
                  </UI.Div>
                  {/* End     QTY ************* */}
                  <UI.Div
                    color={colors.lightPrice}
                    width="70%"
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    {el?.regularPrice == null ||
                    el?.regularPrice == el?.attributePrice ||
                    el?.regularPrice == 0 ? null : (
                      <UI.Text
                        font={fonts.rr}
                        size={14 / fontScale}
                        color="#22c55e">
                        {calculatePercentageOff(
                          el.regularPrice,
                          el.attributePrice,
                        ) !== null &&
                        calculatePercentageOff(
                          el.regularPrice,
                          el.attributePrice,
                        ) == '0.00'
                          ? ''
                          : `${calculatePercentageOff(
                              el.regularPrice,
                              el.attributePrice,
                            )}%`}
                      </UI.Text>
                    )}

                    <UI.Text
                      font={fonts.rr}
                      ml={6}
                      mr={6}
                      style={{
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}
                      size={14 / fontScale}
                      color={colors.lightPrice}>
                      {el?.attributePrice == el.regularPrice
                        ? ''
                        : `₹${el?.regularPrice}`}
                    </UI.Text>
                    {el?.regularPrice == null ||
                    el?.regularPrice == el?.attributePrice ||
                    el?.regularPrice == 0 ? null : (
                      <UI.Text
                        font={fonts.rr}
                        size={14 / fontScale}
                        color={colors.darkPrice}>
                        ₹{el?.attributePrice}
                      </UI.Text>
                    )}

                    {el.name !== null && (
                      <Text
                        font={fonts.rr}
                        size={14 / fontScale}
                        style={{
                          backgroundColor: colors.grayLight,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          marginLeft: 10,
                          color: '#000',
                          borderRadius: 6,
                        }}>
                        {el?.name}
                      </Text>
                    )}
                  </UI.Div>
                </UI.Div>
                {/*  order details  *******/}
                {/* <UI.Div
                  mt={10}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <UI.Text size={14} color={colors.garyMidMaxBold}>
                    Delivery by 11PM , Tomorrow |
                  </UI.Text>
                  <UI.Div
                    ml={10}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <UI.Text
                      style={{
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}
                      size={14}
                      color={colors.grayMidBold}>
                      ₹70
                    </UI.Text>
                    <UI.Text size={14} color={'#22c55e'}>
                      {' '}
                      Free Delivery
                    </UI.Text>
                  </UI.Div>
                </UI.Div> */}
                {/*  cart all btn */}
                <UI.Div
                  mt={10}
                  p={6}
                  style={{
                    borderTopWidth: 1,
                    borderColor: colors.grayMid,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <UI.Div
                    width="50%"
                    style={{
                      borderRightWidth: 1,
                      borderColor: colors.grayMid,
                    }}>
                    <TouchableOpacity
                      onPress={() => handleRemoveCart(el)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AntDesign
                        name="delete"
                        size={18}
                        color={colors.layoutTheme}
                      />
                      <UI.Text
                        font={fonts.rr}
                        size={14 / fontScale}
                        ml={6}
                        center>
                        Remove
                      </UI.Text>
                    </TouchableOpacity>
                  </UI.Div>
                  {/* <UI.Div bolt
                    width="33.33%"
                    style={{borderRightWidth: 1, borderColor: colors.grayMid}}>
                    <TouchableOpacity>
                      <UI.Text center> Save for later </UI.Text>
                    </TouchableOpacity>
                  </UI.Div> */}
                  <UI.Div width="50%">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Checkout', {
                          data: [
                            {
                              ...el,
                            },
                          ],
                        });
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons
                        name="flash"
                        size={18}
                        color={colors.layoutTheme}
                      />
                      <UI.Text font={fonts.rr} center size={14 / fontScale}>
                        Buy this now{' '}
                      </UI.Text>
                    </TouchableOpacity>
                  </UI.Div>
                </UI.Div>
              </UI.Div>
            ))}
            {/* Price Details  */}
            <UI.Div bg="#fff" mt={16} mb={'20%'} p={10} br={6}>
              <UI.Text font={fonts.rm} size={14 / fontScale}>
                Price Details
              </UI.Text>
              <UI.Flex middle spaceb>
                <UI.Div>
                  <UI.Text font={fonts.rr} size={14 / fontScale} mb={6}>
                    Price ({carts?.data?.length} items)
                  </UI.Text>
                  <UI.Text font={fonts.rr} size={14 / fontScale} mb={6}>
                    Discount
                  </UI.Text>
                  {/* Delivery charges  */}
                  {/* <UI.Text mb={6}>Delivery Charges</UI.Text> */}
                </UI.Div>
                <UI.Div>
                  <UI.Text font={fonts.rr} size={14 / fontScale} mb={6}>
                    ₹{carts?.total?.toFixed(2)}
                  </UI.Text>
                  <UI.Text
                    font={fonts.rr}
                    size={14 / fontScale}
                    mb={6}
                    color="#22c55e">
                    -{' '}
                    {carts?.data
                      ?.reduce((accumulator, item) => {
                        const discount =
                          item.regularPrice - item.attributePrice;
                        return accumulator + discount;
                      }, 0)
                      .toFixed(2)}
                  </UI.Text>
                  {/* Delivery charges  */}
                  {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <UI.Text
                      style={{
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}
                      mb={6}>
                      ₹90
                    </UI.Text>
                    <UI.Text color="#22c55e" ml={6} mb={6}>
                      Free Delivery
                    </UI.Text>
                  </View> */}
                </UI.Div>
              </UI.Flex>
            </UI.Div>
          </ScrollView>
        )}
      </UI.Div>

      {isLogin == false ||
      getCartLoading ||
      loading ||
      carts == null ||
      carts?.data?.length == 0 ? null : (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            bottom: Platform.OS == 'android' ? '8%' : '8%',
            paddingVertical: 20,
            alignItems: 'center',
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
          }}>
          <UI.Div>
            <UI.Text
              font={fonts.rr}
              size={12 / fontScale}
              style={{
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
              }}>
              ₹
              {carts?.data
                ?.reduce(
                  (accumulator, item) => accumulator + item.regularPrice,
                  0,
                )
                .toFixed(2)}
            </UI.Text>
            <UI.Text font={fonts.rb} size={16 / fontScale} color={'#000'}>
              ₹{carts?.total?.toFixed(2)}
            </UI.Text>
          </UI.Div>
          <UI.Button
            onPress={() => {
              navigation.navigate('Checkout', {data: carts?.data});
            }}
            gpb={10}
            gpt={10}
            size={16 / fontScale}
            width={'50%'}
            text="Checkout"
          />
        </View>
      )}
    </Layout>
  );
};

export default Cart;

const styles = StyleSheet.create({
  cartBtn: {
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  tinyLogo: {
    resizeMode: 'contain',
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  addBox: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderColor: colors.grayMid,
    elevation: 3,
  },
  qtybox: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grayBold,
    borderRadius: 6,
    padding: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 6,

    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  changeAddressCenteredView: {
    flex: 1,

    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  changeAddressModalView: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingHorizontal: 10,
    height: 400,
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
});
