import React from 'react';
import Swiper from 'react-native-swiper';
import {
  Dimensions,
  ScaledSize,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  useWindowDimensions,
} from 'react-native';
import Autocomplete from '../../Components/common/AutoComplete/AutoComplete';
import {SliderBox} from 'react-native-image-slider-box';
import * as UI from '../../Components/UI/UI';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBannerImages} from '../../Redux/reducerSlice/BannerSlice';
import {imageUrl} from '../../../config';
import ImageFallback from '../../Components/common/ImageFallback';

const ImageSlider = () => {
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
  const {bannerImages} = useSelector(state => state.bannerImages);

  return (
    <View
      style={{
        width: '95%',
        // width: '95%',
        borderRadius: 10,
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: Platform.isPad ? 280 : 150,
      }}>
      <Swiper
        dot={
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,.2)',
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 10,
              marginBottom: -10,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: '#fff',
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 10,
              marginBottom: -10,
            }}
          />
        }
        style={{
          // width: SCREEN_WIDTH - 20,
          // // width: '95%',
          // borderRadius: 10,
          // overflow: 'hidden',
          // marginLeft: 'auto',
          // marginRight: 'auto',
          // height: Platform.isPad ? 280 : 150,
          height: Platform.isPad ? 280 : 150,
        }}
        // showsButtons={true}
        // autoplayTimeout={2.5}
        // bounces={true}
        // autoplay={true}
        // autoplayDirection={true}
        dotColor={'#fff'}>
        {bannerImages?.map((el, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{
                uri: `${imageUrl}${el.imagePath}`,
              }}
              style={styles.image}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
  },
});

export default ImageSlider;
