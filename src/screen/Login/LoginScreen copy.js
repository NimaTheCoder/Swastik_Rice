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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as UI from '../../Components/UI/UI';
import {LoginBg, tmsLogo} from '../../Components/common/ALLImages';
import {colors} from '../../Components/Design';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSendOtp} from '../../Redux/reducerSlice/AuthSlice';
import {useToast} from 'react-native-toast-notifications';

const LoginScreen = props => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [fromData, setFromData] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [submitCount, setSubmitCount] = useState(0); // Keep track of the number of submissions

  const [formErrors, setFormErrors] = useState({});

  const {isLoading} = useSelector(state => state.login);

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
    const validationType = validateInput(fromData);
    if (validationType === 'email') {
      // Handle email validation and API call
      makeAPICall(fromData, null);
    } else if (validationType === 'phone') {
      // Handle phone validation and API call

      makeAPICall(null, fromData);
    } else {
      setFormErrors({invalid: 'Please enter either an email or phone number.'});
    }
  };

  const makeAPICall = (email, phone) => {
    // Replace this with your actual API call code

    const newValue = {
      email: email == null ? '' : email,
      phone: phone == null ? '' : phone,
    };
    dispatch(fetchSendOtp(newValue))
      .unwrap()
      .then(res => {
        if (res.isSuccess) {
          props.navigation.navigate('otp', newValue);
          toast.show(`${res.message} ${res.data}`, {
            type: 'success',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
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
  return (
    <UI.Div>
      <Image resizeMode="cover" source={LoginBg} style={styles.loginBG}></Image>
      {/* <ScrollView>
        <KeyboardAwareScrollView> */}
      <View
        style={{
          justifyContent: 'center',
          marginTop: '30%',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '90%',
          alignItems: 'center',
          // height: '0%',
        }}>
        <Image style={styles.tinyLogo} source={tmsLogo} />
        <UI.Div width="100%" mt={'30%'} mb={40}>
          <TextInput
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
              paddingHorizontal: 15,
              paddingVertical: 15,
              fontSize: 20,
              width: '100%',
            }}
          />
          <UI.Text mt={10} color="red">
            {formErrors.invalid}
          </UI.Text>
        </UI.Div>
        <UI.Div style={{width: '70%'}}>
          {isLoading ? (
            <UI.Button
              border
              pt={8}
              size={20}
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
              size={20}
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
        {/* <UI.Text center bold size={16} color={colors.grayBoldMax}>
            Or
          </UI.Text> */}
        {/* <UI.Div width="100%" mt={10} mb={40}>
            <TextInput
              keyboardType="phone-pad"
              placeholder="Phone Number"
              value={phone}
              maxLength={10}
              onChangeText={text => setPhone(text)}
              placeholderTextColor={colors.grayBold}
              style={{
                borderWidth: 1.8,
                borderColor: colors.grayMid,
                backgroundColor: colors.white,
                borderRadius: 6,
                paddingHorizontal: 15,
                paddingVertical: 15,
                fontSize: 20,
                width: '100%',
              }}
            />
            
          </UI.Div> */}
      </View>
      {/* </KeyboardAwareScrollView>
      </ScrollView> */}
    </UI.Div>
  );
};

export default LoginScreen;

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
  tinyLogo: {
    borderRadius: 12,
    width: '80%',
    height: 80,
    resizeMode: 'stretch',
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
