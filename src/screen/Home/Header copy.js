import {
  Dimensions,
  ScaledSize,
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Autocomplete from '../../Components/common/AutoComplete/AutoComplete';
import {SliderBox} from 'react-native-image-slider-box';
import * as UI from '../../Components/UI/UI';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBannerImages} from '../../Redux/reducerSlice/BannerSlice';
import {imageUrl} from '../../../config';

const Header = () => {
  const dispatch = useDispatch();

  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
  const {bannerImages} = useSelector(state => state.bannerImages);

  useEffect(() => {
    dispatch(fetchBannerImages());
  }, []);

  return (
    <UI.Div
      bg="#fff"
      mt={20}
      style={{
        width: SCREEN_WIDTH - 20,
        // width: '95%',
        borderRadius: 10,
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: Platform.isPad ? 280 : 150,

        // padding: 4,
      }}>
      <SliderBox
        onCurrentImagePressed={text => console.log('text', text)}
        autoplayInterval={2500}
        autoplay={true}
        sliderBoxHeight={150}
        parentWidth={Dimensions.get('window').width}
        resizeMode="stretch"
        circleLoop={true}
        resizeMethod="auto"
        ImageComponentStyle={{
          width: '100%',
          borderRadius: 10,
          marginRight: 22,
          height: '100%',
        }}
        images={bannerImages?.map(item => `${imageUrl}${item.imagePath}`)}
      />
    </UI.Div>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    height: 10,
  },
});
