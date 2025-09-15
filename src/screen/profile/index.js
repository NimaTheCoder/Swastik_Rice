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
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as UI from '../../Components/UI/UI';
import {LoginBg, tmsLogo} from '../../Components/common/ALLImages';
import {colors} from '../../Components/Design';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Layout from '../../Components/common/Layouts';
import NewProducts from '../../Components/AllProducts/NewProducts';
import {useDispatch, useSelector} from 'react-redux';
import {
  addDefaultAddress,
  addProfilePicture,
} from '../../Redux/reducerSlice/AllactionSlice';
import ImagePicker from 'react-native-image-crop-picker';
import Animated, {color} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {
  fetchProfileData,
  fetchUpdateProfile,
  resetUserProfileData,
} from '../../Redux/reducerSlice/ProfileSlice';
import {fetchDeleteAccount} from '../../Redux/reducerSlice/DeleteAccoutSlice';
import {useToast} from 'react-native-toast-notifications';
import {resetWishlistData} from '../../Redux/reducerSlice/WishlistSlice';
import {resetCartData} from '../../Redux/reducerSlice/CartSlicer';
import {logout} from '../../Redux/reducerSlice/AuthSlice';
import ImgToBase64 from 'react-native-image-base64';
import {
  fetchProfilePhoto,
  uploadProfilePhoto,
} from '../../Redux/reducerSlice/ProfileImageSlice';
import {imageUrl, profileImg} from '../../../config';
import RNFetchBlob from 'rn-fetch-blob';
import {getVersion} from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import {fonts} from '../../Components/common/CustomFonts';

const Profile = props => {
  const {width, fontScale} = Dimensions.get('window');
  const refInput = useRef(null); // Ref for text input
  const toast = useToast();
  const dispatch = useDispatch();
  const sheetRef = React.useRef(null);
  const navigation = useNavigation();
  const {products, isLoading} = useSelector(state => state.products);
  const {profilePicture} = useSelector(state => state.allActionSLice);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {
    updateProfileLoading,
    updateProfileStatus,
    profileData,
    getProfileLoading,
  } = useSelector(state => state.profile);

  const {uploadProfilePhotoStatus, getProfilePhoto} = useSelector(
    state => state.profileImage,
  );
  const {deleteAccountLoading} = useSelector(state => state.deleteAccount);
  // profileImage;
  const [profilePhotoImage, setProfileImage] = useState('');
  const [showEditDpModal, setShowEditDpModal] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phNumber: '',
    altNumber: '',
  });
  const [copiedText, setCopiedText] = useState('');
  // update
  const [checkData, setCheckData] = useState({
    email: '',
    phNumber: '',
  });

  const [showWarning, setShowWarning] = useState(false);

  const [imgView, setImageView] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const changeProfilePicture = () => {
    setShowEditDpModal(!showEditDpModal);
  };
  useEffect(() => {}, [profilePhotoImage]);
  const uploadAPIPhoto = async base64String => {
    const values = {
      data: {
        fileData: base64String,
      },
      securityCode: userInfo?.data?.securityCode,
    };

    dispatch(uploadProfilePhoto(values))
      .unwrap()
      .then(res => {
        if (res?.data?.isSuccess) {
          setProfileImage('');
          getProfileImage();
        }
      })
      .catch(err => console.log(err));
  };

  const takePhoto = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      // dispatch(addProfilePicture(image?.path));
      ImgToBase64.getBase64String(`${image.path}`)
        .then(base64String => {
          uploadAPIPhoto(base64String);
        })
        .catch(err => console.log('err get image', err));
      setShowEditDpModal(!showEditDpModal);
    });
  };

  const uploadPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      ImgToBase64.getBase64String(`${image.path}`)
        .then(base64String => {
          uploadAPIPhoto(base64String);
        })
        .catch(err => console.log('err get image', err));
      setShowEditDpModal(!showEditDpModal);
      // dispatch(addProfilePicture(image?.path));
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
    // if (!phoneRegex.test(formData.altNumber)) {
    //   errors.altNumber = 'Please enter a valid phone number.';
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const submitForVerify = () => {
    if (validateForm()) {
      const newValues = {
        name: formData.fullName,
        phone: formData.phNumber,
        email: formData.email,
        password: '',
        altNumber: formData.altNumber,
      };
      const securityCode = userInfo?.data?.securityCode;

      dispatch(fetchUpdateProfile({newValues, securityCode}))
        .unwrap()
        .then(res => {
          setEditModalShow(false);
          setFormData({
            fullName: '',
            email: '',
            phNumber: '',
            altNumber: '',
          });
          dispatch(fetchProfileData(userInfo?.data?.securityCode))
            .unwrap()
            .then(res => {
              // setFormData({
              //   fullName: '',
              //   email: '',
              //   phNumber: '',
              //   altNumber: '',
              // });
              if (res.isSuccess) {
                setFormData({
                  fullName: res?.data?.name,
                  email: res?.data?.email,
                  phNumber: res?.data?.phone,
                  altNumber: '',
                });
                setCheckData({
                  email: res?.data?.email,
                  phNumber: res?.data?.phone,
                });
              }
            });
        });
    } else {
    }
  };

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      refInput.current?.focus();
      getProfileImage();

      await dispatch(fetchProfileData(userInfo?.data?.securityCode))
        .unwrap()
        .then(res => {
          if (res.isSuccess) {
            setCheckData({
              email: res?.data?.email,
              phNumber: res?.data?.phone,
            });
            setFormData({
              fullName: res?.data?.name,
              email: res?.data?.email,
              phNumber: res?.data?.phone,
              altNumber: '',
            });
          }
        })
        .catch(err => console.log('err', err));
    });
    return () => {
      focused();
    };
  }, []);

  const getProfileImage = () => {
    // setProfileImage(null);
    dispatch(fetchProfilePhoto(userInfo?.data?.securityCode))
      .unwrap()
      .then(res => {
        if (res?.isSuccess) {
          RNFetchBlob.fetch('GET', `${profileImg}${res?.message}`)
            .then(res => {
              let status = res.info().status;

              if (status == 200) {
                // the conversion is done in native code
                let base64Str = res.base64();
                setProfileImage(`data:image/png;base64,${base64Str}`);

                // the following conversions are done in js, it's SYNC
                let text = res.text();
                let json = res.json();
              } else {
                // handle other status codes
              }
            })
            // Something went wrong:
            .catch((errorMessage, statusCode) => {
              // error handling
            });
        } else {
          setProfileImage(null);
        }
      })
      .catch(err => console.log(' fetchProfilePhoto err', err));
  };

  // useEffect(() => {}, []);
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
  const deleteAccount = () => {
    setShowWarning(true);
  };
  const confirmDeleteAccount = () => {
    dispatch(fetchDeleteAccount(userInfo?.data?.securityCode))
      .unwrap()
      .then(res => {
        if (res?.isSuccess) {
          toast.show('Successfully delete account.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
          dispatch(resetUserProfileData());
          dispatch(resetWishlistData());
          dispatch(resetCartData());
          dispatch(logout());
          dispatch(addDefaultAddress(null));
          AsyncStorage.clear();
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
      .catch(err => console.log('err', err));
  };

  const copyToClipboard = text => {
    setCopyLoading(true);
    Clipboard.setString(otpDetails?.data?.code);
    // copied Successfully
    toast.hideAll();
    toast.show('Copied Successfully', {
      type: 'black',
      placement: 'bottom',
      duration: 2000,
      offset: 50,
      animationType: 'slide-in | zoom-in',
    });
    setTimeout(() => {
      setCopyLoading(false);
    }, 1000);
  };
  const toBold = text => {
    const charSet = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '!',
      '?',
      '.',
      ',',
      '"',
      "'",
    ];
    const targetCharSet = [
      '𝐚',
      '𝐛',
      '𝐜',
      '𝐝',
      '𝐞',
      '𝐟',
      '𝐠',
      '𝐡',
      '𝐢',
      '𝐣',
      '𝐤',
      '𝐥',
      '𝐦',
      '𝐧',
      '𝐨',
      '𝐩',
      '𝐪',
      '𝐫',
      '𝐬',
      '𝐭',
      '𝐮',
      '𝐯',
      '𝐰',
      '𝐱',
      '𝐲',
      '𝐳',
      '𝐀',
      '𝐁',
      '𝐂',
      '𝐃',
      '𝐄',
      '𝐅',
      '𝐆',
      '𝐇',
      '𝐈',
      '𝐉',
      '𝐊',
      '𝐋',
      '𝐌',
      '𝐍',
      '𝐎',
      '𝐏',
      '𝐐',
      '𝐑',
      '𝐒',
      '𝐓',
      '𝐔',
      '𝐕',
      '𝐖',
      '𝐗',
      '𝐘',
      '𝐙',
      '𝟎',
      '𝟏',
      '𝟐',
      '𝟑',
      '𝟒',
      '𝟓',
      '𝟔',
      '𝟕',
      '𝟖',
      '𝟗',
      '❗',
      '❓',
      '.',
      ',',
      '"',
      "'",
    ];
    const textArray = text.split('');
    let boldText = '';
    textArray.forEach(letter => {
      const index = charSet.findIndex(_letter => _letter === letter);
      if (index !== -1) {
        boldText = boldText + targetCharSet[index];
      } else {
        boldText = boldText + letter;
      }
    });
    return boldText;
  };
  const shareFriendsRef = () => {
    const shareOptions = {
      title: 'Referral code',
      message: `Hi! I'm inviting you to use ${toBold(
        `The Mewa Shoppe`,
      )}. It's a simple and excellent way to buy Dry Fruits and other items.

Use my referral code - ${toBold(otpDetails?.data?.code)} 
for getting Rs.100 

  Discover endless offers on every payment.

Download the app:
    - Android: https://play.google.com/store/apps/details?id=com.themewashoppe
    - iOS: https://apps.apple.com/in/app/the-mewa-shoppe/id6471074337
  `,
      // url: 'https://play.google.com/store/apps/details?id=com.themewashoppe',

      // whatsAppNumber: '9199999999',
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  return (
    <Layout showBar back comProps={props}>
      {getProfileLoading || deleteAccountLoading ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 554,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.layoutTheme} />
        </View>
      ) : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWarning}
        onRequestClose={() => {
          setShowWarning(!showWarning);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewD}>
            <UI.Text
              center
              ml={'auto'}
              mr={'auto'}
              width="90%"
              font={fonts.rb}
              size={20 / fontScale}
              color={colors.layoutTheme}>
              Delete Account
            </UI.Text>
            <UI.Text
              mt={20}
              center
              ml={'auto'}
              mr={'auto'}
              width="90%"
              font={fonts.rm}
              size={16 / fontScale}
              color={colors.layoutTheme}>
              Are you sure you want to delete your account?
            </UI.Text>
            <View
              style={{
                marginTop: Platform.isPad ? 30 : 16,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => setShowWarning(!showWarning)}
                style={{
                  backgroundColor: '#ef4444',
                  paddingHorizontal: Platform.isPad ? 26 : 28,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}>
                <UI.Text
                  size={Platform.isPad ? 20 / fontScale : 16 / fontScale}
                  font={fonts.rm}
                  color={colors.white}>
                  No
                </UI.Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDeleteAccount()}
                style={{
                  backgroundColor: '#22c55e',
                  paddingHorizontal: Platform.isPad ? 26 : 28,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}>
                <UI.Text
                  size={Platform.isPad ? 20 / fontScale : 16 / fontScale}
                  font={fonts.rm}
                  color={colors.white}>
                  Yes
                </UI.Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginBottom: Platform.OS == 'ios' ? '10%' : '20%',
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <UI.Div mt={20}>
          {profileData?.data?.name && (
            <UI.Text font={fonts.rr} size={16 / fontScale}>
              Hello, {''}
              <UI.Text
                style={{textTransform: 'capitalize'}}
                font={fonts.rm}
                size={16 / fontScale}>
                {profileData?.data?.name}
              </UI.Text>
            </UI.Text>
          )}
        </UI.Div>
        {/* {
              uri:
                profilePhoto !== null
                  ? `https://api-tms.goldenbuzz.in/${profilePhoto}`
                  : 'https://i.pinimg.com/564x/c8/bc/65/c8bc65d66b31548f83c6fdd12e312777.jpg',
            } */}
        <Modal visible={imgView} transparent={true}>
          <View
            style={{
              flex: 1,
              // justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <TouchableOpacity
              style={{
                marginLeft: 'auto',
                paddingTop: 30,
                paddingHorizontal: 20,
                marginTop: 10,
              }}
              onPress={() => setImageView(!imgView)}>
              <AntDesign name="close" size={30} color={colors.layoutTheme} />
            </TouchableOpacity>
            <View style={{width: '100%', height: '100%'}}>
              <TouchableOpacity
                style={{
                  marginLeft: 'auto',
                  height: '20%',
                  width: '100%',
                }}
                onPress={() => setImageView(!imgView)}></TouchableOpacity>
              <View
                style={{
                  maxWidth: '100%',
                  height: '60%',
                  width: '100%',
                  height: Platform.isPad ? 600 : 400,
                  borderRadius: 20,
                  alignItems: 'center',
                }}>
                <Image
                  source={{
                    uri: `${profilePhotoImage}`,
                  }}
                  style={{
                    resizeMode: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  marginLeft: 'auto',

                  height: '20%',
                  width: '100%',
                  marginTop: 10,
                }}
                onPress={() => setImageView(!imgView)}></TouchableOpacity>
            </View>
          </View>
        </Modal>
        <UI.Flex
          style={{width: 130, height: 130, borderRadius: 100}}
          center
          mr={'auto'}
          ml={'auto'}
          width={'100%'}
          mt={10}>
          <TouchableOpacity
            onPress={() => changeProfilePicture()}
            style={{
              position: 'absolute',
              padding: 4,
              right: 0,
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 9,
              top: 10,
              backgroundColor: '#fff',
              borderRadius: 6,
            }}>
            <Feather name="edit" size={20} color={colors.layoutTheme} />
          </TouchableOpacity>
          {profilePhotoImage ? (
            <TouchableOpacity
              style={{width: '100%', height: '100%', borderRadius: 100}}
              onPress={() => setImageView(!imgView)}>
              <Image
                // blurRadius={0}
                source={{
                  uri: `${profilePhotoImage}`,
                }}
                style={styles.loginBG}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={require('../../assets/img/profile.jpg')}
              style={styles.loginBG}
            />
          )}
        </UI.Flex>
        {/* <TouchableOpacity
          style={{marginLeft: 'auto', marginRight: 'auto'}}
          onPress={() => changeProfilePicture()}>
          <UI.Text
            size={Platform.isPad ? 20 / fontScale : 14 / fontScale}
            center
            color={colors.layoutTheme}
            style={{textDecorationLine: 'underline'}}>
            Change picture
          </UI.Text>
        </TouchableOpacity> */}
        <UI.Div width="100%" mt={10}>
          <UI.Flex spaceb middle>
            <UI.Button
              onPress={() => navigation.navigate('YourOrders')}
              width="45%"
              gpb={10}
              size={18 / fontScale}
              gpt={10}
              text="Your Orders"
            />
            <UI.Button
              onPress={() => navigation.navigate('favorite')}
              width="45%"
              gpb={10}
              size={18 / fontScale}
              gpt={10}
              text="Wishlist"
            />
          </UI.Flex>
        </UI.Div>
        <UI.Div width="100%">
          <UI.Flex center middle>
            <UI.Button
              onPress={() => navigation.navigate('address')}
              width="60%"
              gpb={10}
              size={18 / fontScale}
              gpt={10}
              text="Addresses"
            />
            {/* <UI.Button width="45%" text="Your Orders" /> */}
          </UI.Flex>
        </UI.Div>
        {/*   Details********************************************************************************************/}
        {/* Full Name: Email Address: Phone Number:  */}

        <UI.Div
          mt={20}
          bg="#fff"
          width={Platform.isPad ? '80%' : '100%'}
          p={Platform.isPad ? 10 : 20}
          br={6}
          mr="auto"
          ml="auto">
          <UI.Flex p={0} spaceb middle width={Platform.isPad ? '90%' : '100%'}>
            <UI.Div></UI.Div>
            <UI.Div>
              <TouchableOpacity
                onPress={() => {
                  refInput.current?.focus();
                  setEditModalShow(true);
                }}>
                <Feather name="edit" size={21} color={colors.layoutTheme} />
              </TouchableOpacity>
            </UI.Div>
          </UI.Flex>
          <UI.Div>
            <UI.Text
              size={16 / fontScale}
              font={fonts.rm}
              color={colors.layoutTheme}>
              Full Name:{' '}
            </UI.Text>
            <UI.Text
              font={fonts.rr}
              size={14 / fontScale}
              color={colors.grayBoldMax}
              style={{textTransform: 'capitalize'}}>
              {profileData?.data?.name}
            </UI.Text>
          </UI.Div>
          <UI.Div mt={Platform.isPad ? 12 : 6}>
            <UI.Text
              size={16 / fontScale}
              font={fonts.rm}
              color={colors.layoutTheme}>
              Email Address:
            </UI.Text>
            <UI.Text
              size={14 / fontScale}
              font={fonts.rr}
              color={colors.grayBoldMax}>
              {profileData?.data?.email}
            </UI.Text>
          </UI.Div>
          <UI.Div mt={Platform.isPad ? 12 : 6}>
            <UI.Text
              size={16 / fontScale}
              font={fonts.rm}
              color={colors.layoutTheme}>
              Phone Number:
            </UI.Text>
            <UI.Text
              size={14 / fontScale}
              font={fonts.rr}
              color={colors.grayBoldMax}>
              {profileData?.data?.phone}
            </UI.Text>
          </UI.Div>
          {/* <UI.Div mt={Platform.isPad ? 12 : 6}>
            <UI.Text
              size={16 / fontScale}
              font={fonts.rm}
              color={colors.layoutTheme}>
              Alt Phone Number:
            </UI.Text>
            <UI.Text
              size={14 / fontScale}
              font={fonts.rr}
              color={colors.grayBoldMax}>
             </UI.Text>
          </UI.Div> */}
        </UI.Div>

        {/* *********************************************Share Referral components***************************************************************************/}
        <UI.Div br={6} mt={20} p={16} bg="#fff">
          <UI.Text
            ml="auto"
            color={colors.layoutTheme}
            mr="auto"
            font={fonts.rm}
            size={18 / fontScale}>
            Your referral code:
          </UI.Text>
          <UI.Flex
            mb={10}
            mt={16}
            p={6}
            middle
            ml="auto"
            mr="auto"
            width="60%"
            style={{
              borderWidth: 1,
              borderColor: colors.layoutThemeLight,
              borderStyle: 'dashed',
            }}>
            <UI.Div
              width="70%"
              style={{
                borderRightWidth: 1,
                borderColor: colors.layoutThemeLight,
                borderStyle: 'dashed',
              }}>
              <UI.Text
                size={14 / fontScale}
                ml="auto"
                font={fonts.rm}
                mr="auto"
                color={colors.layoutTheme}
                style={{letterSpacing: 2}}>
                {otpDetails?.data?.code}
              </UI.Text>
            </UI.Div>
            <TouchableOpacity
              onPress={() => copyToClipboard()}
              style={{
                width: '30%',
                justifyContent: 'center',
                marginRight: 'auto',
                alignItems: 'center',
                marginLeft: 'auto',
              }}>
              {copyLoading ? (
                <Ionicons name="copy" color={colors.layoutTheme} size={20} />
              ) : (
                <Ionicons
                  name="copy-outline"
                  color={colors.layoutTheme}
                  size={20}
                />
              )}

              <UI.Text
                font={fonts.rr}
                size={14 / fontScale}
                ml="auto"
                mr="auto">
                Copy
              </UI.Text>
            </TouchableOpacity>
          </UI.Flex>
          <UI.Text
            mt={10}
            ml="auto"
            width={'70%'}
            center
            mr="auto"
            font={fonts.rm}
            size={16 / fontScale}>
            Share your referral code with your friends and get benefits.
          </UI.Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              width: '60%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            onPress={() => shareFriendsRef()}>
            <LinearGradient
              locations={[0.1, 0.9]}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
              colors={['#FFD9B9', '#F48628']}
              // colors={['#F48628', '#FFC99B']}
              // colors={[colors.layoutTheme, colors.brownColor]}
              style={[
                styles.gradient,
                {
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <UI.Text
                font={fonts.rr}
                color={colors.white}
                mr={10}
                size={16 / fontScale}>
                Invite Friends
              </UI.Text>
              <Fontisto name="share" color="#fff" size={22} />
            </LinearGradient>
          </TouchableOpacity>
          {/* <UI.Button
            onPress={() => shareFriendsRef()}
            mt={20}
            mr="auto"
            ml="auto"
            gpb={10}
           
            gpt={10}
            width={'50%'}
            text=""
          /> */}
        </UI.Div>
        {/* *********************************************Delete Account Btn****************************************************************************/}
        <UI.Div mt="10%" mb={'10%'}>
          <TouchableOpacity
            style={{marginLeft: 'auto', marginRight: 'auto'}}
            onPress={() => deleteAccount()}>
            <UI.Text
              center
              font={fonts.rr}
              size={14 / fontScale}
              color={colors.layoutTheme}
              style={{textDecorationLine: 'underline'}}>
              DELETE ACCOUNT
            </UI.Text>
          </TouchableOpacity>
        </UI.Div>
        <UI.Text
          size={14 / fontScale}
          color={colors.layoutThemeLight}
          ml={'auto'}
          mr={'auto'}
          font={fonts.rr}>
          Version - {getVersion()}
        </UI.Text>
        <UI.Div mt={20}>
          <UI.Flex middle center>
            <UI.Text
              font={fonts.rr}
              size={20 / fontScale}
              color={colors.layoutShadow}>
              GOOD HEALTH |
            </UI.Text>
            <UI.Text
              font={fonts.rr}
              color={colors.layoutShadow}
              size={20 / fontScale}>
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
                <UI.Text
                  font={fonts.rr}
                  size={16 / fontScale}
                  color={colors.layoutTheme}>
                  Close
                </UI.Text>
              </TouchableOpacity>
              <View style={{alignItems: 'center'}}>
                <UI.Text
                  font={fonts.rr}
                  size={14 / fontScale}
                  ml="auto"
                  mr="auto"
                  color={colors.grayMid}>
                  Upload Photo
                </UI.Text>
                <UI.Text
                  font={fonts.rr}
                  size={14 / fontScale}
                  ml="auto"
                  mr="auto"
                  color={colors.grayMid}>
                  Choose Image
                </UI.Text>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose, {marginTop: 16}]}
                onPress={() => takePhoto()}>
                <UI.Text
                  size={16 / fontScale}
                  center
                  ml="auto"
                  mr="auto"
                  color="#fff"
                  font={fonts.rm}>
                  Take Photo
                </UI.Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => uploadPhoto()}
                style={[styles.button, styles.buttonClose]}>
                <UI.Text
                  size={16 / fontScale}
                  center
                  ml="auto"
                  mr="auto"
                  color="#fff"
                  font={fonts.rm}>
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
                <AntDesign name="close" size={30} color={colors.layoutTheme} />
              </TouchableOpacity>
              <KeyboardAwareScrollView>
                <UI.Div p={10}>
                  <UI.Div mb={10}>
                    <UI.Text
                      font={fonts.rm}
                      color={colors.layoutTheme}
                      size={16 / fontScale}>
                      Full Name{' '}
                      <UI.Text
                        size={16 / fontScale}
                        font={fonts.rm}
                        color={'#f87171'}>
                        *
                      </UI.Text>
                    </UI.Text>
                    <TextInput
                      value={formData.fullName}
                      onChangeText={ex =>
                        setFormData({...formData, fullName: ex})
                      }
                      ref={refInput}
                      autoFocus={true}
                      style={{
                        fontFamily: fonts.rr,
                        fontSize: 14 / fontScale,
                        marginTop: 10,
                        borderColor: colors.grayMid,
                        width: '100%',
                        borderWidth: 1,
                        borderRadius: 6,
                        height: 50,
                        padding: 10,
                      }}
                    />
                    <UI.Text
                      font={fonts.rr}
                      size={14 / fontScale}
                      color="#f87171">
                      {formErrors.fullName}
                    </UI.Text>
                  </UI.Div>
                  <UI.Div mb={10}>
                    <UI.Text
                      font={fonts.rm}
                      color={colors.layoutTheme}
                      size={16 / fontScale}>
                      Email{' '}
                      <UI.Text
                        size={16 / fontScale}
                        font={fonts.rm}
                        color={'#f87171'}>
                        *
                      </UI.Text>
                    </UI.Text>
                    <TextInput
                      editable={
                        checkData.email == '' || checkData.email == null
                          ? true
                          : false
                      }
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={ex => setFormData({...formData, email: ex})}
                      style={{
                        fontSize: 14 / fontScale,
                        marginTop: 10,
                        fontFamily: fonts.rr,
                        borderColor: colors.grayMid,
                        width: '100%',
                        borderWidth: 1,
                        borderRadius: 6,
                        height: 50,
                        padding: 10,
                        backgroundColor:
                          checkData.email == '' || checkData.email == null
                            ? '#fff'
                            : '#f1f5f9',
                      }}
                    />
                    <UI.Text
                      font={fonts.rr}
                      size={14 / fontScale}
                      color="#f87171">
                      {formErrors.email}
                    </UI.Text>
                  </UI.Div>
                  <UI.Div mb={10}>
                    <UI.Text
                      font={fonts.rm}
                      color={colors.layoutTheme}
                      size={16 / fontScale}>
                      Phone Number{' '}
                      <UI.Text
                        size={16 / fontScale}
                        font={fonts.rm}
                        color={'#f87171'}>
                        *
                      </UI.Text>
                    </UI.Text>
                    <TextInput
                      editable={
                        checkData.phNumber == '' || checkData.phNumber == null
                          ? true
                          : false
                      }
                      onChangeText={ex =>
                        setFormData({...formData, phNumber: ex})
                      }
                      value={formData.phNumber}
                      style={{
                        fontFamily: fonts.rr,
                        fontSize: 14 / fontScale,
                        marginTop: 10,
                        borderColor: colors.grayMid,
                        width: '100%',
                        borderWidth: 1,
                        borderRadius: 6,
                        height: 50,
                        padding: 10,
                        backgroundColor:
                          checkData.phNumber == '' || checkData.phNumber == null
                            ? '#fff'
                            : '#f1f5f9',
                      }}
                    />
                    <UI.Text
                      font={fonts.rr}
                      size={14 / fontScale}
                      color="#f87171">
                      {formErrors.phNumber}
                    </UI.Text>
                  </UI.Div>
                  {/* <UI.Div mb={10}>
                    <UI.Text
                      font={fonts.rm}
                      color={colors.layoutTheme}
                      size={16 / fontScale}>
                      Alt Phone Number
                    </UI.Text>
                    <TextInput
                      value={formData.altNumber}
                      onChangeText={ex =>
                        setFormData({...formData, altNumber: ex})
                      }
                      style={{
                        fontSize: 14 / fontScale,
                        marginTop: 10,
                        borderColor: colors.grayMid,
                        width: '100%',
                        borderWidth: 1,
                        borderRadius: 6,
                        height: 50,
                        padding: 10,
                        fontFamily: fonts.rr,
                      }}
                    />
                    <UI.Text
                      font={fonts.rr}
                      size={14 / fontScale}
                      color="#f87171">
                      {formErrors.altNumber}
                    </UI.Text>
                  </UI.Div> */}
                  {updateProfileLoading ? (
                    <UI.Button
                      gpb={10}
                      gpt={10}
                      size={16 / fontScale}
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
                      size={16 / fontScale}
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
    </Layout>
  );
};

export default Profile;
var styles = StyleSheet.create({
  loginBG: {
    borderRadius: 100,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalViewD: {
    maxWidth: Platform.isPad ? '60%' : '80%',
    width: Platform.isPad ? '60%' : '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: Platform.isPad ? 20 : 16,
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
    fontWeight: 'font={fonts.rm}',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  gradient: {
    overflow: 'hidden',
    borderRadius: 50,

    // paddingVertical: 6,
    // paddingHorizontal: 10,
    // paddingBottom: 15,
    // paddingTop: 15,
    display: 'flex',
    alignItems: 'center',
  },
});
