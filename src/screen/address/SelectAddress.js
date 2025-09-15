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
  Modal,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAddress} from '../../Redux/reducerSlice/AddressSlice';
import {useNavigation} from '@react-navigation/native';
import {addDefaultAddress} from '../../Redux/reducerSlice/AllactionSlice';
import LottieView from 'lottie-react-native';
import DataNotFound from '../../Components/common/laoding/DataNotFound';
import {useToast} from 'react-native-toast-notifications';
import {updateSaveOrder} from '../../Redux/reducerSlice/saveOrderSlice';
import {fonts} from '../../Components/common/CustomFonts';

const SelectAddress = props => {
  const {width, fontScale} = Dimensions.get('window');
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {address, getAddressLoading} = useSelector(state => state.address);
  const [refreshing, setRefreshing] = useState(false);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const [loading, setLoading] = useState(false);
  const {defaultAddress} = useSelector(state => state.allActionSLice);

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      const securityCode = userInfo?.data?.securityCode;
      console.log(
        'securityCode SelectAddress==================>',
        securityCode,
      );
      dispatch(fetchAddress(securityCode))
        .unwrap()
        .then(res => {
          if (res?.length == 0) {
            dispatch(addDefaultAddress(null));
          }
        });
    });
    return () => {
      focused();
    };
  }, []);

  useEffect(() => {
    if (
      (defaultAddress == undefined || defaultAddress == null) &&
      address?.length !== 0
    ) {
      const deafult = address?.find((el, index) => index == 0);
      dispatch(addDefaultAddress(deafult));
    }
  }, [address]);

  const onRefresh = () => {
    setRefreshing(true);
    const securityCode = userInfo?.data?.securityCode;
    dispatch(fetchAddress(securityCode))
      .unwrap()
      .then(res => {
        if (res?.length == 0) {
          dispatch(addDefaultAddress(null));
        }
      });
    setRefreshing(false);
  };

  const selectDefaultAddress = el => {
    dispatch(addDefaultAddress(el));
  };
  const checkoutValidation = () => {
    toast.hideAll();

    if (address.length == 0) {
      toast.show('Please add address.', {
        type: 'black',
        placement: 'bottom',
        duration: 2000,
        offset: 50,
        animationType: 'slide-in | zoom-in',
      });
    } else {
      toast.show('Please select address.', {
        type: 'black',
        placement: 'bottom',
        duration: 2000,
        offset: 30,

        animationType: 'slide-in | zoom-in',
      });
    }
  };
  const onSubmitData = () => {
    // setLoading(true);
    let newObject = {
      ...props.route.params?.values,
      newValues: {
        ...props.route.params.values.newValues,
        addressID: defaultAddress?.id,
      },
    };

    console.log('newObject---------->', newObject);
    dispatch(updateSaveOrder(newObject))
      .unwrap()
      .then(res => {
        setLoading(false);
        if (res.isSuccess) {
          navigation.navigate('payments', {uri: res?.data, details: newObject});
        } else {
          toast.show('Something is wrong.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
        }
      })
      .catch(err => {
        setLoading(false);
      });
  };
  return (
    <Layout showBar back comProps={props}>
      {getAddressLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: colors.white,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.layoutTheme} />
        </View>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
          position: 'relative',
          height: '100%',
          width: '95%',
          marginRight: 'auto',
          height: '100%',
          marginLeft: 'auto',
        }}>
        <View
          style={{
            height: 100,
            borderBottomWidth: 1,
            borderBottomColor: colors.layoutTheme,
          }}>
          <ProgressSteps
            activeStep={2}
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
        {/* select address ******************************* */}
        <UI.Flex>
          <UI.Div width="60%"></UI.Div>
          <UI.Div width="40%">
            <UI.Button
              onPress={() =>
                navigation.navigate('addNewAddress', {
                  backBtn: 1,
                  checkout: props.route.params,
                  data: null,
                })
              }
              border
              pt={8}
              size={14 / fontScale}
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
        <UI.Div>
          {address == null || address?.length == 0 ? (
            <UI.Div
              br={10}
              style={{
                width: '80%',
                position: 'relative',
                height: 400,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <LottieView
                style={{
                  borderRadius: 17,
                  height: 200,
                  width: '60%',
                }}
                autoPlay={true}
                loop
                resizeMode="cover"
                source={require('../../assets/json/Data_not_found.json')}
              />
              <UI.Text
                size={16 / fontScale}
                center
                font={fonts.rm}
                mt={50}
                color={colors.layoutTheme}>
                Address not found!
              </UI.Text>
            </UI.Div>
          ) : (
            <UI.Div mt={20} width="90%" ml="auto" mr="auto">
              {address?.map((el, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectDefaultAddress(el)}
                  activeOpacity={0.6}
                  style={{
                    borderWidth: 2,
                    borderColor:
                      defaultAddress?.id === el.id
                        ? colors.layoutTheme
                        : colors.grayBold,
                    marginVertical: 10,
                    // height: 160,
                    borderRadius: 6,
                    paddingVertical: 6,
                    elevation: 4,
                    backgroundColor: '#fff',
                  }}>
                  <UI.Flex middle>
                    <UI.Div width="90%">
                      <UI.Div pl={6}>
                        <UI.Div
                          mb={4}
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <UI.Text
                            font={fonts.rm}
                            style={{textTransform: 'capitalize'}}
                            size={16 / fontScale}>
                            {el.firstName} {el.lastName}
                          </UI.Text>
                        </UI.Div>
                        <UI.Text font={fonts.rr} size={14 / fontScale}>
                          {el.state},
                        </UI.Text>
                        <UI.Text font={fonts.rr} size={14 / fontScale}>
                          {el.city},{el.pincode}
                        </UI.Text>
                        <UI.Text
                          font={fonts.rr}
                          size={14 / fontScale}></UI.Text>
                        <UI.Text font={fonts.rr} size={14 / fontScale}>
                          Mobile: {el.phone}
                        </UI.Text>
                      </UI.Div>
                    </UI.Div>
                    <UI.Div width="10%">
                      <AntDesign
                        name="checkcircle"
                        size={25}
                        color={
                          defaultAddress?.id === el.id
                            ? colors.layoutTheme
                            : colors.grayBold
                        }
                      />
                    </UI.Div>
                  </UI.Flex>
                </TouchableOpacity>
              ))}
            </UI.Div>
          )}
        </UI.Div>
      </ScrollView>
      {address?.length == 0 ||
      address == null ||
      defaultAddress == undefined ? (
        <View
          style={{
            width: '100%',
            // bottom: '0%',
            elevation: 10,
            paddingVertical: 20,
            alignItems: 'center',
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
          }}>
          <UI.Div></UI.Div>
          <UI.Button
            onPress={() => checkoutValidation()}
            gpb={14}
            gpt={14}
            size={16 / fontScale}
            width={'60%'}
            text="Continue"
          />
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            // bottom: '0%',
            elevation: 10,
            paddingVertical: 20,
            alignItems: 'center',
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
          }}>
          <UI.Div></UI.Div>
          {loading ? (
            <UI.Button
              gpb={14}
              gpt={14}
              size={16 / fontScale}
              width={'60%'}
              text="Loading..."
            />
          ) : (
            <UI.Button
              onPress={() => onSubmitData()}
              gpb={14}
              size={16 / fontScale}
              gpt={14}
              width={'60%'}
              text="Continue"
            />
          )}
        </View>
      )}
    </Layout>
  );
};

export default SelectAddress;
