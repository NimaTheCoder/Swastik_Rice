import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
  PixelRatio,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Layout from '../../Components/common/Layouts';

import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {LoginBg, roundLogo, tmsLogo} from '../../Components/common/ALLImages';
import {useNavigation} from '@react-navigation/native';
import AddNewAddress from './AddNewAddress';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteAddress,
  fetchAddress,
} from '../../Redux/reducerSlice/AddressSlice';
import {SkeletonLayOutProduct} from '../../Components/common/laoding/Skeleton';
import {addDefaultAddress} from '../../Redux/reducerSlice/AllactionSlice';
import {useToast} from 'react-native-toast-notifications';
import {fonts} from '../../Components/common/CustomFonts';

const Address = props => {
  const {width, fontScale} = Dimensions.get('window');
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {address, getAddressLoading} = useSelector(state => state.address);
  const [showMore, setShowMore] = useState(null);

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      const securityCode = userInfo?.data?.securityCode;
      dispatch(fetchAddress(securityCode));
    });
    return () => {
      focused();
    };
  }, [userInfo]);

  const onRefresh = () => {
    setRefreshing(true);
    const securityCode = userInfo?.data?.securityCode;
    dispatch(fetchAddress(securityCode))
      .unwrap()
      .then(res => {
        if (res?.length == 0) {
          dispatch(addDefaultAddress(null));
        }
      });
    setRefreshing(false);
  };

  const handelDeleteAddress = id => {
    dispatch(deleteAddress(id))
      .unwrap()
      .then(res => {
        if (res?.isSuccess) {
          toast.show('Address deleted successfully.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
          dispatch(fetchAddress(userInfo?.data?.securityCode))
            .unwrap()
            .then(res => {
              if (res?.length == 0) {
                dispatch(addDefaultAddress(null));
              }
            });
        } else {
          toast.show('Failed to delete address. Please try again later.', {
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

  return (
    <Layout showBar back comProps={props}>
      {getAddressLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: colors.white,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.layoutTheme} />
        </View>
      )}
      <ScrollView
        onTouchEnd={e => {
          if (showMore !== null) {
            setShowMore(null);
          }
        }}
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <TouchableOpacity
          onPress={() => navigation.navigate('addNewAddress', {data: null})}
          style={{backgroundColor: '#fff', elevation: 4}}>
          <UI.Flex middle>
            <Entypo name="plus" size={22} color={colors.layoutTheme} />
            <UI.Text
              font={fonts.rm}
              size={14 / fontScale}
              color={colors.layoutTheme}>
              Add a new address
            </UI.Text>
          </UI.Flex>
        </TouchableOpacity>

        {address !== null || address?.data !== null ? (
          <UI.Div mt={20} width="90%" ml="auto" mr="auto">
            {address?.map((el, index) => (
              <UI.Div
                bg="#fff"
                style={{elevation: 2}}
                br={6}
                mb={25}
                key={index}>
                <UI.Flex pr={6} pl={4} pt={4} column>
                  <TouchableOpacity
                    onPress={() => {
                      if (showMore === el.id) {
                        setShowMore(null);
                      } else {
                        setShowMore(el.id);
                      }
                    }}
                    style={{marginLeft: 'auto'}}>
                    <Feather
                      name="more-vertical"
                      size={30}
                      color={colors.garyMidMaxBold}
                    />
                  </TouchableOpacity>
                  {showMore == el.id ? (
                    <View
                      style={{
                        width: '30%',
                        top: '25%',
                        zIndex: 21,
                        backgroundColor: colors.grayMid,
                        right: 0,
                        position: 'absolute',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('addNewAddress', {data: el});
                          setShowMore(null);
                        }}
                        style={{
                          borderBottomWidth: 1,
                          borderBlockColor: colors.grayLight,
                          paddingVertical: 6,
                        }}>
                        <UI.Text font={fonts.rr} size={14 / fontScale} center>
                          Edit
                        </UI.Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handelDeleteAddress(el.id)}
                        style={{
                          paddingVertical: 6,
                        }}>
                        <UI.Text font={fonts.rr} size={14 / fontScale} center>
                          Delete
                        </UI.Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <UI.Div pl={6}>
                    <UI.Div
                      mb={4}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      <UI.Text
                        font={fonts.rm}
                        style={{textTransform: 'capitalize'}}
                        // color={'#000'}
                        size={18 / fontScale}>
                        {el.firstName} {el.lastName}
                      </UI.Text>
                      {/* <Text
                        style={{
                          backgroundColor: colors.grayLight,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          marginLeft: 6,
                          borderRadius: 6,
                          fontSize: 12,
                          color: colors.garyMidMaxBold,
                        }}>
                        WORK
                      </Text> */}
                    </UI.Div>
                    <UI.Text font={fonts.rr} size={14 / fontScale}>
                      {el.state},
                    </UI.Text>
                    <UI.Text font={fonts.rr} size={14 / fontScale}>
                      {el.city},{el.pincode}
                    </UI.Text>
                    <UI.Text font={fonts.rr} size={14 / fontScale}>
                      {el.newAddress}
                    </UI.Text>
                    <UI.Text font={fonts.rr} size={14 / fontScale}>
                      Mobile: {el.phone}
                    </UI.Text>
                  </UI.Div>
                </UI.Flex>
              </UI.Div>
            ))}
          </UI.Div>
        ) : null}
      </ScrollView>
    </Layout>
  );
};

export default Address;
