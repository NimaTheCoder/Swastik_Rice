import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';

// import * as allimages from './Images';

export const colors = {
  layoutTheme: '#F48628',
  layoutThemeLight: '#f69e52',
  layoutShadow: '#FEE7D4',
  lightWhite: '#fff',
  fontThemeBold: '#f8b67e',
  fontThemeNormal: '#f9c293',
  white: '#ffffff',
  brownColor: '#A73304',
  grayLight: '#F5F5F5',
  grayMid: '#DCDCDC',
  grayBold: '#CCCCCC',
  grayBoldMax: '#7B7B7B',
  grayMidBold: '#00000029',
  garyMidMaxBold: '#9a9a9a',
  darkPrice: '#F48628',
  lightPrice: '#f69e52',
  lowLightColor: '#dfecdd',
  lightTheme: '#6eb36a',
  boldTheme: '#61b15b',
  lightred: '#fe1080',
  lightrred: '#e80b73',
  red: '#c20041',
  green: '#2c9717',
  grey: '#848484',
  darkgrey: '#505050',
};

// export const images = allimages;
export const screen = {
  h: h,
  w: w,
};
export const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    // maxWidth: 410,
  },
  maxWidth: {
    maxWidth: 410,
  },
  flex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    position: 'relative',
  },
  flexColumn: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    position: 'relative',
  },
});
