import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  BackHandler,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import DeviceInfo from 'react-native-device-info';

import {TextPa} from './Design';
import * as UI from '../UI/UI';
import {colors} from '../Design';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AutoComplete from './AutoComplete/AutoComplete';
import data from '../../Components/aasdasdasd/data.json';
import {fullLogo, roundLogo, tmsLogo} from './ALLImages';
import {height} from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
import {logout, verifyToken} from '../../Redux/reducerSlice/AuthSlice';
import {resetUserProfileData} from '../../Redux/reducerSlice/ProfileSlice';
import {resetWishlistData} from '../../Redux/reducerSlice/WishlistSlice';
import {resetCartData} from '../../Redux/reducerSlice/CartSlicer';
import {addDefaultAddress} from '../../Redux/reducerSlice/AllactionSlice';
import NetInfo from '@react-native-community/netinfo';
import {fonts} from './CustomFonts';

const Layout = props => {
  const {width, fontScale} = Dimensions.get('window');
  const navigation = useNavigation();
  const router = useRoute();
  const dispatch = useDispatch();
  const {cart} = useSelector(state => state.cart);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  //dots-three-vertical
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] = useState(false);
  const route = useRoute();

  const canGoBack = () => {
    navigation.goBack();
  };

  const handleNetworkChange = state => {
    setConnectionStatus(!state.isConnected);
    // if (state.isConnected) {
    //   setConnectionStatus(false);
    // } else {
    //   setConnectionStatus(true);
    // }
  };
  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, [connectionStatus]);
  useEffect(() => {
    dispatch(verifyToken(userInfo?.data?.securityCode))
      .unwrap()
      .then(res => {
        if (res?.isSuccess === false) {
          dispatch(resetUserProfileData());
          dispatch(resetWishlistData());
          dispatch(resetCartData());
          dispatch(logout());
          dispatch(addDefaultAddress(null));
        } else {
        }
      })
      .catch(err => console.log('err', err));
  }, []);

  // AutoComplete start
  // const options =
  //   data &&
  //   data.map(item => ({
  //     ...item,
  //     id: item.id,
  //     value: item.title, // value is required !what you searching in input (auto Complete)
  //   }));

  // const selectItem = item => {};

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f1f2f4', '#f1f2f4']}
        start={{x: 1, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linearGradient}>
        <StatusBar
          animated={true}
          backgroundColor={colors.layoutTheme}
          barStyle={'dark-content'}
          //  showHideTransition={statusBarTransition}
          //  hidden={hidden}
          //   {
          //     shadowColor: '#000',
          //     shadowOffset: {
          //       width: 0,
          //       height: 4,
          //     },
          //     shadowOpacity: 0.1,
          //     shadowRadius: 1.65,
          //   },
        />
        {props?.showBar !== undefined ? (
          <UI.Flex
            middle
            spaceb
            style={{
              height: 60,
              position: 'relative',
              zIndex: 1,
              paddingHorizontal: 16,
              elevation: 1,
              paddingVertical: 2,
              backgroundColor: colors.grayLight,
              shadowColor: '#52006A',
            }}>
            <View>
              {props?.back !== undefined ? (
                <TouchableOpacity
                  style={{padding: 10}}
                  onPress={() => canGoBack()}>
                  <FontAwesome5
                    name="chevron-left"
                    size={22}
                    color={colors.dark}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {/* <UI.Flex middle style={{borderWidth: 1, width: 300}}> */}
            {/* <Image source={roundLogo} style={styles.round} /> */}
                       <Image source={fullLogo} style={[styles.loginBG, {marginLeft :props?.back != undefined ? 0 :30 }]} />

            {/* </UI.Flex> */}
            <UI.Div>
              {props?.Dra !== undefined ? (
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.openDrawer();
                  }}>
                  <FontAwesome6
                    name="bars"
                    size={22}
                    color={colors.dark}
                  />
                </TouchableOpacity>
              ) : null}
            </UI.Div>
          </UI.Flex>
        ) : null}

        {props.sBar !== undefined ? (
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              zIndex: 1,
              elevation: 2,
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: colors.grayLight,
            }}
            // spaceb
            // middle
            // width={'100%'}
            // height={50}
            // bg={colors.white}
          >
            <View
              style={{
                alignItems: 'center',

                marginLeft: 'auto',
                marginRight: 'auto',
                flexDirection: 'row',
                zIndex: 1,
                elevation: 2,
                height: 50,
                borderRadius: 6,
                paddingHorizontal: 10,
                backgroundColor: colors.white,
              }}>
              <FontAwesome name="search" size={25} color={colors.grayBold} />

              <TouchableOpacity
                //
                onPress={() => {
                  navigation.navigate('SearchScreen');
                }}
                style={{
                  width: '90%',
                  height: '100%',
                  justifyContent: 'center',
                }}>
                <UI.Text
                  ml={5}
                  size={14 / fontScale}
                  font={fonts.rr}
                  color={colors.grayBoldMax}>
                  Search...
                </UI.Text>
              </TouchableOpacity>
            </View>
            {/* <AutoComplete
              w={'95%'}
              h={'100%'}
              options={options}
              defaultValue={''} // optional default Value now only for text
              selectItem={selectItem}
              placeholder="Search"
            /> */}
          </View>
        ) : null}
        {props.children}

        <Modal
          animationType="slide"
          transparent={true}
          visible={connectionStatus}
          onRequestClose={() => {
            setConnectionStatus(!connectionStatus);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <UI.Text
                ml={'auto'}
                mr={'auto'}
                size={20}
                color="#000"
                font={fonts.rm}
                style={styles.modalText}>
                Connection Error
              </UI.Text>
              <UI.Text
                ml={'auto'}
                mr={'auto'}
                mt={16}
                size={16 / fontScale}
                center
                font={fonts.rr}>
                Oops! Looks like your device is not connected to the internet.
              </UI.Text>

              <TouchableOpacity
                onPress={() => setConnectionStatus(!connectionStatus)}
                style={{
                  width: '90%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  paddingVertical: 14,
                  borderRadius: 6,
                  marginTop: 20,
                  marginBottom: '10%',
                  backgroundColor: colors.layoutTheme,
                }}>
                <UI.Text
                  ml={'auto'}
                  mr={'auto'}
                  size={14 / fontScale}
                  color="#fff"
                  font={fonts.rm}>
                  Try Again
                </UI.Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Layout;
var styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  logo: {
    height: 130,
    width: 150,
    resizeMode: 'stretch',
  },
  loginBG: {
    width: 140,
    height: '70%',

    // height: '100%',
    resizeMode: 'contain',
  },
  round: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  centeredView: {
    flex: 1,

    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: 220,
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
});
