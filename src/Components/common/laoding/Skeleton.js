import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Text} from '../../UI/UI';
import {LoadingScreen, LoginBg} from '../ALLImages';
import * as UI from '../../UI/UI';
import LottieView from 'lottie-react-native';
import {colors} from '../../Design';

export const SkeletonProducts = () => {
  return (
    <UI.Flex>
      <UI.Div
        br={10}
        style={{
          width: '100%',
          position: 'relative',
          height: '100%',
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
          source={require('../../../assets/json/three_cards_skeleton.json')}
        />
      </UI.Div>
      {/* </ScrollView> */}
    </UI.Flex>
  );
};

export const SkeletonThreeCards = () => {
  return (
    <UI.Div
      br={10}
      style={{
        width: '100%',
        borderRadius: 6,
        position: 'relative',
        height: '100%',
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
        source={require('../../../assets/json/three_cards_skeleton.json')}
      />
    </UI.Div>
  );
};

export const SkeletonLayOutProduct = () => {
  return (
    <UI.Div
      mt={20}
      br={10}
      style={{
        width: '100%',
        position: 'relative',
        height: '100%',
      }}>
      {/* AllProducts */}
      <LottieView
        style={{
          borderRadius: 17,
          height: '30%',
          width: '100%',
        }}
        autoPlay={true}
        loop
        resizeMode="cover"
        source={require('../../../assets/json/loading_box_skeleton_all_products.json')}
      />
    </UI.Div>
  );
};
export const SkeletonLayOutProductById = () => {
  return (
    <UI.Div
      mt={10}
      br={10}
      style={{
        width: '100%',
        position: 'relative',
        height: '100%',
      }}>
      {/* AllProducts */}
      <LottieView
        style={{
          borderRadius: 17,
          height: '70%',
          width: '100%',
        }}
        autoPlay={true}
        loop
        resizeMode="cover"
        source={require('../../../assets/json/product_details.json')}
      />
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        {/* <ActivityIndicator size={'large'} color={colors.layoutTheme} /> */}
      </View>
    </UI.Div>
  );
};
