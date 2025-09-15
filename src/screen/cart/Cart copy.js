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

  const [qtyDivID, setQtyDivId] = useState(null);
  const [qtyNumber, setQtyNumber] = useState(null);
  const [openQtyDivId, setOpenQtyDivId] = useState(null);

  const [qtyModalShow, setQtyModalShow] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [showChangeAddress, setShowChangeAddress] = useState(false);
  const {carts, getCartLoading, removeCardStatus, removeCardLoading} =
    useSelector(state => state.cart);

  const favorites = () => {};

  const handleRemoveCart = item => {
    const data = {
      productID: item,
    };
    const securityCode = userInfo?.data?.securityCode;

    dispatch(fetchRemoveCarts({data, securityCode}))
      .unwrap()
      .then(res => {
        dispatch(fetchCarts(userInfo?.data?.securityCode));
        if (res.isSuccess) {
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

    dispatch(fetchAddCarts({data, securityCode}))
      .unwrap()
      .then(res => {
        dispatch(fetchCarts(userInfo?.data?.securityCode));
      });
  };

  const updateMoreQty = () => {
    setQtyModalShow(false);

    if (qtyNumber == 0) {
      const data = {
        productID: qtyDivID.productID,
      };
      const securityCode = userInfo?.data?.securityCode;
      dispatch(fetchRemoveCarts({data, securityCode}))
        .unwrap()
        .then(res => {
          dispatch(fetchCarts(userInfo?.data?.securityCode));
          if (res.isSuccess) {
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
    } else {
      // productID: el.productID,
      // attributeID: el?.subAttributeID,
      const data = {
        productID: qtyDivID.productID,
        productQty: qtyNumber,
        subAttributeID: qtyDivID.attributeID,
      };
      const securityCode = userInfo?.data?.securityCode;
      // const values = {data, securityCode};
      // console.log('values', values);
      dispatch(fetchAddCarts({data, securityCode}))
        .unwrap()
        .then(res => {
          setQtyDivId(null);
          setQtyNumber(null);
          dispatch(fetchCarts(userInfo?.data?.securityCode));
        });
    }
  };
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      dispatch(fetchCarts(userInfo?.data?.securityCode))
        .unwrap()
        .then(res => {})
        .catch(err => console.log('err------------------', err));

      const securityCode = userInfo?.data?.securityCode;
      dispatch(fetchAddress(securityCode));
    });
    return () => {
      focused();
    };
  }, [userInfo?.data?.securityCode]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchCarts(userInfo?.data?.securityCode))
      .unwrap()
      .then(res => {})
      .catch(err => console.log('err------------------', err));
    setRefreshing(false);
  };

  const handelOpenAddress = () => {
    setShowChangeAddress(!showChangeAddress);
    // const securityCode = userInfo?.data?.securityCode;
    // dispatch(fetchAddress(securityCode));
  };
  // const radioButtons = useMemo(
  //   () => [
  //     {
  //       id: '1', // acts as primary key, should be unique and non-empty string
  //       label: 'Price (highest first)',
  //       value: 'PriceHighest',
  //     },
  //     {
  //       id: '2',
  //       label: 'Discount',
  //       value: 'option2',
  //     },
  //     {
  //       id: '3',
  //       label: 'Price (lowest first)',
  //       value: 'PriceLowest',
  //       description: 'sadasd',
  //     },
  //     {
  //       id: '4',
  //       label: `What's New`,
  //       value: 'new',
  //     },
  //   ],
  //   [],
  // );

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
                <Text>{getAddressLoading ? 'loading....' : ''}</Text>
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
      {getCartLoading ? <SkeletonLayOutProduct /> : null}
      {getCartLoading ? <SkeletonLayOutProduct /> : null}

      <UI.Div mr={'auto'} ml={'auto'} width={'95%'} height={'80%'}>
        {isLogin == false || carts == null || carts?.data?.length == 0 ? (
          <View>
            <UI.Div>
              <UI.Div
                style={{
                  width: 200,
                  position: 'relative',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  height: 200,
                }}>
                <LottieView
                  style={{
                    height: 200,
                    width: 200,
                  }}
                  autoPlay={true}
                  loop
                  resizeMode="cover"
                  source={require('../../assets/json/animation_empty.json')}
                />
              </UI.Div>
              <UI.Div>
                <UI.Text size={18} center bold color={colors.garyMidMaxBold}>
                  Your{' '}
                  <UI.Text size={18} center bold color={colors.layoutTheme}>
                    The Mewa Shoppe
                  </UI.Text>{' '}
                  Cart is empty
                </UI.Text>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('Home')}>
                  <UI.Text
                    mt={20}
                    size={18}
                    center
                    bold
                    style={{textDecorationLine: 'underline'}}
                    color={colors.layoutTheme}>
                    Shop Now
                  </UI.Text>
                </TouchableOpacity>
              </UI.Div>
            </UI.Div>
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{marginBottom: '10%'}}>
            {/* progress bar  */}
            <View style={{height: 90}}>
              <ProgressSteps
                activeStep={0}
                completedProgressBarColor={colors.layoutTheme}
                completedStepIconColor={colors.layoutTheme}
                activeStepIconBorderColor={colors.layoutTheme}
                activeLabelColor={colors.layoutTheme}
                topOffset={15}>
                <ProgressStep
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  label="Address"></ProgressStep>
                <ProgressStep
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  label="Order Summary"></ProgressStep>
                <ProgressStep
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  label="Payment"></ProgressStep>
              </ProgressSteps>
            </View>
            <UI.Div style={styles.addBox}>
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
            </UI.Div>
            {carts?.data?.map((el, index) => (
              <UI.Div
                key={index}
                mt={30}
                mb={30}
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
                    style={{width: '20%', height: 80}}>
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `${imageUrl}${el.mediumThumbnail}`,
                      }}
                    />
                  </TouchableOpacity>
                  <UI.Div width="75%">
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductsDetails', {
                          el,
                          productId: el.productID,
                        })
                      }>
                      <UI.Text bold size={18} color={colors.layoutTheme}>
                        {el.productName}
                      </UI.Text>
                    </TouchableOpacity>
                    <UI.Text>{''}</UI.Text>
                    <UI.Div width="30%" mt={4}>
                      <StarRating
                        maxStars={5}
                        disabled={true}
                        rating={4.7}
                        starSize={16}
                        halfStarColor={colors.layoutTheme}
                        selectedStar={rating => setStar(rating)}
                        fullStarColor={colors.layoutTheme}
                      />
                    </UI.Div>
                  </UI.Div>
                </View>
                {/* price details ************* */}
                <UI.Div
                  mt={10}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}>
                  <UI.Div width="20%" style={{position: 'relative'}}>
                    <TouchableOpacity
                      style={styles.qtybox}
                      onPress={() => {
                        // setQtyDivShow(!qtyDivShow);
                        setQtyDivId({
                          productID: el.productID,
                          attributeID: el?.subAttributeID,
                        });
                        if (openQtyDivId === el.id) {
                          setOpenQtyDivId(null);
                        } else {
                          setOpenQtyDivId(el.id);
                        }
                      }}>
                      <UI.Text center size={14}>
                        QTY : {el.productQty}
                      </UI.Text>
                    </TouchableOpacity>

                    {openQtyDivId == el.id ? (
                      <View
                        style={{
                          position: 'absolute',
                          borderWidth: 1,
                          width: '100%',
                          borderColor: colors.grey,
                          top: 30,
                          backgroundColor: '#fff',
                          borderRadius: 6,
                          opacity: 1,
                          zIndex: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setOpenQtyDivId(null);
                            updateQty({
                              productID: el.productID,
                              productQty: 1,
                              subAttributeID:
                                el?.subAttributeID == 0
                                  ? null
                                  : el?.subAttributeID,
                            });
                          }}
                          key={index}
                          style={{
                            borderBottomWidth: 1,
                            borderColor: colors.grayMid,
                            paddingVertical: 6,
                          }}>
                          <UI.Text center>1</UI.Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setOpenQtyDivId(null);
                            updateQty({
                              productID: el.productID,
                              productQty: 2,
                              subAttributeID:
                                el?.subAttributeID == 0
                                  ? null
                                  : el?.subAttributeID,
                            });
                          }}
                          key={index}
                          style={{
                            borderBottomWidth: 1,
                            borderColor: colors.grayMid,
                            paddingVertical: 6,
                          }}>
                          <UI.Text center>2</UI.Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setQtyModalShow(true);
                            setOpenQtyDivId(null);
                          }}
                          style={{
                            paddingVertical: 6,
                          }}>
                          <UI.Text center> more</UI.Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </UI.Div>
                  <UI.Div
                    width="75%"
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <UI.Text color="#22c55e">
                      {calculatePercentageOff(
                        el.regularPrice,
                        el.attributePrice,
                      ) !== null &&
                        `${calculatePercentageOff(
                          el.regularPrice,
                          el.attributePrice,
                        )} %`}
                    </UI.Text>
                    <UI.Text
                      ml={6}
                      mr={6}
                      style={{
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}
                      color={colors.grayBold}>
                      ₹{el.mrp}
                    </UI.Text>
                    <UI.Text color="#000" bold>
                      ₹{el?.attributePrice}
                    </UI.Text>
                    {el.name !== null && (
                      <Text
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
                      onPress={() => handleRemoveCart(el.productID)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AntDesign
                        name="delete"
                        size={20}
                        color={colors.layoutTheme}
                      />
                      <UI.Text ml={6} center>
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
                        size={20}
                        color={colors.layoutTheme}
                      />
                      <UI.Text center> Buy this now </UI.Text>
                    </TouchableOpacity>
                  </UI.Div>
                </UI.Div>
              </UI.Div>
            ))}
            {/* Price Details  */}
            <UI.Div bg="#fff" mt={30} mb={'30%'} p={10} br={6}>
              <UI.Text bold>Price Details</UI.Text>
              <UI.Flex middle spaceb>
                <UI.Div>
                  <UI.Text mb={6}>Price ({carts?.data?.length} items)</UI.Text>
                  <UI.Text mb={6}>Discount</UI.Text>
                  <UI.Text mb={6}>Delivery Charges</UI.Text>
                </UI.Div>
                <UI.Div>
                  <UI.Text mb={6}>₹{carts?.total}</UI.Text>
                  <UI.Text mb={6} color="#22c55e">
                    -{' '}
                    {carts?.data?.reduce((accumulator, item) => {
                      const discount = item.regularPrice - item.attributePrice;
                      return accumulator + discount;
                    }, 0)}
                  </UI.Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  </View>
                </UI.Div>
              </UI.Flex>
            </UI.Div>
          </ScrollView>
        )}
      </UI.Div>

      {isLogin == false ||
      getCartLoading ||
      carts == null ||
      carts?.data?.length == 0 ? null : (
        <View
          style={{
            position: 'absolute',
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
              size={12}
              style={{
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
              }}>
              ₹{' '}
              {carts?.data?.reduce(
                (accumulator, item) => accumulator + item.regularPrice,
                0,
              )}
            </UI.Text>
            <UI.Text size={18} bold color={'#000'}>
              ₹{carts?.total}
            </UI.Text>
          </UI.Div>
          <UI.Button
            onPress={() => {
              navigation.navigate('Checkout', {data: carts?.data});
            }}
            gpb={10}
            gpt={10}
            width={'50%'}
            text="Checkout"
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={qtyModalShow}
        onRequestClose={() => {
          setQtyModalShow(!qtyModalShow);
        }}>
        <View style={styles.centeredView}>
          <UI.Div style={styles.modalView}>
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
                  borderColor: colors.grayLight,
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
                onPress={() => setQtyModalShow(!qtyModalShow)}
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
          </UI.Div>
        </View>
      </Modal>
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
    // resizeMode: 'stretch',
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
