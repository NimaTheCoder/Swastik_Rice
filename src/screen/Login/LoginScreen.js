import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import * as UI from '../../Components/UI/UI';
import {LoginBg, tmsLogo} from '../../Components/common/ALLImages';
import {colors, screen} from '../../Components/Design';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSendOtp} from '../../Redux/reducerSlice/AuthSlice';
import {useToast} from 'react-native-toast-notifications';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fonts} from '../../Components/common/CustomFonts';
// import RNoTPVeri from 'react-native-otp-verify';
const {width, fontScale} = Dimensions.get('window');
const LoginScreen = props => {
  const toast = useToast();
  const dispatch = useDispatch();
  const refInput = useRef(null); // Ref for text input
  const [isFocused, setIsFocused] = useState(false); // State to manage focus

  const [fromData, setFromData] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [submitCount, setSubmitCount] = useState(0); // Keep track of the number of submissions
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // .....................
  const [referCode, setReferCode] = useState('');

  const [showRefer, setShowRefer] = useState(false);
  const {isLoading} = useSelector(state => state.login);

  // useEffect(() => {
  //   RNoTPVeri.getHash()
  //     .then(hash => {
  //       console.log('hash2', hash);
  //       // use this hash in the message.
  //     })
  //     .catch(console.log);
  //   getOtp();
  // }, []);
  // const getOtp = () => {
  //   RNoTPVeri.getOtp()
  //     .then(p => RNoTPVeri.addListener(startOtpListener))
  //     .catch(er => console.log('er', er));
  // };

  // const startOtpListener = message => {
  //   console.log('message', message);

  // };
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
  const handleInputChange = text => {
    setFromData(text);
  };

  const submitForVerify = () => {
    setLoading(true);
    const validationType = validateInput(fromData);
    if (validationType === 'email') {
      // Handle email validation and API call
      makeAPICall(fromData, null);
    } else if (validationType === 'phone') {
      // Handle phone validation and API call

      makeAPICall(null, fromData);
    } else {
      setLoading(false);
      setFormErrors({invalid: 'Please enter either an email or phone number.'});
    }
  };

  useEffect(() => {
    setReferCode('');
    setShowRefer(false);
  }, []);

  const makeAPICall = (email, phone) => {
    // Replace this with your actual API call code
    // console.log('email, phone', email, phone);
    const newValue = {
      email: email == null ? '' : email,
      phone: phone == null ? '' : phone,
      ref: referCode, //
    };

    console.log('newValue', newValue);

    dispatch(fetchSendOtp(newValue))
      .unwrap()
      .then(res => {
        console.log('res', res);

        if (res.isSuccess) {
          setFormErrors({});
          setLoading(false);
          setReferCode('');
          props.navigation.navigate('otp', {newValue, res: res?.data});

          toast.show(
            `${res.message}  ${
              email == null
                ? '*'.repeat(5) + phone.slice(5)
                : phone == null && '*'.repeat(5) + email.slice(5)
            } `,
            {
              type: 'success',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            },
          );
        } else {
          setLoading(false);
          toast.show(`${res?.message}`, {
            type: 'error',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
        }
      })
      .catch(er => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      setFromData('');
    });
    return () => {
      focused();
    };
  }, []);

  // props.navigation.navigate('otp');
  // if (phone !== '') {
  //   dispatch(fetchSendOtp())
  //     .unwrap()
  //     .then(res => {
  //       if (res.isSuccess) {
  //         props.navigation.navigate('otp', phone);
  //         toast.show(`${res.message}`, {
  //           type: 'success',
  //                placement: 'bottom',
  //           duration: 2000,
  //           offset: 30,
  //           animationType: 'slide-in | zoom-in',
  //         });
  //       } else {
  //         toast.show(`${res.message}`, {
  //           type: 'error',
  //                placement: 'bottom',
  //           duration: 2000,
  //           offset: 30,
  //           animationType: 'slide-in | zoom-in',
  //         });
  //       }
  //     })
  //     .catch(er => console.log('err', err));
  // } else {
  //   dispatch(fetchSendOtp(gmail))
  //     .unwrap()
  //     .then(res => {
  //       if (res.isSuccess) {
  //         props.navigation.navigate('otp', gmail);
  //         toast.show(`${res.message}`, {
  //           type: 'success',
  //                placement: 'bottom',
  //           duration: 2000,
  //           offset: 30,
  //           animationType: 'slide-in | zoom-in',
  //         });
  //       } else {
  //         toast.show(`${res.message}`, {
  //           type: 'error',
  //                placement: 'bottom',
  //           duration: 2000,
  //           offset: 30,
  //           animationType: 'slide-in | zoom-in',
  //         });
  //       }
  //     })
  //     .catch(er => console.log('err', err));
  // }

  const handleButtonClick = () => {
    // Set focus to text input

    // refInput.current.focus();
    refInput.current?.focus();
  };
  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <Image
          resizeMode="cover"
          source={LoginBg}
          style={style.loginBG}></Image>
        <LinearGradient
          start={{x: 0, y: 0.8}}
          locations={[0.1, 0.9]}
          end={{x: 0.8, y: 0}}
          colors={['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.0)']}
          // style={{height: screen.h('100%') - StatusBar.currentHeight}}
          style={{height: screen.h('100%'), width: '100%'}}>
          <UI.Div style={style.container}>
            <UI.Div style={style.loginCont}>
              <UI.Div style={style.logo}>
                <Image style={style.tinyLogo} source={tmsLogo} />
              </UI.Div>

              <UI.Div style={style.form}>
                <UI.Div width="100%" mt={50}>
                  <TextInput
                    placeholder="Email Address  / Phone Number"
                    keyboardType="email-address"
                    value={fromData}
                    onChangeText={text => handleInputChange(text)}
                    placeholderTextColor={colors.grayBold}
                    autoCapitalize="none"
                    style={{
                      borderWidth: 1.8,
                      borderColor: colors.grayMid,
                      backgroundColor: colors.white,
                      borderRadius: 6,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      fontSize: 14 / fontScale,
                      fontFamily: fonts.rr,
                      width: '100%',
                    }}
                  />
                  <UI.Text
                    mt={5}
                    size={14 / fontScale}
                    font={fonts.rr}
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
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        fontSize: 14 / fontScale,
                        font: fonts.rr,
                        width: '50%',
                      }}
                    />
                  </UI.Div>
                )}
                <UI.Div mt={60} style={{width: '100%'}}>
                  {isLoading || loading ? (
                    <UI.Button
                      border
                      pt={8}
                      size={16 / fontScale}
                      pb={8}
                      bg="#fff"
                      width={'100%'}
                      b={2}
                      bR={6}
                      bColor={colors.layoutTheme}
                      text="Loading..."
                    />
                  ) : (
                    <UI.Button
                      onPress={() => submitForVerify()}
                      border
                      pt={8}
                      size={16 / fontScale}
                      pb={8}
                      bg="#fff"
                      width={'100%'}
                      b={2}
                      bR={6}
                      bColor={colors.layoutTheme}
                      text="LOGIN"
                    />
                  )}
                </UI.Div>
              </UI.Div>
              <TouchableOpacity
                onPress={() => {
                  handleButtonClick();
                  setShowRefer(!showRefer);
                }}
                style={{marginTop: '15%', padding: 6}}>
                <UI.Text
                  u
                  ml="auto"
                  mr="auto"
                  font={fonts.rr}
                  size={14 / fontScale}
                  color={colors.layoutTheme}>
                  Use a Referral Code
                </UI.Text>
              </TouchableOpacity>
            </UI.Div>
            {/* <UI.Div style={style.poweredby}>
              <UI.Text style={style.poweredbyText}>
                Powered by Rebin Infotech
              </UI.Text>
              <UI.Text
                style={{color: colors.grayMid, fontSize: 13, marginTop: 3}}>
                V-00101
              </UI.Text>
            </UI.Div> */}
            {/* V - {DeviceInfo.getVersion()} */}
          </UI.Div>
        </LinearGradient>
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={showRefer}
          onRequestClose={() => {
            setReferCode('');
            setShowRefer(!showRefer);
          }}>
          <View style={style.centeredView}>
            <UI.Div style={{height: '100%', width: '100%'}}>
              <TouchableOpacity
                onPress={() => {
                  setReferCode('');
                  setShowRefer(!showRefer);
                }}
                style={{
                  height: '50%',
                }}></TouchableOpacity>
              <UI.Div height="50%" bg="#fff" br={26}>
                <TouchableOpacity
                  style={{
                    marginLeft: 'auto',
                    padding: 20,
                  }}
                  onPress={() => {
                    setReferCode('');
                    setShowRefer(!showRefer);
                  }}>
                  <AntDesign
                    name="close"
                    size={30}
                    color={colors.layoutTheme}
                  />
                </TouchableOpacity>
                <UI.Div mt={20} width="80%" ml="auto" mr="auto">
                  <UI.Text bold size={16}>
                    Referral Code
                  </UI.Text>
                  <TextInput
                    autoCapitalize="characters"
                    placeholder="Referral Code"
                    value={referCode}
                    onChangeText={text => setReferCode(text)}
                    placeholderTextColor={colors.grayBold}
                    style={{
                      marginTop: 10,
                      borderWidth: 1.8,
                      borderColor: colors.grayMid,
                      backgroundColor: colors.white,
                      borderRadius: 6,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      fontSize: 16,
                      width: '100%',
                    }}
                  />
                  <UI.Button
                    onPress={() => {
                      setShowRefer(!showRefer);
                    }}
                    border
                    mt={'10%'}
                    pt={8}
                    size={20}
                    pb={8}
                    bg="#fff"
                    width={'100%'}
                    b={2}
                    bR={6}
                    bColor={colors.layoutTheme}
                    text="Save"
                  />
                </UI.Div>
              </UI.Div>
            </UI.Div>
          </View>
        </Modal> */}
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default LoginScreen;
const style = StyleSheet.create({
  loginBG: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tinyLogo: {
    borderRadius: 12,
    width: Platform.isPad ? '60%' : '80%',
    height: 80,
    resizeMode: 'stretch',
  },
  container: {
    minHeight: screen.h('100%'),
    width: Platform.isPad ? '85%' : '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  loginCont: {
    justifyContent: 'center',
    display: 'flex',
    minHeight: screen.h('90%'),
    width: '200%',
    paddingLeft: screen.w('60%'),
    paddingRight: screen.w('60%'),
    paddingTop: 10,
    paddingBottom: 40,
    marginLeft: '-50%',
    marginRight: 'auto',
    borderBottomEndRadius: screen.w('100%'),
    borderBottomStartRadius: screen.w('100%'),
  },

  logo: {
    flexDirection: 'row',
    height: Platform.isPad ? 200 : 100,
    width: Platform.isPad ? '90%' : '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoimager: {
    height: 80,
    width: '40%',

    resizeMode: 'contain',
  },
  logoimage: {
    height: 80,
    width: '40%',

    resizeMode: 'contain',
  },
  form: {
    marginTop: 50,
  },
  textBox: {
    color: '#000',
    padding: 15,
    width: '100%',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 50,
    fontSize: 16,
    paddingLeft: 60,
    paddingRight: 50,
    position: 'relative',
    zIndex: 1,
    marginBottom: 20,
  },
  textRed: {
    borderColor: 'red',
  },
  textBoxIcon: {
    position: 'relative',
    color: '#777',
    marginTop: -32,
    marginBottom: 20,
    top: -30,
    left: 20,
  },
  visible: {
    marginLeft: 'auto',
    marginRight: 50,
    width: 20,
    color: '#aaa',
    zIndex: 9,
    position: 'relative',
    top: -34,
  },
  btnLogin: {
    marginTop: 20,
    elevation: 2,
    borderRadius: 5,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: colors.blue,
    paddingTop: 15,
    paddingBottom: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnLoginText: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 1,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  none: {
    display: 'none',
  },
  poweredby: {
    minHeight: screen.h('17%'),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poweredbyText: {
    color: colors.grayMid,
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
