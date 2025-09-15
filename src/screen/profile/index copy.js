import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  BackHandler,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as UI from '../../Components/UI/UI';
import {LoginBg, tmsLogo} from '../../Components/common/ALLImages';
import {colors} from '../../Components/Design';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Layout from '../../Components/common/Layouts';
import NewProducts from '../../Components/AllProducts/NewProducts';
import {useDispatch, useSelector} from 'react-redux';
import {addProfilePicture} from '../../Redux/reducerSlice/AllactionSlice';
import ImagePicker from 'react-native-image-crop-picker';
import Animated, {color} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {
  fetchProfileData,
  fetchUpdateProfile,
} from '../../Redux/reducerSlice/ProfileSlice';

const Profile = props => {
  const dispatch = useDispatch();
  const sheetRef = React.useRef(null);
  const navigation = useNavigation();
  const {products, isLoading} = useSelector(state => state.products);
  const {profilePicture} = useSelector(state => state.allActionSLice);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {updateProfileLoading, updateProfileStatus} = useSelector(
    state => state.profile,
  );
  const {profileData} = useSelector(state => state.profile);

  const [showEditDpModal, setShowEditDpModal] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phNumber: '',
    altNumber: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const changeProfilePicture = () => {
    setShowEditDpModal(!showEditDpModal);
  };
  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 500,
      cropping: true,
    }).then(image => {
      setShowEditDpModal(!showEditDpModal);
      dispatch(addProfilePicture(image?.path));
    });
  };

  const uploadPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 500,
      cropping: true,
    }).then(image => {
      setShowEditDpModal(!showEditDpModal);
      dispatch(addProfilePicture(image?.path));
    });
  };
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (formData.fullName === '') {
      errors.fullName = 'Please enter a valid full name.';
    }
    if (formData.email == '' || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (formData.phNumber === '' || !phoneRegex.test(formData.phNumber)) {
      errors.phNumber = 'Please enter a valid phone number.';
    }
    if (phoneRegex.test(formData.altNumber)) {
      errors.altNumber = 'Please enter a valid phone number.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const submitForVerify = () => {
    if (validateForm()) {
      setFormData({
        fullName: '',
        email: '',
        phNumber: '',
        altNumber: '',
      });

      const newValues = {
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: '',
      };
      const securityCode = userInfo?.data?.securityCode;
      dispatch(fetchUpdateProfile({newValues, securityCode}))
        .unwrap()
        .then(res => {
          setEditModalShow(false);
          dispatch(fetchProfileData(userInfo?.data?.securityCode))
            .unwrap()
            .then(res => {
              if (res.isSuccess) {
                setFormData({
                  fullName: res?.data?.name,
                  email: res?.data?.email,
                  phNumber: res?.data?.phone,
                  altNumber: '',
                });
              }
            });
        });
    } else {
    }
  };

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      dispatch(fetchProfileData(userInfo?.data?.securityCode))
        .unwrap()
        .then(res => {
          if (res.isSuccess) {
            setFormData({
              fullName: res?.data?.name,
              email: res?.data?.email,
              phNumber: res?.data?.phone,
              altNumber: '',
            });
          }
        });
    });
    return () => {
      focused();
    };
  }, []);

  // {"email": "7894561245", "name": "miku@miku.com", "password": "", "phone": "7894561245", "profileImage": null}
  // useEffect(() => {
  //   if (!profileData) {
  //     console.log(' profileData=======> ', profileData?.data);
  //     setFormData({
  //       fullName: profileData?.data?.name,
  //       email: profileData?.data?.email,
  //       phNumber: profileData?.data?.phone,
  //       altNumber: '',
  //     });
  //   }
  // }, [profileData?.data]);

  return (
    <Layout showBar back comProps={props}>
      <UI.Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: '20%'}}>
          <UI.Div mt={20}>
            {profileData?.data?.name && (
              <UI.Text size={18}>
                Hello,
                <UI.Text bold size={18}>
                  {profileData?.data?.name}
                </UI.Text>
              </UI.Text>
            )}
          </UI.Div>
          <UI.Flex center width={'100%'} mt={10}>
            <Image
              source={{
                uri:
                  profilePicture !== ''
                    ? profilePicture
                    : 'https://i.pinimg.com/564x/c8/bc/65/c8bc65d66b31548f83c6fdd12e312777.jpg',
              }}
              style={styles.loginBG}
            />
          </UI.Flex>
          <TouchableOpacity onPress={() => changeProfilePicture()}>
            <UI.Text
              center
              color={colors.layoutTheme}
              style={{textDecorationLine: 'underline'}}>
              Change picture
            </UI.Text>
          </TouchableOpacity>
          <UI.Div width="100%">
            <UI.Flex spaceb middle>
              <UI.Button
                onPress={() => navigation.navigate('YourOrders')}
                width="45%"
                gpb={10}
                gpt={10}
                text="Your Orders"
              />
              <UI.Button
                onPress={() => navigation.navigate('favorite')}
                width="45%"
                gpb={10}
                gpt={10}
                text="Wishlist"
              />
            </UI.Flex>
          </UI.Div>
          <UI.Div width="100%">
            <UI.Flex center middle>
              <UI.Button width="60%" gpb={10} gpt={10} text="Address" />
              {/* <UI.Button width="45%" text="Your Orders" /> */}
            </UI.Flex>
          </UI.Div>
          {/*   Details********************************************************************************************/}
          {/* Full Name: Email Address: Phone Number:  */}
          <UI.Flex mt={20} spaceb middle>
            <UI.Div></UI.Div>

            <UI.Div>
              <TouchableOpacity onPress={() => setEditModalShow(true)}>
                <Feather name="edit" size={21} color={colors.layoutTheme} />
              </TouchableOpacity>
            </UI.Div>
          </UI.Flex>
          <UI.Div width={'90%'} mr="auto" ml="auto">
            <UI.Div>
              <UI.Text size={16} bold color={colors.layoutTheme}>
                Full Name:{' '}
              </UI.Text>
              <UI.Text
                size={15}
                color={colors.grayBoldMax}
                style={{textTransform: 'capitalize'}}>
                {profileData?.data?.name}
              </UI.Text>
            </UI.Div>
            <UI.Div mt={6}>
              <UI.Text size={16} bold color={colors.layoutTheme}>
                Email Address:
              </UI.Text>
              <UI.Text size={15} color={colors.grayBoldMax}>
                {profileData?.data?.email}
              </UI.Text>
            </UI.Div>
            <UI.Div mt={6}>
              <UI.Text size={16} bold color={colors.layoutTheme}>
                Phone Number:
              </UI.Text>
              <UI.Text size={15} color={colors.grayBoldMax}>
                {profileData?.data?.phone}
              </UI.Text>
            </UI.Div>
            <UI.Div mt={6}>
              <UI.Text size={16} bold color={colors.layoutTheme}>
                Alt Phone Number:
              </UI.Text>
              <UI.Text size={15} color={colors.grayBoldMax}>
                {/* 7001186809 */}
              </UI.Text>
            </UI.Div>
          </UI.Div>

          {/* phnumber  */}

          {/* end Details*************************************************************************************************************************/}
          {/* ********************************************* Address****************************************************************************/}

          {/* ********************************************* END Address****************************************************************************/}
          {/* *********************************************Payment   Method****************************************************************************/}
          {/* <UI.Flex column> */}
          {/* <UI.Div pb={20}>
            <UI.Text center mt={20} color={colors.layoutTheme}>
              Saved Payment Method
            </UI.Text>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              <UI.Flex>
                <TouchableOpacity
                  style={{
                    width: 150,
                    paddingVertical: 20,
                    marginHorizontal: 6,
                    borderRadius: 10,
                    borderColor: colors.layoutTheme,
                    borderWidth: 1,
                    backgroundColor: colors.grayLight,
                  }}>
                  <UI.Text center color={colors.layoutTheme}>
                    Payment me...
                  </UI.Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 150,
                    marginHorizontal: 6,
                    paddingVertical: 20,
                    borderRadius: 10,
                    borderColor: colors.garyMidMaxBold,
                    borderWidth: 1,
                    backgroundColor: colors.grayLight,
                  }}>
                  <UI.Text center color={colors.grayBoldMax}>
                    Payment ...
                  </UI.Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 150,
                    marginHorizontal: 6,
                    paddingVertical: 20,
                    borderRadius: 10,
                    borderColor: colors.garyMidMaxBold,
                    borderWidth: 1,
                    backgroundColor: colors.grayLight,
                  }}>
                  <UI.Text center color={colors.grayBoldMax}>
                    Payment ...
                  </UI.Text>
                </TouchableOpacity>
              </UI.Flex>
            </ScrollView>
            <UI.Flex>
              <UI.Div style={{width: 200}}>
                <UI.Text bold size={16} color={colors.layoutTheme}>
                  4754 7854 8224 0011
                </UI.Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <UI.Text size={12} color={colors.grayBoldMax}>
                    CVV: 741
                  </UI.Text>
                  <UI.Text size={12} color={colors.grayBoldMax}>
                    EXPIRY: 06:35
                  </UI.Text>
                </View>
              </UI.Div>
            </UI.Flex>
          </UI.Div> */}
          {/* </UI.Flex> */}
          {/* *********************************************Wishlists   Method****************************************************************************/}

          {/* <UI.Div>
            <NewProducts
              products={products}
              isLoading={isLoading}
              title={'Wishlists'}
            />
          </UI.Div> */}

          {/* *********************************************Wishlists   Method****************************************************************************/}

          {/* <UI.Button
            mt={20}
            // onPress={() => submitForVerify()}
            border
            pt={10}
            size={16}
            pb={10}
            bg="#fff"
            width={'80%'}
            ml={'auto'}
            mr="auto"
            b={2}
            bR={6}
            text="DELETE ACCOUNT"
            bColor={colors.layoutTheme}
          /> */}
          <UI.Div mt="10%">
            <TouchableOpacity>
              <UI.Text
                center
                color={colors.layoutTheme}
                style={{textDecorationLine: 'underline'}}>
                DELETE ACCOUNT
              </UI.Text>
            </TouchableOpacity>
          </UI.Div>
          <UI.Div mt={20}>
            <UI.Flex middle center>
              <UI.Text color={colors.layoutShadow} size={25}>
                GOOD HEALTH |
              </UI.Text>
              <UI.Text color={colors.layoutShadow} size={25}>
                {' '}
                TRUE HEALTH
              </UI.Text>
            </UI.Flex>
          </UI.Div>
        </ScrollView>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showEditDpModal}
            onRequestClose={() => {
              setShowEditDpModal(!showEditDpModal);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => setShowEditDpModal(!showEditDpModal)}
                  style={{
                    marginLeft: 'auto',
                    marginRight: 2,
                    padding: 10,
                  }}>
                  <UI.Text color={colors.layoutTheme}>Close</UI.Text>
                </TouchableOpacity>
                <View style={{alignItems: 'center'}}>
                  <UI.Text center color={colors.grayMid}>
                    Upload Photo
                  </UI.Text>
                  <UI.Text center color={colors.grayMid}>
                    Choose Image
                  </UI.Text>
                </View>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => takePhoto()}>
                  <UI.Text center color="#fff" bold>
                    Take Photo
                  </UI.Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => uploadPhoto()}
                  style={[styles.button, styles.buttonClose]}>
                  <UI.Text center color="#fff" bold>
                    Choose From Library
                  </UI.Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={editModalShow}
            onRequestClose={() => {
              setEditModalShow(false);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.editModalView}>
                <TouchableOpacity
                  onPress={() => setEditModalShow(false)}
                  style={{
                    marginLeft: 'auto',
                    padding: 10,
                  }}>
                  <AntDesign
                    name="close"
                    size={30}
                    color={colors.layoutTheme}
                  />
                </TouchableOpacity>
                <KeyboardAwareScrollView>
                  <UI.Div p={10}>
                    <UI.Div mb={10}>
                      <UI.Text bold color={colors.layoutTheme} size={16}>
                        Full Name{' '}
                        <UI.Text size={16} bold color={'#f87171'}>
                          *
                        </UI.Text>
                      </UI.Text>
                      <TextInput
                        value={formData.fullName}
                        onChangeText={ex =>
                          setFormData({...formData, fullName: ex})
                        }
                        style={{
                          marginTop: 10,
                          borderColor: colors.grayMid,
                          width: '100%',
                          borderWidth: 1,
                          borderRadius: 6,
                          height: 50,
                          padding: 10,
                        }}
                      />
                      <UI.Text color="#f87171">{formErrors.fullName}</UI.Text>
                    </UI.Div>
                    <UI.Div mb={10}>
                      <UI.Text bold color={colors.layoutTheme} size={16}>
                        Email{' '}
                        <UI.Text size={16} bold color={'#f87171'}>
                          *
                        </UI.Text>
                      </UI.Text>
                      <TextInput
                        value={formData.email}
                        onChangeText={ex =>
                          setFormData({...formData, email: ex})
                        }
                        style={{
                          marginTop: 10,
                          borderColor: colors.grayMid,
                          width: '100%',
                          borderWidth: 1,
                          borderRadius: 6,
                          height: 50,
                          padding: 10,
                        }}
                      />
                      <UI.Text color="#f87171">{formErrors.email}</UI.Text>
                    </UI.Div>
                    <UI.Div mb={10}>
                      <UI.Text bold color={colors.layoutTheme} size={16}>
                        Phone Number{' '}
                        <UI.Text size={16} bold color={'#f87171'}>
                          *
                        </UI.Text>
                      </UI.Text>
                      <TextInput
                        onChangeText={ex =>
                          setFormData({...formData, phNumber: ex})
                        }
                        value={formData.phNumber}
                        style={{
                          marginTop: 10,
                          borderColor: colors.grayMid,
                          width: '100%',
                          borderWidth: 1,
                          borderRadius: 6,
                          height: 50,
                          padding: 10,
                        }}
                      />
                      <UI.Text color="#f87171">{formErrors.phNumber}</UI.Text>
                    </UI.Div>
                    <UI.Div mb={10}>
                      <UI.Text bold color={colors.layoutTheme} size={16}>
                        Alt Phone Number
                      </UI.Text>
                      <TextInput
                        value={formData.altNumber}
                        onChangeText={ex =>
                          setFormData({...formData, altNumber: ex})
                        }
                        style={{
                          marginTop: 10,
                          borderColor: colors.grayMid,
                          width: '100%',
                          borderWidth: 1,
                          borderRadius: 6,
                          height: 50,
                          padding: 10,
                        }}
                      />
                      <UI.Text color="#f87171">{formErrors.altNumber}</UI.Text>
                    </UI.Div>
                    {updateProfileLoading ? (
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
                </KeyboardAwareScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </UI.Container>
    </Layout>
  );
};

export default Profile;
var styles = StyleSheet.create({
  loginBG: {
    borderRadius: 100,
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  editModalView: {
    maxWidth: '90%',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView: {
    maxWidth: '70%',
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  button: {
    width: '100%',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 6,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: colors.layoutTheme,
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
