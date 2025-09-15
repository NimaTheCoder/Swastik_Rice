import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  TextInput,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import OTPTextView from 'react-native-otp-textinput';
import * as UI from '../../Components/UI/UI';
import {LoginBg} from '../../Components/common/ALLImages';
import {colors} from '../../Components/Design';
import {useDispatch, useSelector} from 'react-redux';
import {
  addIsLogin,
  fetchSendOtp,
  fetchVerifyOtp,
} from '../../Redux/reducerSlice/AuthSlice';
import {useToast} from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SmsRetriever from 'react-native-sms-retriever';
import SmsListener from 'react-native-android-sms-listener';
// import RNoTPVeri from 'react-native-otp-verify';  /// this is for  SMS OTP ....
import OtpAutocomplete from 'react-native-otp-autocomplete';

const OtpScreen = props => {
  const toast = useToast();
  const dispatch = useDispatch();
  let otpInput = useRef(null);
  const [otps, setOTP] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const {
    isLoading,
    isLogin,
    removeListener,
    otpVerifyLoading,
    userInfo,
    otpDetails,
  } = useSelector(state => state.login);

  const validateForm = () => {
    const errors = {};
    if (otps.length !== 5) {
      errors.otp = 'Please enter valid OTP';
    }
    // if (emailRegex.test(gmail)) {
    // } else if (phoneRegex.test(phone)) {
    // } else {
    //   errors.gmail =
    //     'Invalid input. Please enter a valid email or phone number.';
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // using methods
  // React.useEffect(() => {
  //   getHash().then(setHashFromMethod).catch(console.log);
  //   requestHint().then(setHint).catch(console.log);
  //   startOtpListener(setOtpFromMethod);
  // }, []);

  const submitVerify = () => {
    if (validateForm()) {
      // props.navigation.navigate('Home');
      // if (otp.length === 4) {
      //   props.navigation.navigate('Bottom');
      // }
      const securityCode = props.route.params.res?.securitycode;
      const newData = {
        // email: props.route.params.email,
        // mobile: props.route.params.phone,
        otp: otps,
      };
      dispatch(
        fetchVerifyOtp({
          newData,
          securityCode: securityCode,
        }),
      )
        .unwrap()
        .then(res => {
          if (res.isSuccess) {
            dispatch(addIsLogin(true));
            toast.show(`Logged in successfully`, {
              type: 'success',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
            // props.navigation.goBack();
            props.navigation.navigate('Home');
          } else {
            toast.show(`${res.message}`, {
              type: 'error',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          }
        });
    }
  };

  const resendOtp = () => {
    otpInput.clear();
    dispatch(fetchSendOtp(props.route.params.newValue))
      .unwrap()
      .then(res => {
        if (res.isSuccess) {
          toast.show(
            `${res.message} ${
              props.route.params.newValue.email == ''
                ? '*'.repeat(5) + props.route.params.newValue.phone.slice(5)
                : props.route.params.newValue.phone == '' &&
                  '*'.repeat(5) + props.route.params.newValue.email.slice(5)
            }`,
            {
              type: 'success',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            },
          );
          onSmsListenerPressed();
        } else {
          toast.show(`${res.message}`, {
            type: 'error',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
        }
      })
      .catch(er => console.log('err', err));
  };
  // useEffect(() => {
  //   RNoTPVeri.getHash({timeout: 20000})
  //     .then(hash => {
  //       console.log('hash2', hash);
  //       // use this hash in the message.
  //     })
  //     .catch(console.log);

  //   RNoTPVeri.getOtp({timeout: 20000})
  //     .then(p => RNoTPVeri.addListener(startOtpListener))
  //     .catch(er => console.log('er', er));
  // }, []);

  // const startOtpListener = message => {
  //   console.log('message', message);
  //   // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
  //   // const otpwww = /(\d{4})/g.exec(message)[1];
  // };
  const onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();

      setTimeout(() => {
        if (registered) {
          SmsRetriever.addSmsListener(event => {
            // SmsRetriever.removeSmsListener();
          });
        }
      }, 2000);
    } catch (error) {}
  };

  useEffect(() => {
    async function requestSmsPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'SMS Permission',
            message:
              'This app needs access to your SMS messages for OTP verification.',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          onSmsListenerPressed();
        } else {
          console.log('SMS permission denied');
        }
      } catch (error) {
        console.warn('Error requesting SMS permission:', error);
      }
    }

    // Call this function to request SMS permission at an appropriate time
    requestSmsPermission();
  }, []);

  return (
    <View>
      <Image resizeMode="cover" source={LoginBg} style={styles.loginBG}></Image>

      <UI.Container>
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: Platform.isPad ? '70%' : '90%',

            alignItems: 'center',
            height: '100%',
          }}>
          <OTPTextView
            autoFocus={true}
            ref={e => (otpInput = e)}
            handleTextChange={e => setOTP(e)}
            tintColor="#cf860e"
            offTintColor="#BBB"
            focusedBorderColor="#129c45"
            // defaultBorderColor="#BBB"
            containerStyle={{
              width: '100%',

              marginLeft: 'auto', // add faran mobile
              marginRight: 'auto', //add faran mobile
              alignItems: 'center',
            }}
            inputCount={5}
            textInputStyle={{
              backgroundColor: '#fff',
              width: 50, //faran  mobile
              height: 55,
              fontSize: 20,
              borderRadius: 10,
              borderWidth: 1,
            }}
          />
          <UI.Div mt={30}>
            <UI.Text color="red" center>
              {formErrors.otp}
            </UI.Text>
          </UI.Div>
          <UI.Div width="100%" mt={'10%'}>
            {otpVerifyLoading ? (
              <UI.Button
                border
                pt={10}
                size={20}
                pb={10}
                bg="#fff"
                width={'100%'}
                b={2}
                bR={6}
                bColor={colors.layoutTheme}
                text="Loading..."
              />
            ) : (
              <UI.Button
                onPress={() => submitVerify()}
                border
                pt={10}
                size={20}
                pb={10}
                bg="#fff"
                width={'100%'}
                b={2}
                bR={6}
                bColor={colors.layoutTheme}
                text="VERIFY"
              />
            )}
          </UI.Div>
          <UI.Div mt={20}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => resendOtp()}>
              <UI.Text
                color={colors.layoutTheme}
                bold
                style={{
                  textTransform: 'uppercase',
                  textDecorationLine: 'underline',
                }}>
                RESEND OTP.
              </UI.Text>
              {isLoading && <ActivityIndicator />}
            </TouchableOpacity>
          </UI.Div>
        </View>
      </UI.Container>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    width: '80%',
    maxHeight: '24%',
    borderRadius: 18,
    color: 'black',
    paddingLeft: 15,
    padding: 6,
    borderColor: 'grey',
  },
  loginBG: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
