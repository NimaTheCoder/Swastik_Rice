import React, {useEffect, useState} from 'react';
import {Image, ActivityIndicator, View} from 'react-native';
import {imageUrl} from '../../../config';
import placeholderImage from '../../assets/img/placeholder_image.jpg';
import {colors} from '../Design';

const ImageFallback = ({ImStyle, url}) => {
  const [ImageUrl, setImageUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0); // Added key state

  const handleLoad = () => {
    setIsLoading(false);
  };
  useEffect(() => {
    setImageUrl(url);
    setIsLoading(true); // Reset isLoading state when url changes
    setKey(prevKey => prevKey + 1);
  }, [url]);

  const fallBack = () => {
    setIsLoading(false);
    setImageUrl(require('../../assets/img/placeholder_image.jpg'));
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      {isLoading && (
        <ActivityIndicator
          color={colors.layoutShadow}
          size={'small'}
          style={{position: 'absolute'}}
        />
      )}
      <Image
        key={key}
        style={[ImStyle, {opacity: isLoading ? 0 : 1}]}
        source={ImageUrl}
        onError={e => fallBack(e)}
        onLoad={handleLoad}
      />
    </View>
  );
};

export default ImageFallback;
