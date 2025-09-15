import {
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  DrawerContent,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import HomeScreen from './Home/HomeScreen';
import Cart from './cart/Cart';
import {colors, screen} from '../Components/Design';
import LoginScreen from './Login/LoginScreen';
import OtpScreen from './Login/OtpScreen';
import * as UI from '../Components/UI/UI';
import Registration from './Login/Registration';
import ProductsDetails from './products/ProductsDetails';
import Favorites from './favorites/Favorites';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ContactUs from './contactUs/ContactUs';
import AboutUs from './about/AboutUs';
import {blue} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import {tmsLogo} from '../Components/common/ALLImages';
import Profile from './profile';
import CategoryByProduct from './categoryByProduct/Index';
import Checkout from './checkout/Index';
import PaymentSuccess from './checkout/PaymentSuccess';
import {logout} from '../Redux/reducerSlice/AuthSlice';
import {ToastProvider, useToast} from 'react-native-toast-notifications';
import {fetchCarts, resetCartData} from '../Redux/reducerSlice/CartSlicer';
import ViewAllProducts from './products/ViewAllProducts';
import YourOrders from './orders/YourOrders';
import StoreLocation from './contactUs/StoreLocation';
import SearchScreen from './SearchScreen';
import {
  fetchWishlist,
  resetWishlistData,
} from '../Redux/reducerSlice/WishlistSlice';
import ViewAllCategory from './products/ViewAllCategory';
import {
  fetchProfileData,
  resetUserProfileData,
} from '../Redux/reducerSlice/ProfileSlice';
import Address from './address/Address';
import AddNewAddress from './address/AddNewAddress';
import EditAddress from './address/EditAddress';
import {addDefaultAddress} from '../Redux/reducerSlice/AllactionSlice';
import EnquiryForFranchise from './enquiryForFranchise/EnquiryForFranchise';
import ViewAllOtherProducts from './otherProducts/ViewAllOtherProducts';
import RNFetchBlob from 'rn-fetch-blob';
import {fetchProfilePhoto} from '../Redux/reducerSlice/ProfileImageSlice';
import Payments from './checkout/Payments';
import OrderSummary from './orders/OrderSummary';
import Reviews from './reviews/Reviews';
import PaymentFailed from './checkout/PaymentFailed';
import SelectAddress from './address/SelectAddress';
import ViewAllReview from './reviews/ViewAllReview';
import {profileImg} from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fonts} from '../Components/common/CustomFonts';
const Bottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DrawerStack = createDrawerNavigator();
const navOptionHandler = {
  headerShown: false,
  animation: 'none',
  // cardStyleInterpolator: forSlide,
};

// Drawer code
function AppDrawerStack() {
  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
      }}
      drawerContent={props => <DrawerView {...props} />}>
      <DrawerStack.Screen name="BottomNavigator" component={BottomNavigator} />
      <DrawerStack.Screen name="ViewAllCategory" component={ViewAllCategory} />
      <DrawerStack.Screen name="AboutUs" component={AboutUs} />
      <DrawerStack.Screen name="Profile" component={Profile} />
      <DrawerStack.Screen name="favorite" component={Favorites} />
      <DrawerStack.Screen
        name="EnquiryForFranchise"
        component={EnquiryForFranchise}
      />
      <DrawerStack.Screen name="ContactUs" component={ContactUs} />
      <DrawerStack.Screen name="StoreLocation" component={StoreLocation} />
      <DrawerStack.Screen name="SearchScreen" component={SearchScreen} />

      {/* inquiry for franchise */}
    </DrawerStack.Navigator>
  );
}

function DrawerView(props) {
  const {width, fontScale} = Dimensions.get('window');

  const [profilePicture, setProfilePicture] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {profileData} = useSelector(state => state.profile);
  const {uploadProfilePhotoStatus, getProfilePhoto} = useSelector(
    state => state.profileImage,
  );
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      dispatch(fetchCarts(userInfo?.data?.securityCode));
      dispatch(fetchProfileData(userInfo?.data?.securityCode));
      dispatch(fetchWishlist(userInfo?.data?.securityCode));
      getProfileImage();
    });

    return () => {
      focused();
    };
  }, [userInfo?.data?.securityCode]);

  useEffect(() => {
    getProfileImage();
  }, [uploadProfilePhotoStatus]);

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
                setProfilePicture(`data:image/png;base64,${base64Str}`);
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
          setProfilePicture(null);
        }
      })
      .catch(err => console.log(' fetchProfilePhoto err', err));
  };

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        flex: 1,
        backgroundColor: colors.grayLight,
      }}>
      <View style={{height: '100%', backgroundColor: '#fff', flex: 1}}>
        <View
          style={{
            backgroundColor: colors.layoutTheme,
            height: Platform.isPad ? 180 : Platform.OS == 'android' ? 130 : 130,
            paddingTop: Platform.isPad ? 50 : 0,
          }}>
          <UI.Flex spaceb height="100%" p={10}>
            <View
              style={{
                width: 90,
                alignSelf: 'center',
                height: 90,
              }}>
              {profilePicture ? (
                <Image
                  source={{
                    uri: `${profilePicture}`,
                  }}
                  style={style.loginBG}
                />
              ) : (
                <Image
                  source={require('../assets/img/profile.jpg')}
                  style={style.loginBG}
                />
              )}
            </View>
            <UI.Div width="60%" height="100%" p={6}>
              {isLogin && (
                <UI.Text
                  mt={10}
                  color="#fff"
                  size={16 / fontScale}
                  ont={fonts.rm}>
                  {profileData?.data?.name}
                </UI.Text>
              )}
              {/* {isLogin ? (
            <UI.Text color="#fff" mt={6} size={16} bold>
              {profileData?.data?.email == null
                ? ''
                : `${profileData.data.email}`}
            </UI.Text>
          ) : null}
          {isLogin ? (
            <UI.Text color="#fff" mt={4} size={14} bold>
              {userInfo?.data?.phone == null
                ? ''
                : `${userInfo?.data?.phone}`}
            </UI.Text>
          ) : null} */}
              <View
                style={{
                  left: 10,
                  position: 'absolute',
                  zIndex: 1,
                  bottom: 10,
                }}>
                {isLogin ? (
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('AppDrawerStack',{screen:'Profile'})}>
                    <UI.Text
                      font={fonts.rr}
                      size={14 / fontScale}
                      color="#fff"
                      style={{textDecorationLine: 'underline'}}>
                      Edit Profile
                    </UI.Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </UI.Div>
          </UI.Flex>
        </View>

        <DrawerContentScrollView
          contentContainerStyle={{
            paddingTop: 10,
          }}
          style={{height: '100%', position: 'relative'}}>
          <DrawerItem
            style={{
              fontSize: 14 / fontScale,
              backgroundColor:
                props.state.index == 0 ? '#ffedd5' : colors.grayLight,
            }}
            label="Home"
            onPress={() => props.navigation.navigate('BottomNavigator')}
          />
          <DrawerItem
            style={{
              fontSize: 14 / fontScale,
              backgroundColor:
                props.state.index == 1 ? '#ffedd5' : colors.grayLight,
            }}
            label="All Categories"
            onPress={() => props.navigation.navigate('ViewAllCategory')}
          />
          <DrawerItem
            style={{
              fontSize: 14 / fontScale,
              backgroundColor:
                props.state.index == 2 ? '#ffedd5' : colors.grayLight,
            }}
            label="About Us"
            onPress={() => props.navigation.navigate('AboutUs')}
          />

          <DrawerItem
            style={{
              fontSize: 14 / fontScale,
              backgroundColor:
                props.state.index == 3 ? '#ffedd5' : colors.grayLight,
            }}
            label="Enquiry for Franchise"
            onPress={() => props.navigation.navigate('EnquiryForFranchise')}
          />

          <DrawerItem
            style={{
              fontSize: 14 / fontScale,
              backgroundColor:
                props.state.index == 4 ? '#ffedd5' : colors.grayLight,
            }}
            label="Contact Us"
            onPress={() => props.navigation.navigate('ContactUs')}
          />
          <DrawerItem
            style={{
              fontSize: 14 / fontScale,
              backgroundColor:
                props.state.index == 5 ? '#ffedd5' : colors.grayLight,
            }}
            label="Store Locator"
            onPress={() => props.navigation.navigate('StoreLocation')}
          />

          {/* EnquiryForFranchise  */}
        </DrawerContentScrollView>
        {isLogin === true && (
          <View style={{bottom: 30, width: '100%', position: 'absolute'}}>
            <UI.Button
              onPress={() => {
                dispatch(resetUserProfileData());
                dispatch(resetWishlistData());
                dispatch(resetCartData());
                dispatch(logout());
                dispatch(addDefaultAddress(null));
                AsyncStorage.clear();
                props.navigation.closeDrawer();
                toast.show(`Logged out successfully.`, {
                  type: 'success',
                  placement: 'bottom',
                  duration: 2000,
                  offset: 30,
                  animationType: 'slide-in | zoom-in',
                });
              }}
              border
              pt={8}
              size={14 / fontScale}
              pb={8}
              bg="#fff"
              width={'80%'}
              ml={'auto'}
              mr="auto"
              b={2}
              bR={6}
              text="LOG OUT"
              bColor={colors.layoutTheme}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const BottomNavigator = props => {
  const {cartTotalAmount, cartTotalQuantity} = useSelector(state => state.cart);
  const {isLogin, otpDetails} = useSelector(state => state.login);
  const {carts} = useSelector(state => state.cart);
  const {wishlist} = useSelector(state => state.wishlist);

  return (
    <Bottom.Navigator
      initialRouteName="Home"
      // screenOptions={{
      //   tabBarActiveTintColor: 'orange',
      // }}
      screenOptions={{
        tabBarShowLabel: false,
        // showLabel: false,
        tabBarStyle: [
          {
            // display: 'flex',
            position: 'absolute',
            bottom: -20,
            // left: 10,
            // right: 10,
            elevation: 4,
            backgroundColor: '#fff',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            height: Platform.isPad ? 100 : 90,
            paddingVertical: 2,
            // paddingHorizontal: 50,

            ...style.shadow,
          },
          null,
        ],
      }}>
      <Bottom.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // borderBottomWidth: 8,
                // paddingBottom: 8,
                borderBottomColor: focused
                  ? colors.layoutTheme
                  : colors.grayBold,
                width: Platform.isPad ? 200 : '100%',
                height: 100,
              }}>
              <MaterialCommunityIcons
                name="home"
                size={30}
                color={focused ? colors.layoutTheme : '#94a3b8'}
              />
              {/* <Text style={{color: focused ? colors.boldTheme : '#94a3b8'}}>
                Home
              </Text> */}
            </View>
          ),
        }}
        name="Home"
        component={HomeScreen}
      />
      <Bottom.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'favorite',
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // borderBottomWidth: 8,
                // paddingBottom: 8,
                borderBottomColor: focused ? colors.layoutTheme : '#94a3b8',
                width: Platform.isPad ? 200 : '100%',
                height: 100,

              }}>
              {wishlist?.length == 0 ||
              wishlist === null ||
              isLogin == false ? (
                <MaterialCommunityIcons
                  name="cards-heart"
                  size={30}
                  color={focused ? colors.layoutTheme : '#94a3b8'}
                />
              ) : (
                <MaterialCommunityIcons
                  name="cards-heart"
                  size={30}
                  color={colors.layoutTheme}
                />
              )}

              {/* <Text style={{color: focused ? colors.layoutTheme : '#94a3b8'}}>
                login
              </Text> */}
            </View>
          ),
        }}
        name="favorite"
        component={Favorites}
      />
      <Bottom.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'cart',
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',

                // width: 60,
                // borderBottomWidth: 9,
                position: 'relative',
                // paddingBottom: 10,
                borderBottomColor: focused
                  ? colors.layoutTheme
                  : colors.grayBold,
                width: Platform.isPad ? 200 : '100%',
                height: 100,

              }}>
              <UI.Div>
                <FontAwesome5
                  name="shopping-cart"
                  size={28}
                  color={focused ? colors.layoutTheme : '#94a3b8'}
                />

                {carts == null ||
                carts?.length == 0 ||
                carts?.data?.length == 0 ? null : (
                  <View
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: Platform.isPad ? -10 : -10,
                      // width: 60,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 50,
                      fontSize: 10,
                      color: '#fff',
                      backgroundColor: colors.layoutTheme,
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#fff',
                        backgroundColor: colors.layoutTheme,
                      }}>
                      {carts?.data?.length}
                    </Text>
                  </View>
                )}
              </UI.Div>
            </View>
          ),
        }}
        name="cart"
        component={Cart}
      />
      {isLogin ? (
        <Bottom.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // borderBottomWidth: 8,
                  // paddingBottom: 8,
                  borderBottomColor: focused ? colors.layoutTheme : '#94a3b8',
                  width: Platform.isPad ? 200 : '100%',
                height: 100,

                }}>
                <FontAwesome
                  name="user-circle"
                  size={30}
                  color={focused ? colors.layoutTheme : '#94a3b8'}
                />
              </View>
            ),
          }}
          name="Profile"
          component={Profile}
        />
      ) : (
        <Bottom.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'login',
            tabBarIcon: ({color, focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // borderBottomWidth: 8,
                  // paddingBottom  : 8,
                  borderBottomColor: focused ? colors.layoutTheme : '#94a3b8',
                  width: Platform.isPad ? 200 : '100%',
                height: 100,

                }}>
                <FontAwesome
                  name="user-circle"
                  size={30}
                  color={focused ? colors.layoutTheme : '#94a3b8'}
                />
              </View>
            ),
          }}
          name="login"
          component={LoginScreen}
        />
      )}
    </Bottom.Navigator>
  );
};

const Navigation = () => {
  const navigateNavigation = useNavigation();
  return (
    <ToastProvider
      renderToast={toastOptions => (
        <View
          style={{
            marginVertical: 60,
            backgroundColor:
              toastOptions.type == 'success'
                ? '#16a34a'
                : toastOptions.type == 'custom'
                ? '#334155'
                : toastOptions.type == 'warning'
                ? '#fbbf24'
                : toastOptions.type == 'error'
                ? '#f43f5e'
                : toastOptions.type == 'black'
                ? '#334155'
                : '',

            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
          }}>
          <UI.Flex>
            <Text
              style={{
                color: '#fff',
              }}>
              {toastOptions.message}{' '}
            </Text>
            {toastOptions?.url == 'cart' && (
              <Pressable
                style={{}}
                onPress={() => navigateNavigation.navigate('cart')}>
                <Text
                  style={{
                    color: '#fff',
                    textDecorationLine: 'underline',
                  }}>
                  Go to cart.
                </Text>
              </Pressable>
            )}
          </UI.Flex>
        </View>
      )}
      // renderType={{
      //   custom_type: toast => (
      //     <View style={{padding: 15, backgroundColor: 'grey'}}>
      //       <Text style={{color: 'red'}}>asdas</Text>
      //     </View>
      //   ),
      // }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gesturesEnabled: false,
        }}>
        {/* <Stack.Screen
          options={{gestureEnabled: false}}
          name="Home"
          component={HomeScreen}
        /> */}
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="AppDrawerStack"
          component={AppDrawerStack}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="otp"
          component={OtpScreen}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="ProductsDetails"
          component={ProductsDetails}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="registration"
          component={Registration}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="Checkout"
          component={Checkout}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="ViewAllProducts"
          component={ViewAllProducts}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="YourOrders"
          component={YourOrders}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="OrderSummary"
          component={OrderSummary}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="Reviews"
          component={Reviews}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="address"
          component={Address}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="ViewAllReview"
          component={ViewAllReview}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="SelectAddress"
          component={SelectAddress}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="addNewAddress"
          component={AddNewAddress}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="editAddress"
          component={EditAddress}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="CategoryByProduct"
          component={CategoryByProduct}
        />
        {/* <Stack.Screen
          options={{gestureEnabled: false}}
          name="ViewAllCategory"
          component={ViewAllCategory}
        /> */}

        <Stack.Screen
          options={{gestureEnabled: false}}
          name="viewAllOtherProducts"
          component={ViewAllOtherProducts}
        />

        <Stack.Screen
          options={{gestureEnabled: false}}
          name="paymentSuccess"
          component={PaymentSuccess}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="paymentFailed"
          component={PaymentFailed}
        />

        <Stack.Screen
          options={{gestureEnabled: false}}
          name="payments"
          component={Payments}
        />
      </Stack.Navigator>
    </ToastProvider>
  );
};

export default Navigation;

const style = StyleSheet.create({
  shadow: {
    shadowColor: '#f7a824',
    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 10,
  },
  loginBG: {
    borderRadius: 100,
    width: '100%',
    height: '100%',
  },
});
