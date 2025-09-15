import React, {useEffect, useState, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  View,
  Pressable,
  Dimensions,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import * as UI from '../../UI/UI';
import {colors} from '../../Design';
import {
  addIsLogin,
  fetchSendOtp,
  fetchVerifyOtp,
} from '../../../Redux/reducerSlice/AuthSlice';
import {useDispatch} from 'react-redux';
import OTPTextView from 'react-native-otp-textinput';
import {useToast} from 'react-native-toast-notifications';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const ModalLogin = ({setContinueLogin, showLogin, setShowLogin}) => {
  const refRBSheet = useRef();
  const toast = useToast();
  const dispatch = useDispatch();
  let otpInput = useRef(null);
  const [fromData, setFromData] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [sentOtpLoading, setSentOtpLoading] = useState(false);
  const [otpSentDone, setOtpSentDone] = useState(false);
  const [otp, setOTP] = useState('');
  const [formOtpErrors, setFormOtpErrors] = useState({});
  const [sentVerifyOtpLoading, setSentVerifyOtpLoading] = useState(false);
  const [numberDisable, setNumberDisable] = useState(true);

  const handleInputChange = text => {
    setFromData(text);
  };
  const validateInput = value => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number format

    if (emailRegex.test(value)) {
      return 'email';
    } else if (phoneRegex.test(value)) {
      return 'phone';
    }

    return null; // Invalid
  };
  const submitForVerify = () => {
    setSentOtpLoading(true);
    const validationType = validateInput(fromData);
    if (validationType === 'email') {
      // Handle email validation and API call
      makeAPICall(fromData, null);
    } else if (validationType === 'phone') {
      // Handle phone validation and API call

      makeAPICall(null, fromData);
    } else {
      setSentOtpLoading(false);
      setFormErrors({invalid: 'Please enter either an email or phone number.'});
    }
  };

  const makeAPICall = (email, phone) => {
    setNumberDisable(false);

    const newValue = {
      email: email == null ? '' : email,
      phone: phone == null ? '' : phone,
    };

    dispatch(fetchSendOtp(newValue))
      .unwrap()
      .then(res => {
        if (res.isSuccess) {
          toast.show(`${res.message}`, {
            type: 'success',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
          setNumberDisable(true);
          setSentOtpLoading(false);
          setOtpSentDone(true);
        } else {
          setNumberDisable(true);

          toast.show(`${res.message}`, {
            type: 'error',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
          setSentOtpLoading(false);
        }
      })
      .catch(er => {
        setNumberDisable(true);
      });
  };

  // otp **************************************************
  const validateOtpForm = () => {
    const errors = {};
    if (otp.length !== 5) {
      errors.otp = 'Please enter valid OTP';
    }
    // if (emailRegex.test(gmail)) {
    // } else if (phoneRegex.test(phone)) {
    // } else {
    //   errors.gmail =
    //     'Invalid input. Please enter a valid email or phone number.';
    // }

    setFormOtpErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const submitOtpVerify = () => {
    if (validateOtpForm()) {
      setSentVerifyOtpLoading(true);
      // props.navigation.navigate('Home');
      // if (otp.length === 4) {
      //   props.navigation.navigate('Bottom');
      // }
      const newData = {
        mobile: fromData,
        otp: otp,
      };
      dispatch(fetchVerifyOtp(newData))
        .unwrap()
        .then(res => {
          if (res.isSuccess) {
            dispatch(addIsLogin(true));
            setSentVerifyOtpLoading(false);
            // setContinueLogin(true);
            toast.show(`Logged in successfully.`, {
              type: 'success',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
            setShowLogin(false);
            // props.navigation.goBack();
          } else {
            setFormOtpErrors({otp: 'Please enter correct OTP!'});
            setSentVerifyOtpLoading(false);
          }
        });
    }
  };
  const [shouldHandlePress, setShouldHandlePress] = useState(true);
  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,

        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }} // Adjust the style according to your needs
    >
      <Modal
        animationType="slide"
        transparent={true}
        animationOut="slideInDown"
        visible={showLogin}
        onRequestClose={() => {
          setShowLogin(!showLogin);
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity
            onPress={() => setShowLogin(!showLogin)}
            style={{
              backgroundColor: '',
              width: '100%',
              height: '80%',
            }}></TouchableOpacity>

          <View style={styles.modalView}>
            <UI.Flex spaceb middle>
              <UI.Div></UI.Div>
              <TouchableOpacity
                style={{marginLeft: 'auto'}}
                onPress={() => setShowLogin(!showLogin)}>
                <AntDesign name="close" size={30} color={colors.layoutTheme} />
              </TouchableOpacity>
            </UI.Flex>
            {!otpSentDone ? (
              <UI.Div>
                <UI.Text bold color={colors.grayBoldMax} size={16}>
                  Sign up to continue
                </UI.Text>
                <UI.Div mt={20}>
                  <TextInput
                    editable={numberDisable}
                    focusable={true}
                    placeholder="Email Address  / Phone Number"
                    keyboardType="email-address"
                    value={fromData}
                    onChangeText={text => handleInputChange(text)}
                    placeholderTextColor={colors.grayBold}
                    style={{
                      borderWidth: 1.8,
                      borderColor: colors.grayMid,
                      backgroundColor: colors.white,
                      borderRadius: 6,
                      height: 50,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      fontSize: 16,
                      width: '100%',
                    }}
                  />
                  <UI.Text mt={5} color="red">
                    {formErrors.invalid}
                  </UI.Text>
                </UI.Div>
                <UI.Div mt={20}>
                  {sentOtpLoading ? (
                    <UI.Button
                      size={16}
                      gpb={10}
                      gpt={10}
                      width={'100%'}
                      text={'Loading...'}
                    />
                  ) : (
                    <UI.Button
                      onPress={() => submitForVerify()}
                      size={16}
                      gpb={10}
                      gpt={10}
                      width={'100%'}
                      text={'LOGIN'}
                    />
                  )}
                </UI.Div>
              </UI.Div>
            ) : (
              <UI.Div>
                <UI.Text bold color={colors.grayBoldMax} size={16}>
                  Enter OTP, sent to {'*'.repeat(5) + fromData.slice(5)}
                </UI.Text>
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
                    width: 50,
                    height: 55,
                    marginTop: 10,
                    fontSize: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                  }}
                />
                <UI.Text color="red" center>
                  {formOtpErrors.otp}
                </UI.Text>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => {
                    otpInput.clear();
                    submitForVerify();
                  }}>
                  <UI.Text color="blue" underline>
                    Resend OTP
                  </UI.Text>
                  {sentOtpLoading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                  ) : null}
                </TouchableOpacity>

                <UI.Div mt={25}>
                  <UI.Button
                    onPress={() => submitOtpVerify()}
                    size={16}
                    gpb={10}
                    gpt={10}
                    width={'100%'}
                    text={sentVerifyOtpLoading ? 'Loading...' : 'VERIFY'}
                  />
                </UI.Div>
              </UI.Div>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,

    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    zIndex: 100,
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 300,
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

export default ModalLogin;
