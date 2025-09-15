import React, {useState, useEffect, useRef} from 'react';
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
  BackHandler,
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {useSelector} from 'react-redux';
import {imageUrl} from '../../../config';
import LottieView from 'lottie-react-native';
import Navigation from '../Navigation';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../../Components/common/CustomFonts';
import moment from 'moment';

const PaymentSuccess = props => {
  const {width, fontScale} = Dimensions.get('window');
  const navigation = useNavigation();
  const backHandler = useRef(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home');
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <Layout showBar comProps={props}>
      <ScrollView>
        <UI.Div
          mt={'5%'}
          mr={'auto'}
          ml={'auto'}
          style={{
            width: 250,
            height: 250,
          }}>
          <LottieView
            style={{
              borderRadius: 17,
              height: '100%',
              width: '100%',
            }}
            autoPlay={true}
            loop
            resizeMode="cover"
            source={require('../../assets/json/payment_succ.json')}
          />
        </UI.Div>
        <UI.Text font={fonts.rm} center color={'#54D200'} size={18 / fontScale}>
          PAYMENT SUCCESSFUL
        </UI.Text>

        <UI.Div
          mt={20}
          mr={'auto'}
          ml={'auto'}
          p={10}
          width="80%"
          bg={colors.grayLight}
          style={{
            borderWidth: 1,
            borderColor: colors.grayMid,
            borderRadius: 6,
          }}>
          <UI.Flex
            middle
            spaceb
            style={{borderBottomWidth: 1, borderColor: colors.grayMid}}>
            <UI.Text font={fonts.rr} size={14 / fontScale}>
              Total amount paid
            </UI.Text>
            <UI.Text font={fonts.rr} size={14 / fontScale}>
              ₹{props.route?.params?.details?.total}
            </UI.Text>
          </UI.Flex>
          {/* <UI.Flex
            middle
            spaceb
            style={{borderBottomWidth: 1, borderColor: colors.grayMid}}>
            <UI.Text>Payment mode</UI.Text>
            <UI.Text>CC/DC Card</UI.Text>
          </UI.Flex> */}
          <UI.Flex middle spaceb>
            <UI.Text font={fonts.rr} size={14 / fontScale}>
              Transaction date
            </UI.Text>

            <UI.Text font={fonts.rr} size={14 / fontScale}>
              {/* 30/10/2023 */}{' '}
              {moment(props.route?.params?.details?.orderDate).format(
                'DD/MM/YYYY',
              )}
            </UI.Text>
          </UI.Flex>
        </UI.Div>

        {/* <UI.Div
          mt={20}
          mr={'auto'}
          ml={'auto'}
          p={10}
          width="80%"
          bg={colors.grayLight}
          style={{
            borderWidth: 1,
            borderColor: colors.grayMid,
            borderRadius: 6,
          }}>
          <Text>Transaction Id: idfj13888kjbjf87</Text>
        </UI.Div> */}

        <UI.Div width="90%" mr={'auto'} ml={'auto'}>
          <UI.Flex mt={30} center middle width="100%">
            {/* <UI.Div
              p={6}
              width="50%"
              mr={10}
              bg={colors.grayLight}
              style={{
                borderWidth: 1,
                borderColor: colors.grayMid,
                borderRadius: 6,
              }}>
              <Text>Order Id: 245267880557</Text>
            </UI.Div> */}
            <UI.Button
              onPress={() => navigation.navigate('YourOrders')}
              width={'40%'}
              text="view orders"
              size={16 / fontScale}
              gpb={6}
              gpt={6}
            />
          </UI.Flex>
        </UI.Div>
        <UI.Button
          mb={10}
          onPress={() => navigation.navigate('Home')}
          mt={30}
          width={'40%'}
          ml={'auto'}
          size={16 / fontScale}
          mr={'auto'}
          text="Back to Home"
          gpb={6}
          gpt={6}
        />
      </ScrollView>
    </Layout>
  );
};

export default PaymentSuccess;
