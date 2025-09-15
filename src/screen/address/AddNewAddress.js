import React, {useRef, useEffect, useState} from 'react';
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
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {LoginBg, roundLogo, tmsLogo} from '../../Components/common/ALLImages';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  fetchAddAddress,
  fetchAddressState,
  resetAddress,
} from '../../Redux/reducerSlice/AddressSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {fonts} from '../../Components/common/CustomFonts';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {width, fontScale} = Dimensions.get('window');

const AddNewAddress = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {addAddLoading, getStateLoading, addressStatus} = useSelector(
    state => state.address,
  );
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const getState = [
    {
      label: 'Andaman and Nicobar Islands',
      value: 1,
    },
    {
      label: 'Andhra Pradesh',
      value: 2,
    },
    {
      label: 'Arunachal Pradesh',
      value: 3,
    },
    {
      label: 'Assam',
      value: 4,
    },
    {
      label: 'Bihar',
      value: 5,
    },
    {
      label: 'Chandigarh',
      value: 6,
    },
    {
      label: 'Chhattisgarh',
      value: 7,
    },
    {
      label: 'Dadra and Nagar Haveli',
      value: 8,
    },
    {
      label: 'Daman and Diu',
      value: 9,
    },
    {
      label: 'Delhi',
      value: 10,
    },
    {
      label: 'Goa',
      value: 11,
    },
    {
      label: 'Gujarat',
      value: 12,
    },
    {
      label: 'Haryana',
      value: 13,
    },
    {
      label: 'Himachal Pradesh',
      value: 14,
    },
    {
      label: 'Jammu and Kashmir',
      value: 15,
    },
    {
      label: 'Jharkhand',
      value: 16,
    },
    {
      label: 'Karnataka',
      value: 17,
    },
    {
      label: 'Kerala',
      value: 18,
    },
    {
      label: 'Lakshadweep',
      value: 19,
    },
    {
      label: 'Madhya Pradesh',
      value: 20,
    },
    {
      label: 'Maharashtra',
      value: 21,
    },
    {
      label: 'Manipur',
      value: 22,
    },
    {
      label: 'Meghalaya',
      value: 23,
    },
    {
      label: 'Mizoram',
      value: 24,
    },
    {
      label: 'Nagaland',
      value: 25,
    },
    {
      label: 'Odisha',
      value: 26,
    },
    {
      label: 'Puducherry',
      value: 27,
    },
    {
      label: 'Punjab',
      value: 28,
    },
    {
      label: 'Rajasthan',
      value: 29,
    },
    {
      label: 'Sikkim',
      value: 30,
    },
    {
      label: 'Tamil Nadu',
      value: 31,
    },
    {
      label: 'Telangana',
      value: 32,
    },
    {
      label: 'Tripura',
      value: 33,
    },
    {
      label: 'Uttar Pradesh',
      value: 34,
    },
    {
      label: 'Uttarakhand',
      value: 35,
    },
    {
      label: 'West Bengal',
      value: 36,
    },
  ];
  // const getState = [
  //   'Andaman and Nicobar Islands',
  //   'Andhra Pradesh',
  //   'Arunachal Pradesh',
  //   'Assam',
  //   'Bihar',
  //   'Chandigarh',
  //   'Chhattisgarh',
  //   'Dadra and Nagar Haveli',
  //   'Daman and Diu',
  //   'Delhi',
  //   'Goa',
  //   'Gujarat',
  //   'Haryana',
  //   'Himachal Pradesh',
  //   'Jammu and Kashmir',
  //   'Jharkhand',
  //   'Karnataka',
  //   'Kerala',
  //   'Lakshadweep',
  //   'Madhya Pradesh',
  //   'Maharashtra',
  //   'Manipur',
  //   'Meghalaya',
  //   'Mizoram',
  //   'Nagaland',
  //   'Odisha',
  //   'Puducherry',
  //   'Punjab',
  //   'Rajasthan',
  //   'Sikkim',
  //   'Tamil Nadu',
  //   'Telangana',
  //   'Tripura',
  //   'Uttar Pradesh',
  //   'Uttarakhand',
  //   'West Bengal',
  // ];
  const formattedStates = getState.map((state, index) => ({
    label: state,
    value: index + 1,
  }));

  const [state, setState] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    phone: '',
    email: '',
    newAddress: '',
    country: '',
    state: '',
    pincode: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showState, setShowState] = useState(false);
  const {profileData} = useSelector(state => state.profile);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/;

    if (formData.firstName.trim() === '') {
      errors.firstName = 'Please enter a first name.';
    }
    // if (formData.lastName.trim() === '') {
    //   errors.lastName = 'Please enter a last name.';
    // }
    if (formData.city.trim() === '') {
      errors.city = 'Please enter a city name.';
    }

    if (formData.phone.trim() === '' || !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }
    if (formData.newAddress.trim() === '') {
      errors.newAddress = 'Please enter a house no, area.';
    }
    if (formData.state.trim() === '') {
      errors.state = 'Please enter state';
    }
    if (formData.pincode.trim() === '' || !pinRegex.test(formData.pincode)) {
      errors.pincode = 'Please enter  a valid pincode.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitForVerify = () => {
    if (validateForm()) {
      const securityCode = userInfo?.data?.securityCode;
      const values = {
        data: formData,
        securityCode: securityCode,
      };
      dispatch(fetchAddAddress(values))
        .unwrap()
        .then(res => {
          if (res.isSuccess) {
            if (formData?.id) {
              toast.show('Address Updated successfully', {
                type: 'black',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in | zoom-in',
              });
            } else {
              toast.show('Address created successfully', {
                type: 'black',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in | zoom-in',
              });
            }

            setFormData({
              firstName: '',
              lastName: '',
              city: '',
              phone: '',
              email: '',
              newAddress: '',
              country: '',
              state: '',
              pincode: '',
            });

            if (props.route.params.backBtn == 1) {
              navigation.navigate('SelectAddress', {
                ...props.route.params.checkout,
              });
            } else {
              navigation.navigate('address');
            }
          } else {
          }
        });
    } else {
    }
  };

  const findValueByLabel = label => {
    const state = getState.find(item => item.label === label);
    return state ? state.value : null;
  };
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      if (props?.route?.params?.data == null) {
        setFormData({
          firstName: profileData.name !== null ? profileData?.data?.name : '',
          lastName: '',
          city: '',
          phone: profileData?.phone !== null ? profileData?.data?.phone : '',
          email: '',
          newAddress: '',
          country: '',
          state: '',
          pincode: '',
        });
      } else if (props?.route?.params?.backBtn == 1) {
        setFormData({
          firstName: profileData.name !== null ? profileData?.data?.name : '',
          lastName: '',
          city: '',
          phone: profileData?.phone !== null ? profileData?.phone?.phone : '',
          email: '',
          newAddress: '',
          country: '',
          state: '',
          pincode: '',
        });
      } else {
        setState(props?.route?.params?.data.state);
        setFormData(props?.route?.params?.data);
        const defaultValue = findValueByLabel(props?.route?.params?.data.state);

        setValue(defaultValue);
      }
    });
    return () => {
      focused();
    };
  }, [profileData]);

  return (
    <Layout showBar back comProps={props}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          // keyboardDismissMode="none"
          style={{
            flex: 1,
            width: '90%',
            marginRight: 'auto',
            marginLeft: 'auto',
          }}>
          <UI.Div mt={20}>
            {/* <UI.Div>
            <TouchableOpacity
              style={{
                backgroundColor: colors.layoutTheme,
                width: '40%',
                paddingVertical: 6,
                elevation: 4,
                borderRadius: 6,
              }}>
              <UI.Text center color="#fff" size={16}>
                Use my location
              </UI.Text>
            </TouchableOpacity>
          </UI.Div> */}

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <UI.Div mt={12} width="100%">
                <UI.Text
                  font={fonts.rm}
                  mb={4}
                  size={14 / fontScale}
                  color={colors.grayBoldMax}>
                  {/* First Name{' '} */}
                  Full Name{' '}
                  <UI.Text
                    size={14 / fontScale}
                    font={fonts.rm}
                    mb={4}
                    color={'red'}>
                    *
                  </UI.Text>
                </UI.Text>
                <TextInput
                  onChangeText={el => setFormData({...formData, firstName: el})}
                  value={formData.firstName}
                  style={style.textfield}
                />
                <UI.Text color="red" font={fonts.rr}>
                  {formErrors.firstName}
                </UI.Text>
              </UI.Div>

              {/* <UI.Div mt={12} width="48%">
                <UI.Text
                  size={14 / fontScale}
                  bold
                  mb={4}
                  color={colors.grayBoldMax}>
                  last Name{' '}
                  <UI.Text size={14 / fontScale} bold mb={4} color={'red'}>
                    *
                  </UI.Text>
                </UI.Text>
                <TextInput
                  onChangeText={el => setFormData({...formData, lastName: el})}
                  value={formData.lastName}
                  style={style.textfield}
                />
                <UI.Text size={14 / fontScale} color="red">
                  {formErrors.lastName}
                </UI.Text>
              </UI.Div> */}
            </View>
            <UI.Div mt={12} style={{zIndex: -1}}>
              <UI.Text
                size={14 / fontScale}
                font={fonts.rm}
                mb={4}
                color={colors.grayBoldMax}>
                House No, Building Name, Road name, Area{' '}
                <UI.Text
                  size={14 / fontScale}
                  font={fonts.rm}
                  mb={4}
                  color={'red'}>
                  *
                </UI.Text>
              </UI.Text>
              <UI.Div
                bg="#fff"
                style={{
                  height: 60,
                  borderWidth: 1,
                  borderColor: colors.grayMid,
                  borderRadius: 6,
                }}>
                <TextInput
                  onChangeText={el =>
                    setFormData({...formData, newAddress: el})
                  }
                  value={formData.newAddress}
                  multiline={true}
                  style={{
                    width: '100%',
                    padding: 6,
                    fontSize: 14 / fontScale,
                    fontFamily: fonts.rr,
                  }}
                />
              </UI.Div>
              <UI.Text font={fonts.rr} size={14 / fontScale} color="red">
                {formErrors.newAddress}
              </UI.Text>
            </UI.Div>

            <UI.Div mt={12} style={{zIndex: -1}}>
              <UI.Text
                size={14 / fontScale}
                font={fonts.rm}
                mb={4}
                color={colors.grayBoldMax}>
                City{' '}
                <UI.Text
                  size={14 / fontScale}
                  font={fonts.rm}
                  mb={4}
                  color={'red'}>
                  *
                </UI.Text>
              </UI.Text>
              <TextInput
                onChangeText={el => setFormData({...formData, city: el})}
                value={formData.city}
                style={style.textfield}
              />
              <UI.Text size={14 / fontScale} color="red" font={fonts.rr}>
                {formErrors.city}
              </UI.Text>
            </UI.Div>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <UI.Div mt={12} width="48%">
                <UI.Text
                  size={14 / fontScale}
                  font={fonts.rm}
                  mb={4}
                  color={colors.grayBoldMax}>
                  State{' '}
                  <UI.Text
                    size={14 / fontScale}
                    font={fonts.rm}
                    mb={4}
                    color={'red'}>
                    *
                  </UI.Text>
                </UI.Text>
                {/* <TouchableOpacity
                  style={{
                    backgroundColor: '#fff',

                    padding: 12,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: colors.grayMid,
                  }}
                  onPress={() => {
                    setShowState(!showState);
                    Keyboard.dismiss();
                  }}>
                  <UI.Text
                    font={fonts.rr}
                    line={1}
                    style={{
                      fontSize: 14 / fontScale,
                      color: '#000',
                    }}>
                    {state}
                  </UI.Text>
                </TouchableOpacity> */}
                {/* <TextInput
                  // editable={false}
                  onChangeText={el => {
                    // setState(el);
                    // dispatch(fetchAddressState(el));
                    // setFormData({...formData, state: ''});
                    setShowState(true);
                  }}
                  value={state}
                  style={style.textfield}
                /> */}
                {/* 
                {getState !== null ||
                getState?.data !== null ||
                getState?.data.length !== 0 ? ( */}
                {/* {showState && (
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={{
                      position: 'absolute',
                      top: '70%',
                      maxHeight: 200,
                      backgroundColor: '#fff',
                      zIndex: 213,
                      width: '100%',
                    }}>
                    
                    {getState?.map((el, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          setState(el);
                          setFormData({...formData, state: el});
                          setShowState(false);
                          // dispatch(resetAddress());
                        }}
                        key={index}
                        style={{
                         
                          padding: 10,
                          backgroundColor: '#fff',
                          elevation: 4,
                        }}>
                        <UI.Text
                          font={fonts.rr}
                          size={14 / fontScale}
                          color="#000">
                          {el}
                        </UI.Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )} */}
                <Dropdown
                  style={[
                    {
                      borderWidth: 1,
                      backgroundColor: '#fff',
                      borderRadius: 6,
                      height: 45,
                      borderWidth: 1,
                      borderColor: colors.grayMid,
                    },
                    isFocus && {borderColor: colors.layoutTheme},
                  ]}
                  selectedTextStyle={{
                    fontSize: 14 / fontScale,
                    marginLeft: 10,
                  }}
                  inputSearchStyle={{
                    marginLeft: 10,
                    fontFamily: fonts.rr,
                  }}
                  // iconStyle={style.iconStyle}
                  data={getState}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => {
                    Keyboard.dismiss();
                    setIsFocus(true);
                  }}
                  onBlur={() => setIsFocus(false)}
                  onChange={el => {
                    setFormData({...formData, state: el.label});
                    setValue(el.value);
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => <Text> </Text>}
                />

                {/* ) : null} */}

                <UI.Text font={fonts.rr} size={14 / fontScale} color="red">
                  {formErrors.state}
                </UI.Text>
              </UI.Div>

              <UI.Div style={{zIndex: -1}} mt={12} width="48%">
                <UI.Text
                  size={14 / fontScale}
                  font={fonts.rm}
                  mb={4}
                  color={colors.grayBoldMax}>
                  PIN code{' '}
                  <UI.Text
                    size={14 / fontScale}
                    font={fonts.rm}
                    mb={4}
                    color={'red'}>
                    *
                  </UI.Text>
                </UI.Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={el => setFormData({...formData, pincode: el})}
                  value={formData.pincode}
                  style={style.textfield}
                />
                <UI.Text font={fonts.rr} size={14 / fontScale} color="red">
                  {formErrors.pincode}
                </UI.Text>
              </UI.Div>
            </View>
            <UI.Div mt={12} style={{zIndex: -1}}>
              <UI.Text
                size={14 / fontScale}
                font={fonts.rm}
                mb={4}
                color={colors.grayBoldMax}>
                Phone number{' '}
                <UI.Text
                  size={14 / fontScale}
                  font={fonts.rm}
                  mb={4}
                  color={'red'}>
                  *
                </UI.Text>
              </UI.Text>
              <TextInput
                keyboardType="numeric"
                maxLength={10}
                onChangeText={el => setFormData({...formData, phone: el})}
                value={formData.phone}
                style={style.textfield}
              />
              <UI.Text font={fonts.rr} size={14 / fontScale} color="red">
                {formErrors.phone}
              </UI.Text>
            </UI.Div>
            <UI.Div mt={30} style={{zIndex: -1}}>
              {addAddLoading ? (
                <UI.Button
                  gpb={10}
                  gpt={10}
                  width={'80%'}
                  ml={'auto'}
                  mr={'auto'}
                  text="Loading..."
                />
              ) : (
                <UI.Button
                  onPress={() => submitForVerify()}
                  gpb={10}
                  gpt={10}
                  width={'80%'}
                  ml={'auto'}
                  mr={'auto'}
                  text="Save"
                />
              )}
            </UI.Div>
          </UI.Div>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default AddNewAddress;
const style = StyleSheet.create({
  textfield: {
    color: '#000',
    borderWidth: 1,
    width: '100%',
    height: 45,
    padding: 6,
    fontFamily: fonts.rr,
    fontSize: 14 / fontScale,
    borderRadius: 6,
    borderColor: colors.grayMid,
    backgroundColor: '#fff',
  },
});
