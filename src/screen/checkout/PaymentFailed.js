import React, { useState, useEffect } from 'react';
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
  Alert,
  BackHandler,
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import { colors, screen } from '../../Components/Design';
import { useSelector } from 'react-redux';
import { imageUrl } from '../../../config';
import LottieView from 'lottie-react-native';
import Navigation from '../Navigation';
import { useNavigation } from '@react-navigation/native';
import { fonts } from '../../Components/common/CustomFonts';

const PaymentFailed = props => {
  const { width, fontScale } = Dimensions.get('window');
  const navigation = useNavigation();
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
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
            source={require('../../assets/json/payment_faild.json')}
          />
        </UI.Div>
        <UI.Text
          font={fonts.rm}
          mr="auto"
          ml="auto"
          color={'red'}
          size={18 / fontScale}>
          PAYMENT FAILED
        </UI.Text>

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
          <UI.Flex
            middle
            spaceb
            style={{borderBottomWidth: 1, borderColor: colors.grayMid}}>
            <UI.Text>Total amount paid</UI.Text>
            <UI.Text>Rs 3599</UI.Text>
          </UI.Flex>
          <UI.Flex
            middle
            spaceb
            style={{borderBottomWidth: 1, borderColor: colors.grayMid}}>
            <UI.Text>Payment mode</UI.Text>
            <UI.Text>CC/DC Card</UI.Text>
          </UI.Flex>
          <UI.Flex middle spaceb>
            <UI.Text>Transaction date</UI.Text>

            <UI.Text>30/10/2023</UI.Text>
          </UI.Flex>
        </UI.Div> */}

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

        {/* <UI.Div width="90%" mr={'auto'} ml={'auto'}>
          <UI.Flex mt={30} center middle width="100%">
            <UI.Div
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
            </UI.Div>
            <UI.Button
              onPress={() => navigation.navigate('YourOrders')}
              width={'40%'}
              text="view orders"
              gpb={6}
              gpt={6}
            />
          </UI.Flex>
        </UI.Div> */}
        <UI.Button
          mb={10}
          onPress={() => navigation.navigate('AppDrawerStack', { screen: 'Home' })}
          mt={'40%'}
          size={16 / fontScale}
          width={'60%'}
          ml={'auto'}
          mr={'auto'}
          text="Back to Home"
          gpb={10}
          gpt={10}
        />
      </ScrollView>
    </Layout>
  );
};

export default PaymentFailed;
