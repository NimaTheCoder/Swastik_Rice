import React, {useEffect, useState} from 'react';
import {Image, ActivityIndicator, View} from 'react-native';
import {imageUrl} from '../../../config';
import placeholderImage from '../../assets/img/placeholder_image.jpg';
import {colors} from '../Design';
import {ImageLoader} from 'react-native-image-fallback';
const ImageFallback = ({ImStyle, url}) => {
  const [ImageUrl, setImageUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0); // Added key state

  const fallbacks = [
    require('../../assets/img/placeholder_image.jpg'), // A locally require'd image
  ];

  const onLoadStart = () => {};

  const onLoadEnd = () => {};
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ImageLoader
        onLoadStart={onLoadStart}
        style={ImStyle}
        source={url?.uri}
        onLoadEnd={onLoadEnd}
        fallback={fallbacks}
      />
    </View>
  );
};

export default ImageFallback;
