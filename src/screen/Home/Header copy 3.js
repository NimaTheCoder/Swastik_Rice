import {
  Dimensions,
  ScaledSize,
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Autocomplete from '../../Components/common/AutoComplete/AutoComplete';
import {SliderBox} from 'react-native-image-slider-box';
import * as UI from '../../Components/UI/UI';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBannerImages} from '../../Redux/reducerSlice/BannerSlice';
import {imageUrl} from '../../../config';
import FastImage from 'react-native-fast-image';

const Header = ({imagewww}) => {
  const dispatch = useDispatch();
  console.log('imagewww', imagewww);
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
  const {bannerImages} = useSelector(state => state.bannerImages);
  const [loading, setLoading] = useState(false);
  const fastImage = (x, i) => {
    return (
      <UI.Div>
        <FastImage
          style={{
            width: Platform.isPad ? '100%' : 350,
            height: '100%',
            resizeMode: 'stretch',
          }}
          // resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: x.source.uri,
          }}
        />
      </UI.Div>
    );
  };

  const LoaderCom = (x, i) => {
    return (
      <View style={{position: 'absolute', top: '50%'}}>
        {loading && <ActivityIndicator size={'large'} color={'red'} />}
      </View>
    );
  };
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
        autoplayInterval={3000}
        autoplay={false}
        sliderBoxHeight={150}
        parentWidth={Dimensions.get('window').width}
        circleLoop={true}
        resizeMethod="auto"
        ImageComponentStyle={{
          width: '100%',
          borderRadius: 10,
          marginRight: 22,
          height: '100%',
        }}
        imageLoadingColor="#fff"
        images={imagewww}
        LoaderComponent={LoaderCom}
        ImageComponent={fastImage}
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
