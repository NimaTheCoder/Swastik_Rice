import React from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import {Text} from '../../UI/UI';
import {LoadingScreen, LoginBg} from '../ALLImages';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import {colors} from '../../Design';
const Loading = () => {
  return (
    <View>
      <Image
        resizeMode="cover"
        source={LoadingScreen}
        style={styles.loginBG}></Image>
      <View
        style={{
          justifyContent: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          alignItems: 'center',
          height: '100%',
        }}>
        <BallIndicator
          size={100}
          color={colors.layoutTheme}
          animationDuration={800}
        />
      </View>
    </View>
  );
};

export default Loading;
const styles = StyleSheet.create({
  loginBG: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
