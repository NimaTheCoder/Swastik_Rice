import React, {useState, useMemo, useEffect} from 'react';
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
  Modal,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {useDispatch, useSelector} from 'react-redux';
import {imageUrl} from '../../../config';
import {useNavigation} from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  fetchAddCarts,
  fetchCarts,
  fetchRemoveCarts,
} from '../../Redux/reducerSlice/CartSlicer';
import {SkeletonLayOutProduct} from '../../Components/common/laoding/Skeleton';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {addDefaultAddress} from '../../Redux/reducerSlice/AllactionSlice';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {coupons1, coupons2} from '../../Components/common/ALLImages';
import LottieView from 'lottie-react-native';
import {
  fetchCoupon,
  updateSaveOrder,
} from '../../Redux/reducerSlice/saveOrderSlice';
import {useToast} from 'react-native-toast-notifications';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageFallback from '../../Components/common/ImageFallback';
import {fonts} from '../../Components/common/CustomFonts';
const data = ['Credit Card/ Debit Card', 'UPI', 'Wallets', 'Cash On Delivery'];

const Checkout = props => {
  const {width, fontScale} = Dimensions.get('window');
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {carts, getCartLoading} = useSelector(state => state.cart);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {fetchCouponLoading, updateSaveOrderLoading} = useSelector(
    state => state.saveOrder,
  );
  const [isFocused, setIsFocused] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentErrors, setPaymentErrors] = useState('');
  const [qtyDivID, setQtyDivId] = useState(null);
  const [qtyNumber, setQtyNumber] = useState(null);
  const [openQtyDivId, setOpenQtyDivId] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [qtyModalShow, setQtyModalShow] = useState(false);

  const [couponModalShow, setCouponModalShow] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [couponError, setCouponError] = useState(false);

  const [total, setTotal] = useState(0);
  const [arr, setArr] = useState([
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10,
  ]);
  const {address, getAddressError, getAddressLoading} = useSelector(
    state => state.address,
  );
  const [selectedId, setSelectedId] = useState();
  const {defaultAddress} = useSelector(state => state.allActionSLice);
  const [showChangeAddress, setShowChangeAddress] = useState(false);
  function calculatePercentageOff(mrp, salePrice) {
    if (mrp <= 0 || salePrice < 0) {
      return null;
    }
    const percentageOff = ((mrp - salePrice) / mrp) * 100;
    return percentageOff.toFixed(2); // Return the percentage with two decimal places
  }

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
  const handelOpenAddress = () => {
    setShowChangeAddress(!showChangeAddress);
    // const securityCode = userInfo?.data?.securityCode;
    // dispatch(fetchAddress(securityCode));
  };
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

  useEffect(() => {
    setTotal(
      props.route.params?.data?.reduce(
        (accumulator, item) => accumulator + item.attributePrice,
        0,
      ),
    );
  }, []);
  const fetchPriceCoupons = (discount, totalPrice) => {
    var discountDecimal = discount / 100;
    var discountedPrice = totalPrice * discountDecimal;

    setCouponDetails({
      discountedPrice: discountedPrice,
      couponDiscount: `${discount}%`,
    });
    setTotal(totalPrice - discountedPrice);
  };

  const fetchPriceCouponsTwo = (discount, totalPrice) => {
    setCouponDetails({
      discountedPrice: discount,
      couponDiscount: `₹${discount}`,
    });
    setTotal(totalPrice - discount);
  };
  const deleteCoupon = () => {
    setCouponError(false);
    setCoupon('');
    setCouponDetails(null);
    setTotal(
      props.route.params?.data?.reduce(
        (accumulator, item) => accumulator + item.attributePrice,
        0,
      ),
    );
  };
  const handelSubmitCoupon = () => {
    const securityCode = userInfo?.data?.securityCode;
    setLoading(true);
    setIsFocused(false);
    setCouponError(false);
    setCouponDetails(null);
    setTotal(
      props.route.params?.data?.reduce(
        (accumulator, item) => accumulator + item.attributePrice,
        0,
      ),
    );
    if (coupon.length > 3) {
      dispatch(
        fetchCoupon({
          securityCode: securityCode,
          co: coupon.trim(),
          price: total,
        }),
      )
        .unwrap()
        .then(res => {
          console.log('res--->', res);
          setLoading(false);
          if (res.isSuccess) {
            setCouponModalShow(true);
            setCouponError(false);
            if (res.data.types == 1) {
              fetchPriceCoupons(
                res.data.discount,
                props.route.params?.data?.reduce(
                  (accumulator, item) => accumulator + item.attributePrice,
                  0,
                ),
              );
            } else {
              fetchPriceCouponsTwo(
                res.data.discount,
                props.route.params?.data?.reduce(
                  (accumulator, item) => accumulator + item.attributePrice,
                  0,
                ),
              );
            }
          } else {
            setCouponError(true);
          }
        })
        .catch(err => {
          console.log('err', err);
          setLoading(false);
          setCouponError(true);
        });
    } else {
      setLoading(false);
    }
  };

  const saveOrder = () => {
    // navigation.navigate('payments');
    const values = {
      newValues: {
        custId: userInfo?.data?.id,
        orderDate: new Date(),
        total: props.route.params?.data?.reduce(
          (accumulator, item) => accumulator + item.attributePrice,
          0,
        ),
        subTotal: total.toFixed(2),
        isPaid: false,
        razorPayOrderID: '',
        razorPayPaymentID: '',
        note: '',
        cpnCode: coupon,
        shippingFee: 0,
        couponDiscount: couponDetails?.discountedPrice,
        trackOrder: 0,
        addressID: null,
        orderDetails: props.route.params?.data.map(el => {
          return {
            pid: el?.productID,
            qty: el?.productQty,
            unitPrice: el?.regularPrice,
            totalPrice: el?.attributePrice,
            variatationID: el?.subAttributeID,
          };
        }),
      },
      securityCode: userInfo?.data?.securityCode,
    };

    // dispatch(updateSaveOrder(values))
    //   .unwrap()
    //   .then(res => {
    //     if (res.isSuccess) {
    //       console.log('res', res);
    //       navigation.navigate('payments', {uri: res?.data});
    //     } else {
    //       toast.show('Something is wrong.', {
    //         type: 'black',
    //         placement: 'bottom',
    //         duration: 2000,
    //         offset: 30,

    //         animationType: 'slide-in | zoom-in',
    //       });
    //     }
    //   })
    //   .catch(err => console.log('err', err));
    navigation.navigate('SelectAddress', {values: values});
  };
  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };
  const regex = /(<([^>]+)>)/gi;
  return (
    <Layout showBar back comProps={props}>
      {couponModalShow && (
        <LottieView
          style={{
            position: 'absolute',
            borderRadius: 17,
            height: '100%',
            zIndex: 1,
            bottom: 0,
            width: '100%',
          }}
          autoPlay={true}
          loop
          resizeMode="cover"
          source={require('../../assets/json/boomm.json')}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        animationOut="slideInDown"
        visible={couponModalShow}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              margin: 20,
              borderWidth: 1,
              borderColor: colors.layoutShadow,
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 20,
              width: Platform.isPad ? '60%' : '80%',
              shadowColor: colors.layoutTheme,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 12,
            }}>
            <UI.Text
              center
              ml={'auto'}
              mr={'auto'}
              color={colors.layoutTheme}
              size={14 / fontScale}
              font={fonts.rm}
              mb={10}>
              <UI.Text color="gray" size={14 / fontScale} font={fonts.rm}>
                Using Coupon Code{' '}
                <UI.Text
                  size={14 / fontScale}
                  color={colors.lightPrice}
                  font={fonts.rm}>
                  {' '}
                  {coupon.trim()}
                </UI.Text>{' '}
                , You Have saved{' '}
              </UI.Text>
              {couponDetails?.couponDiscount}.
            </UI.Text>
            <TouchableOpacity
              style={{marginLeft: 'auto', marginRight: 'auto'}}
              onPress={() => setCouponModalShow(false)}>
              <UI.Text
                size={16 / fontScale}
                font={fonts.rm}
                style={{
                  backgroundColor: colors.layoutTheme,
                  color: '#fff',
                  textAlign: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 6,
                }}>
                Ok
              </UI.Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {loading ? (
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
                <Text font={fonts.rr} size={16 / fontScale}>
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
      <KeyboardAwareScrollView>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{
            width: '95%',
            marginRight: 'auto',
            height: '100%',
            marginLeft: 'auto',
          }}>
          {/* progress bar  */}
          <View
            style={{
              height: 100,
              borderBottomWidth: 1,

              borderBottomColor: colors.layoutTheme,
            }}>
            <ProgressSteps
              activeStep={1}
              labelFontSize={14 / fontScale}
              labelColor={colors.grayMidBold}
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
                    bColor={colors.layoutThemeLight}
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
                    bColor={colors.layoutThemeLight}
                  />
                </UI.Div>
              </UI.Flex>
            )}
          </UI.Div> */}
          {/* carts *********************************** */}

          {props.route.params?.data?.map((el, index) => (
            <UI.Div
              key={index}
              mt={20}
              bg={'#fff'}
              br={6}
              pb={40}
              pt={10}
              pl={10}
              pr={10}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '25%', height: Platform.isPad ? 150 : 80}}>
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
                </View>
                <UI.Div width="70%">
                  <UI.Text
                    cp
                    font={fonts.rm}
                    size={16 / fontScale}
                    color={colors.layoutTheme}>
                    {el.productName}
                  </UI.Text>
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
              <UI.Div
                mt={10}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <UI.Div width="20%" style={{position: 'relative', zIndex: 1}}>
                  <TouchableOpacity style={styles.qtybox}>
                    <UI.Text font={fonts.rr} center size={14 / fontScale}>
                      QTY : {el.productQty}
                    </UI.Text>
                  </TouchableOpacity>
                  <UI.Div></UI.Div>
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
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setOpenQtyDivId(null);
                          updateQty({
                            productID: el.productID,
                            productQty: 1,
                          });
                        }}
                        key={index}
                        style={{
                          borderBottomWidth: 1,
                          borderColor: colors.grayMid,
                          paddingVertical: 6,
                        }}>
                        <UI.Text font={fonts.rr} center>
                          1
                        </UI.Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setOpenQtyDivId(null);
                          updateQty({
                            productID: el.productID,
                            productQty: 2,
                          });
                        }}
                        key={index}
                        style={{
                          borderBottomWidth: 1,
                          borderColor: colors.grayMid,
                          paddingVertical: 6,
                        }}>
                        <UI.Text font={fonts.rr} center>
                          2
                        </UI.Text>
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
                  width="70%"
                  style={{flexDirection: 'row', alignItems: 'center'}}>
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

                    {/* {calculatePercentageOff(
                      el.regularPrice,
                      el.attributePrice,
                    ) !== null &&
                      `${calculatePercentageOff(
                        el.regularPrice,
                        el.attributePrice,
                      )} %`} */}
                  </UI.Text>
                  <UI.Text
                    ml={6}
                    font={fonts.rr}
                    mr={6}
                    size={14 / fontScale}
                    style={{
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    }}
                    color={colors.lightPrice}>
                    {el?.attributePrice == el.regularPrice
                      ? ''
                      : `₹${el.regularPrice}`}
                  </UI.Text>
                  <UI.Text
                    size={14 / fontScale}
                    font={fonts.rm}
                    color={colors.darkPrice}>
                    ₹{el?.attributePrice}
                  </UI.Text>
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
            </UI.Div>
          ))}
          {/* coupon code*/}

          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              style={{flex: 1}}
              keyboardShouldPersistTaps="handled">
              <UI.Div mt={'5%'}>
                <UI.Flex>
                  <UI.Div width={'10%'} mt={10} height={30}>
                    <Image style={styles.coupons} source={coupons2} />
                    {/* <AntDesign name="close" size={30} color={colors.layoutTheme} /> */}
                  </UI.Div>
                  <UI.Div
                    width={'60%'}
                    height={60}
                    // style={{borderWidth: 1}}
                    ml={4}>
                    {coupon && (
                      <TouchableOpacity
                        onPress={() => deleteCoupon()}
                        style={{
                          position: 'absolute',
                          zIndex: 12,
                          right: 4,

                          top: 8,
                          borderRadius: 50,
                          backgroundColor: colors.grayLight,
                          padding: 5,
                        }}>
                        <AntDesign
                          name="close"
                          size={20}
                          color={colors.layoutTheme}
                        />
                      </TouchableOpacity>
                    )}
                    <TextInput
                      autoCapitalize="characters"
                      placeholder="Use Coupons"
                      value={coupon}
                      onChangeText={text => setCoupon(text)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholderTextColor={colors.layoutThemeLight}
                      style={{
                        fontFamily: fonts.rr,
                        padding: 8,
                        // height: '100%',
                        width: '100%',
                        borderWidth: 1,
                        borderColor: colors.grayMid,
                        backgroundColor: '#ffff',
                        borderRadius: 6,
                        fontSize: 14 / fontScale,
                      }}
                    />
                    <UI.Text font={fonts.rr} size={14 / fontScale} color="red">
                      {couponError && `Coupon code is not valid.`}
                    </UI.Text>
                  </UI.Div>

                  <UI.Div mt={4} width={'30%'}>
                    <UI.Button
                      onPress={() => {
                        handelSubmitCoupon();
                      }}
                      o={0.6}
                      border
                      pt={8}
                      size={14 / fontScale}
                      pb={8}
                      bg="#fff"
                      width={'80%'}
                      ml={'auto'}
                      mr="auto"
                      b={2}
                      bR={6}
                      text="Apply"
                      bColor={colors.layoutThemeLight}
                    />
                  </UI.Div>
                </UI.Flex>
              </UI.Div>
            </KeyboardAvoidingView>
          </ScrollView>

          {/* Price Details  */}
          <UI.Div bg="#fff" mt={20} mb={'30%'} p={10} br={6}>
            <UI.Text size={14 / fontScale} font={fonts.rm}>
              Price Details
            </UI.Text>
            <UI.Flex middle spaceb>
              <UI.Div>
                <UI.Text font={fonts.rr} size={14 / fontScale} mb={6}>
                  Price ( {props.route.params?.data?.length} items)
                </UI.Text>
                <UI.Text font={fonts.rr} size={14 / fontScale} mb={6}>
                  Discount
                </UI.Text>
                {couponDetails && (
                  <UI.Text font={fonts.rr} size={14 / fontScale} mb={6}>
                    Offer
                  </UI.Text>
                )}
                {/* Delivery Charges*/}
                {/* <UI.Text mb={6}>Delivery Charges</UI.Text> */}
              </UI.Div>
              <UI.Div>
                <UI.Text font={fonts.rr} size={14 / fontScale} mb={6}>
                  ₹
                  {props.route.params?.data
                    ?.reduce(
                      (accumulator, item) => accumulator + item.attributePrice,
                      0,
                    )
                    .toFixed(2)}
                </UI.Text>
                <UI.Text
                  font={fonts.rr}
                  size={14 / fontScale}
                  mb={6}
                  color="#22c55e">
                  - ₹{' '}
                  {props.route.params?.data
                    ?.reduce((accumulator, item) => {
                      const discount = item.regularPrice - item.attributePrice;
                      return accumulator + discount;
                    }, 0)
                    .toFixed(2)}
                </UI.Text>
                {couponDetails && (
                  <UI.Text
                    font={fonts.rr}
                    size={14 / fontScale}
                    mb={6}
                    color="#22c55e">
                    - ₹ {couponDetails?.discountedPrice.toFixed(2)}
                  </UI.Text>
                )}
                {/* Delivery Charges*/}
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
      </KeyboardAwareScrollView>
      {/* {getCartLoading || carts == null || carts?.data?.length == 0 ? null : ( */}
      {Platform.OS == 'ios' ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: '0%',
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
              {props.route.params?.data
                ?.reduce(
                  (accumulator, item) => accumulator + item.regularPrice,
                  0,
                )
                .toFixed(2)}
            </UI.Text>
            <UI.Text font={fonts.rm} size={16 / fontScale} color={'#000'}>
              ₹{total?.toFixed(2)}
            </UI.Text>
          </UI.Div>
          <UI.Button
            onPress={() => saveOrder()}
            gpb={14}
            gpt={14}
            width={'60%'}
            text="Continue"
          />
        </View>
      ) : (
        <UI.Div>
          {/* {!isFocused && ( */}
          <View
            style={{
              // position: 'absolute',
              width: '100%',
              bottom: '0%',
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
                {props.route.params?.data?.reduce(
                  (accumulator, item) => accumulator + item.regularPrice,
                  0,
                )}
              </UI.Text>
              <UI.Text size={16 / fontScale} font={fonts.rm} color={'#000'}>
                ₹{total?.toFixed(2)}
              </UI.Text>
            </UI.Div>
            <UI.Button
              onPress={() => saveOrder()}
              gpb={14}
              gpt={14}
              width={'60%'}
              text="Continue"
            />
          </View>
          {/* )} */}
        </UI.Div>
      )}
      {/* )} */}
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
              <UI.Text size={14 / fontScale} font={fonts.rm} color={'#000'}>
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
                  fontFamily: fonts.rr,
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
                <UI.Text font={fonts.rr} center>
                  CANCEL
                </UI.Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateMoreQty()}
                style={{
                  padding: 8,
                  width: '50%',
                }}>
                <UI.Text font={fonts.rr} center>
                  APPLY
                </UI.Text>
              </TouchableOpacity>
            </UI.Flex>
          </UI.Div>
        </View>
      </Modal>
    </Layout>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#f7a824',
    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 10,
  },
  tinyLogo: {
    resizeMode: 'contain',
    // resizeMode: 'stretch',
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  coupons: {
    width: '100%',
    resizeMode: 'cover',
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
  loginBG: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  oderImg: {
    borderRadius: 10,
    width: '100%',
    height: '70%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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

const demoData = [
  {
    title: 'collections',
    data: [
      {
        clinicName: 'Affordable Dentist Near Me - Dallas',
        childData: [
          {
            provName: 'Affordable Dentist Near Me Dallas , PLLC.',
            collections: 4152.16,
          },
          {
            provName: 'Charles Kim',
            collections: 4152.16,
          },
          {
            provName: 'Gefei Wang',
            collections: 56.36,
          },
          {
            provName: 'Madison Jenkins',
            collections: 20621.84,
          },
        ],
      },
      {
        clinicName: 'Affordable Dentist Near Me - Grand Prairie',
        childData: [
          {
            provName: 'Affordable Dentist Near Me in Grand Prairie',
            collections: 4152.16,
          },
          {
            provName: 'Angela Dinh',
            collections: 4152.16,
          },
          {
            provName: 'Christine Nguyen',
            collections: 56.36,
          },
          {
            provName: 'Divya Gulati',
            collections: 20621.84,
          },
          {
            provName: 'Elvis Le',
            collections: 4152.16,
          },
          {
            provName: 'Gefei Wang',
            collections: 4152.16,
          },
          {
            provName: 'Ramya Chigurupati',
            collections: 56.36,
          },
        ],
      },
    ],
  },
];
