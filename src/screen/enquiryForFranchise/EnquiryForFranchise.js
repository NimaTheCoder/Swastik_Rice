import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  BackHandler,
  PixelRatio,
  TextInput,
  Linking,
} from 'react-native';
import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {AddInquiry} from '../../Redux/reducerSlice/InquirySlice';
import {fonts} from '../../Components/common/CustomFonts';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EnquiryForFranchise = props => {
  const {width, fontScale} = Dimensions.get('window');
  const dispatch = useDispatch();
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    LastName: '',
    Mobile: '',
    address: '',
    ownRented: 'Own',
    locationLandmark: '',
    investment: '',
    experience: '',
  });
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOwnRented, setShowOwnRented] = useState(false);
  const [showFoodIndustry, setShowFoodIndustry] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState('1');
  const [isFocusFood, setIsFocusFood] = useState(false);
  const [valueFood, setValueFood] = useState(null);
  const refInput = useRef(null); // Ref for text input
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
  const ifFoodIndustry = [
    {label: 'Yes', value: '1'},
    {label: 'No', value: '2'},
  ];
  const ifRentedProperty = [
    {label: 'Own', value: '1'},
    {label: 'Rented', value: '2'},
  ];
  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const errors = {};
    if (formData.firstName.trim() === '') {
      errors.firstName = 'Please enter a valid first name.';
    }
    if (formData.LastName.trim() === '') {
      errors.LastName = 'Please enter a valid last name.';
    }
    // if (formData.Mobile === '' || !phoneRegex.test(formData.Mobile)) {
    //   errors.Mobile = 'Please enter a valid phone number.';
    // }
    const validationType = validateInput(formData.Mobile);

    if (validationType === 'email') {
      // Handle email validation and API call
    } else if (validationType === 'phone') {
      // Handle phone validation and API call
    } else {
      errors.Mobile = 'Please enter either an email or phone number.';
    }
    if (formData.address.trim() === '') {
      errors.address = 'Please enter a valid address.';
    }
    if (formData.ownRented.trim() === '') {
      errors.ownRented = 'Please enter a valid Own / Rented.';
    }
    if (formData.locationLandmark.trim() === '') {
      errors.locationLandmark = 'Please enter a valid landmark.';
    }
    if (formData.investment.trim() === '') {
      errors.investment = 'Please enter a valid investment.';
    }

    if (formData.experience.trim() === '') {
      errors.experience = 'Please enter a valid experience .';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      setFormErrors({});
      refInput.current?.focus();
      setLoading(false);
      setFormData({
        firstName: '',
        LastName: '',
        address: '',
        ownRented: 'Own',
        locationLandmark: '',
        investment: '',
        experience: '',
        Mobile: '',
      });
    });
    return () => {
      focused();
    };
  }, []);

  const submitToContactUs = () => {
    if (validateForm()) {
      setLoading(true);
      const securityCode = userInfo?.data?.securityCode;
      const values = {
        data: formData,
        // securityCode: securityCode,
      };
      dispatch(AddInquiry(values))
        .unwrap()
        .then(res => {
          setLoading(false);
          if (res.isSuccess) {
            setLoading(false);
            toast.show('Your response has been sent successfully.', {
              type: 'black',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
            setFormData({
              firstName: '',
              LastName: '',
              address: '',
              ownRented: 'Own',
              locationLandmark: '',
              investment: '',
              experience: '',
              Mobile: '',
            });
          } else {
            toast.show('Something is wrong.', {
              type: 'black',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
            setLoading(false);
          }
        })
        .catch(err => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  return (
    <Layout showBar back Dra comProps={props}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <UI.Div
            mt={'5%'}
            width={Platform.isPad ? '90%' : '95%'}
            mr={'auto'}
            ml={'auto'}>
            <UI.Text
              size={18 / fontScale}
              color={colors.layoutTheme}
              font={fonts.rm}
              mr={'auto'}
              ml={'auto'}>
              The Mewa Shoppe Franchise Form:
            </UI.Text>
            <UI.Text
              mr={'auto'}
              ml={'auto'}
              font={fonts.rr}
              style={{
                width: '100%',
                fontSize: 14 / fontScale,

                textAlign: 'justify',
              }}>
              Embark on a lucrative journey with The Mewa Shoppe – a blend of
              affordability and premium quality. Elevate your entrepreneurial
              spirit by becoming a franchisee. Join us in sharing the richness
              of our premium dry fruits with discerning customers. Seize the
              opportunity to own a slice of success. Fill the form and let
              prosperity unfold!
            </UI.Text>

            <UI.Div
              style={{elevation: 2}}
              mt={30}
              bg="#fff"
              p={6}
              pb={15}
              mb={20}
              br={6}>
              <UI.Flex spaceb mt={10}>
                <UI.Div width="48%">
                  <UI.Text font={fonts.rm} mb={5} size={16 / fontScale}>
                    First Name
                  </UI.Text>
                  <TextInput
                    ref={refInput}
                    value={formData.firstName}
                    onChangeText={ex =>
                      setFormData({...formData, firstName: ex})
                    }
                    autoFocus={true}
                    placeholder=""
                    placeholderTextColor={colors.grayBoldMax}
                    style={{
                      fontFamily: fonts.rr,
                      fontSize: 14 / fontScale,
                      borderColor: colors.grayMid,
                      width: '100%',
                      borderWidth: 1,
                      borderRadius: 6,
                      height: 45,
                      padding: 10,
                    }}
                  />
                  <UI.Text
                    font={fonts.rr}
                    color="#f87171"
                    size={14 / fontScale}>
                    {formErrors.firstName}
                  </UI.Text>
                </UI.Div>
                <UI.Div width="48%">
                  <UI.Text font={fonts.rm} mb={5} size={16 / fontScale}>
                    Last Name
                  </UI.Text>
                  <TextInput
                    value={formData.LastName}
                    onChangeText={ex =>
                      setFormData({...formData, LastName: ex})
                    }
                    placeholder=""
                    placeholderTextColor={colors.grayBoldMax}
                    style={{
                      fontFamily: fonts.rr,
                      fontSize: 14 / fontScale,
                      borderColor: colors.grayMid,
                      width: '100%',
                      borderWidth: 1,
                      borderRadius: 6,
                      height: 45,
                      padding: 10,
                    }}
                  />
                  <UI.Text
                    font={fonts.rr}
                    color="#f87171"
                    size={14 / fontScale}>
                    {formErrors.LastName}
                  </UI.Text>
                </UI.Div>
              </UI.Flex>
              <UI.Flex spaceb>
                <UI.Div width="100%">
                  <UI.Text font={fonts.rm} mb={5} size={16 / fontScale}>
                    Phone Number / Email Address{' '}
                  </UI.Text>
                  <TextInput
                    value={formData.Mobile}
                    onChangeText={ex => setFormData({...formData, Mobile: ex})}
                    placeholder=""
                    placeholderTextColor={colors.grayBoldMax}
                    style={{
                      fontFamily: fonts.rr,
                      fontSize: 14 / fontScale,
                      borderColor: colors.grayMid,
                      width: '100%',
                      borderWidth: 1,
                      borderRadius: 6,
                      height: 45,
                      padding: 10,
                    }}
                  />
                  <UI.Text
                    font={fonts.rr}
                    color="#f87171"
                    size={14 / fontScale}>
                    {formErrors.Mobile}
                  </UI.Text>
                </UI.Div>
              </UI.Flex>
              <UI.Flex spaceb column>
                <UI.Text font={fonts.rm} mb={5} size={16 / fontScale}>
                  Address
                </UI.Text>
                <UI.Div
                  style={{
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: colors.grayMid,
                  }}
                  width="100%"
                  height={80}
                  mr={'auto'}
                  ml={'auto'}>
                  <TextInput
                    value={formData.address}
                    onChangeText={ex => setFormData({...formData, address: ex})}
                    placeholder=""
                    placeholderTextColor={colors.grayBoldMax}
                    multiline
                    // maxLength={40}
                    style={{
                      fontFamily: fonts.rr,
                      color: '#000',
                      padding: 6,
                      maxHeight: '100%',
                      fontSize: 14 / fontScale,
                    }}
                  />
                </UI.Div>
                <UI.Text font={fonts.rr} color="#f87171" size={14 / fontScale}>
                  {formErrors.address}
                </UI.Text>
              </UI.Flex>

              <UI.Flex spaceb>
                <UI.Div width="100%">
                  <UI.Text mb={5} font={fonts.rm} size={16 / fontScale}>
                    Do you have own / rented property?
                  </UI.Text>
                  {/* <TouchableOpacity
                    onPress={() => setShowOwnRented(!showOwnRented)}>
                    <View
                      height={50}
                      style={{
                        borderWidth: 1,
                        borderColor: colors.grayMid,
                        borderRadius: 6,
                        justifyContent: 'center',
                        padding: 10,
                      }}>
                      <UI.Text font={fonts.rr} size={14 / fontScale}>
                        {formData.ownRented}
                      </UI.Text>
                    </View>
                  
                  </TouchableOpacity> */}
                  {/* {showOwnRented && (
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        borderWidth: 1,
                        borderColor: colors.grayMidBold,
                        backgroundColor: '#fff',
                        elevation: 4,
                        zIndex: 1,
                        top: 70,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setFormData({...formData, ownRented: 'Own'});
                          setShowOwnRented(!showOwnRented);
                        }}
                        style={{
                          padding: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.grayMid,
                        }}>
                        <UI.Text
                          font={fonts.rr}
                          size={14 / fontScale}
                          center
                          color="#000">
                          Own
                        </UI.Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setFormData({...formData, ownRented: 'Rented'});
                          setShowOwnRented(!showOwnRented);
                        }}
                        style={{padding: 10}}>
                        <UI.Text
                          font={fonts.rr}
                          size={14 / fontScale}
                          center
                          color="#000">
                          Rented
                        </UI.Text>
                      </TouchableOpacity>
                    </View>
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
                      fontFamily: fonts.rr,
                    }}
                    inputSearchStyle={{
                      marginLeft: 10,
                      fontFamily: fonts.rr,
                    }}
                    data={ifRentedProperty}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={el => {
                      setFormData({...formData, ownRented: el.label});
                      setValue(el.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => <Text> </Text>}
                  />
                  <UI.Text
                    font={fonts.rr}
                    color="#f87171"
                    size={14 / fontScale}>
                    {formErrors.ownRented}
                  </UI.Text>
                </UI.Div>
              </UI.Flex>
              <UI.Flex spaceb style={{zIndex: -1}}>
                <UI.Div width="100%">
                  <UI.Text font={fonts.rm} mb={5} size={16 / fontScale}>
                    Location / Landmark
                  </UI.Text>
                  <TextInput
                    value={formData.locationLandmark}
                    onChangeText={ex =>
                      setFormData({...formData, locationLandmark: ex})
                    }
                    placeholderTextColor={colors.grayBoldMax}
                    style={{
                      fontFamily: fonts.rr,
                      fontSize: 14 / fontScale,
                      borderColor: colors.grayMid,
                      width: '100%',
                      borderWidth: 1,
                      borderRadius: 6,
                      height: 45,
                      padding: 10,
                    }}
                  />
                  <UI.Text
                    font={fonts.rr}
                    color="#f87171"
                    size={14 / fontScale}>
                    {formErrors.locationLandmark}
                  </UI.Text>
                </UI.Div>
              </UI.Flex>
              <UI.Flex spaceb>
                <UI.Div width="100%">
                  <UI.Text font={fonts.rm} mb={5} size={16 / fontScale}>
                    How much money do you wish to spend?
                  </UI.Text>
                  <TextInput
                    value={formData.investment}
                    onChangeText={ex =>
                      setFormData({...formData, investment: ex})
                    }
                    placeholderTextColor={colors.grayBoldMax}
                    style={{
                      fontFamily: fonts.rr,
                      fontSize: 14 / fontScale,
                      borderColor: colors.grayMid,
                      width: '100%',
                      borderWidth: 1,
                      borderRadius: 6,
                      height: 45,
                      padding: 10,
                    }}
                  />
                  <UI.Text
                    font={fonts.rr}
                    color="#f87171"
                    size={14 / fontScale}>
                    {formErrors.investment}
                  </UI.Text>
                </UI.Div>
              </UI.Flex>
              <UI.Flex spaceb>
                <UI.Div width="100%">
                  <UI.Text font={fonts.rm} mb={5} size={16 / fontScale}>
                    Do you have any experience in food industry?
                  </UI.Text>
                  {/* <TouchableOpacity
                    onPress={() => setShowFoodIndustry(!showFoodIndustry)}>
                    <View
                      height={50}
                      style={{
                        borderWidth: 1,
                        borderColor: colors.grayMid,
                        borderRadius: 6,
                        justifyContent: 'center',
                        padding: 10,
                      }}>
                      <UI.Text font={fonts.rr} size={14 / fontScale}>
                        {formData.experience}
                      </UI.Text>
                    </View>
                  
                  </TouchableOpacity> */}
                  {/* {showFoodIndustry && (
                    <View
                      style={{
                        width: '100%',

                        borderWidth: 1,
                        borderColor: colors.grayMidBold,
                        backgroundColor: '#fff',
                        elevation: 4,
                        zIndex: 1,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setFormData({...formData, experience: 'Yes'});
                          setShowFoodIndustry(!showFoodIndustry);
                        }}
                        style={{
                          padding: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.grayMid,
                        }}>
                        <UI.Text
                          font={fonts.rr}
                          size={14 / fontScale}
                          center
                          color="#000">
                          Yes
                        </UI.Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setFormData({...formData, experience: 'No'});
                          setShowFoodIndustry(!showFoodIndustry);
                        }}
                        style={{padding: 10}}>
                        <UI.Text
                          font={fonts.rr}
                          size={14 / fontScale}
                          center
                          color="#000">
                          No
                        </UI.Text>
                      </TouchableOpacity>
                    </View>
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
                      isFocusFood && {borderColor: colors.layoutTheme},
                    ]}
                    selectedTextStyle={{
                      fontSize: 14 / fontScale,
                      marginLeft: 10,
                      fontFamily: fonts.rr,
                    }}
                    inputSearchStyle={{
                      marginLeft: 10,
                      fontFamily: fonts.rr,
                    }}
                    data={ifFoodIndustry}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocusFood ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={valueFood}
                    onFocus={() => setIsFocusFood(true)}
                    onBlur={() => setIsFocusFood(false)}
                    onChange={el => {
                      setFormData({...formData, experience: el.label});
                      setValueFood(el.value);
                      setIsFocusFood(false);
                    }}
                    renderLeftIcon={() => <Text> </Text>}
                  />
                  <UI.Text color="#f87171" size={14 / fontScale}>
                    {formErrors.experience}
                  </UI.Text>
                </UI.Div>
              </UI.Flex>
              <UI.Button
                onPress={() => submitToContactUs()}
                border
                pt={12}
                mt={'2%'}
                size={16 / fontScale}
                pb={12}
                bg={'#ffff'}
                width={'80%'}
                ml={'auto'}
                mr="auto"
                b={2}
                bR={6}
                text={loading ? 'Loading...' : 'SEND NOW'}
                bColor={colors.layoutTheme}
              />
            </UI.Div>
          </UI.Div>
        </KeyboardAwareScrollView>
      </ScrollView>
    </Layout>
  );
};

export default EnquiryForFranchise;
