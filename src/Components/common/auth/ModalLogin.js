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
import {fonts} from '../CustomFonts';
const ModalLogin = ({setContinueLogin, showLogin, setShowLogin}) => {
  const {width, fontScale} = Dimensions.get('window');
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
  const [securityCode, setSecurityCode] = useState('');
  // ..............
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const [dataCall, setDataCall] = useState({email: '', mobile: ''});
  const [referCode, setReferCode] = useState('');
  const refInput = useRef(null); // Ref for text input
  const [showRefer, setShowRefer] = useState(false);
  // ........... resend otp
  const [timer, setTimer] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            setDisabled(false);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOTP = () => {
    setTimer(60);
    setDisabled(true);
  };

  //.........resend otp end

  const handleInputChange = text => {
    setFromData(text);
  };
  useEffect(() => {
    setReferCode('');
    setShowRefer(false);
  }, []);
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
      setDataCall({email: fromData, mobile: ''});
      makeAPICall(fromData, null);
    } else if (validationType === 'phone') {
      // Handle phone validation and API call
      setDataCall({email: '', mobile: fromData});
      makeAPICall(null, fromData);
    } else {
      setSentOtpLoading(false);
      setFormErrors({invalid: 'Please enter either an email or phone number.'});
    }
  };

  const makeAPICall = (email, phone) => {
    setNumberDisable(false);
    setFormErrors({invalid: ''});
    const newValue = {
      email: email == null ? '' : email,
      phone: phone == null ? '' : phone,
      ref: referCode,
    };

    console.log('newValue', newValue);

    dispatch(fetchSendOtp(newValue))
      .unwrap()
      .then(res => {
        if (res.isSuccess) {
          handleResendOTP();
          setSecurityCode(res?.data?.securitycode);
          toast.show(`${res.message}`, {
            type: 'success',
            placement: 'top',
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
            placement: 'top',
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
  const validateOtpForm = e => {
    const errors = {};
    if (e === undefined ? otp.length !== 5 : e.length !== 5) {
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

  const submitOtpVerify = e => {
    if (validateOtpForm(e)) {
      setSentVerifyOtpLoading(true);
      // props.navigation.navigate('Home');
      // if (otp.length === 4) {
      //   props.navigation.navigate('Bottom');
      // }
      const newData = {
        referralCode: referCode,
        email: dataCall?.email,
        mobile: dataCall?.mobile,
        otp: e === undefined ? otp : e,
      };

      console.log('newData', newData);

      dispatch(fetchVerifyOtp({newData, securityCode}))
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
            setDataCall({email: '', mobile: ''});
            setMobile('');
            setEmail('');

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
  const handleButtonClick = () => {
    // Set focus to text input
    // refInput.current.focus();
    refInput.current?.focus();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      animationOut="slideInDown"
      visible={showLogin}
      onRequestClose={() => {
        setShowLogin(!showLogin);
      }}>
      <View style={styles.centeredViewX}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flex: 1, justifyContent: 'flex-end'}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalView]}>
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
                <UI.Text
                  font={fonts.rm}
                  color={colors.grayBoldMax}
                  size={16 / fontScale}>
                  Sign up to continue
                </UI.Text>
                <UI.Div mt={20}>
                  <TextInput
                    editable={numberDisable}
                    focusable={true}
                    placeholder="Email Address  / Phone Number"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={fromData}
                    onChangeText={text => {
                      handleInputChange(text);
                    }}
                    placeholderTextColor={colors.grayBold}
                    style={{
                      fontFamily: fonts.rr,
                      borderWidth: 1.8,
                      borderColor: colors.grayMid,
                      backgroundColor: colors.white,
                      borderRadius: 6,
                      height: 50,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      fontSize: 14 / fontScale,
                      width: '100%',
                    }}
                  />
                  <UI.Text
                    font={fonts.rr}
                    size={12 / fontScale}
                    mt={2}
                    color="red">
                    {formErrors.invalid}
                  </UI.Text>
                </UI.Div>
                {showRefer && (
                  <UI.Div mt={12}>
                    <UI.Text
                      ml="auto"
                      mr="auto"
                      font={fonts.rm}
                      mb={8}
                      size={14 / fontScale}>
                      Referral Code
                    </UI.Text>
                    <TextInput
                      ref={refInput} //
                      autoFocus={true}
                      autoCapitalize="characters"
                      placeholder="Referral Code"
                      value={referCode}
                      onChangeText={text => setReferCode(text)}
                      placeholderTextColor={colors.grayBold}
                      style={{
                        borderBottomWidth: 1.8,
                        borderColor: colors.grayMid,
                        backgroundColor: colors.white,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center',
                        borderRadius: 6,
                        fontFamily: fonts.rr,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        fontSize: 14 / fontScale,
                        width: '50%',
                      }}
                    />
                  </UI.Div>
                )}
                <TouchableOpacity
                  onPress={() => {
                    handleButtonClick();
                    setShowRefer(!showRefer);
                  }}
                  style={{padding: 2, marginTop: 10}}>
                  <UI.Text
                    font={fonts.rr}
                    size={14 / fontScale}
                    color={colors.layoutTheme}>
                    Use a Referral Code
                  </UI.Text>
                </TouchableOpacity>
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
                <UI.Text
                  font={fonts.rm}
                  color={colors.grayBoldMax}
                  size={14 / fontScale}>
                  Enter OTP, sent to {'*'.repeat(5) + fromData.slice(5)}
                </UI.Text>
                <OTPTextView
                  autoFocus={true}
                  ref={e => (otpInput = e)}
                  handleTextChange={e => {
                    setOTP(e);
                    if (e.length == 5) {
                      submitOtpVerify(e);
                    }
                  }}
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
                    fontFamily: fonts.rr,
                    fontSize: 16 / fontScale,
                    borderRadius: 10,
                    borderWidth: 1,
                  }}
                />
                <UI.Text font={fonts.rr} size={13} color="red" center>
                  {formOtpErrors.otp}
                </UI.Text>

                <TouchableOpacity
                  disabled={disabled}
                  style={{flexDirection: 'row', marginTop: 20}}
                  onPress={() => {
                    otpInput.clear();
                    submitForVerify();
                  }}>
                  {disabled ? (
                    <UI.Text
                      color={disabled ? colors.grayBold : 'blue'}
                      underline
                      font={fonts.rr}>
                      Resend OTP in 00 : {timer}
                    </UI.Text>
                  ) : (
                    <UI.Text font={fonts.rr} color="blue" underline>
                      Resend OTP
                    </UI.Text>
                  )}

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
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredViewX: {
    flex: 1,
    // justifyContent: 'flex-end',
    // height: '100%',
    // borderWidth: 2,
    // borderColor: 'red',
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    // height: showRefer ? 200 : 200,
    padding: 20,
    zIndex: 100,
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingHorizontal: 20,
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
