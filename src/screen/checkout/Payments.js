import React, {useState, useEffect} from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {useSelector} from 'react-redux';
import {imageUrl} from '../../../config';
import LottieView from 'lottie-react-native';
import Navigation from '../Navigation';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

const Payments = props => {
  const navigation = useNavigation();
  const onMessage = e => {};
  const name = 'ripon Haldar';

  const [redirectedUrl, setRedirectedUrl] = useState('');
  console.log(
    'props.route?.params---2>',
    `${imageUrl}/home/paynow?Id=${props.route?.params?.uri.encrypt}&ctid=${props.route?.params?.uri.ctid}&addressId=${props.route?.params?.details?.newValues?.addressID}`,
  );
  const handleNavigationStateChange = navState => {
    // Check if the URL has changed

    if (navState.url !== redirectedUrl) {
      // Set the redirected URL in the state variable
      setRedirectedUrl(navState.url);
      // You can perform any action here with the redirected URL

      if (navState.url == `${imageUrl}/Home/Thankyou`) {
        navigation.navigate('paymentSuccess', {
          details: props.route?.params?.details?.newValues,
        });
      } else if (navState.url == `${imageUrl}/Home/PaymentCancel`) {
        navigation.navigate('paymentFailed');
      } else if (
        navState.url == `https://secure.ccavenue.com/cancelTransaction`
      ) {
        setTimeout(() => {
          navigation.navigate('paymentFailed');
        }, 1000);
      } else {
      }
    }
  };

  useEffect(() => {
    if (Platform.OS == 'android') {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => navigation.navigate('paymentFailed')},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    } else {
      // const onBackSwipe = () => {
      //   // Your custom logic here
      //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      //     {
      //       text: 'Cancel',
      //       onPress: () => null,
      //       style: 'cancel',
      //     },
      //     {text: 'YES', onPress: () => navigation.navigate('paymentFailed')},
      //   ]);
      //   return true; // Prevent default behavior
      // };
      // // Add listener for back swipe gesture
      // const backSwipeHandler = navigation.addListener(
      //   'beforeRemove',
      //   onBackSwipe,
      // );
      // // Cleanup function
      // return () => backSwipeHandler.remove();
    }
  }, []);

  const [loading, setLoading] = useState(true);

  return (
    <Layout showBar comProps={props}>
      {/* <UI.Div
        width="90%"
        ml="auto"
        mr="auto"
        style={{
          flex: 1,
        }}> */}

      {loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            zIndex: 1,
          }}>
          <Image
            source={require('../../assets/Cart_Moving_dry_fruits.gif')}
            style={{width: 180, height: 180}}
          />
          {/* <LottieView
            style={{
              borderRadius: 17,
              height: Platform.isPad ? 350 : 300,
              width: '60%',
            }}
            autoPlay={true}
            loop
            resizeMode="cover"
            source={require('../../assets/json/cart_run.json')}
          /> */}
        </View>
      )}

      <WebView
        renderLoading={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width,  initial-scale=0.8, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
        scalesPageToFit={false}
        onMessage={e => onMessage(e)}
        // source={{ uri: 'https://www.example.com' }}
        source={{
          uri: `${imageUrl}/home/paynow?Id=${props.route?.params?.uri.encrypt}&ctid=${props.route?.params?.uri.ctid}&addressId=${props.route?.params?.details?.newValues?.addressID}`,
          // uri: `https://tms.goldenbuzz.in/home/paynow?&${props.route?.params?.uri.ctid} `,
          // https://www.themewashoppe.in
        }}
        style={{flex: 1}}
        onNavigationStateChange={handleNavigationStateChange}
      />

      {/* </UI.Div> */}
    </Layout>
  );
};

export default Payments;
