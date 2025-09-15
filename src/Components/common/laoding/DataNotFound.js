import React from 'react';
import {View, TouchableOpacity, Dimensions, Platform} from 'react-native';
import * as UI from '../../UI/UI';
import LottieView from 'lottie-react-native';
import {colors} from '../../Design';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../CustomFonts';

const DataNotFound = ({title, isCart}) => {
  const {width, fontScale} = Dimensions.get('window');
  const navigation = useNavigation();
  return (
    <UI.Div>
      <UI.Div
        br={10}
        style={{
          width: '80%',
          position: 'relative',
          height: 550,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        {/* <LottieView
          style={{
            height: 200,
            width: 200,
          }}
          autoPlay={true}
          loop
          resizeMode="cover"
          // source={require('../../assets/json/animation_empty.json')}
         /> */}

        {isCart ? (
          <View
            style={{
              width: '80%',
              position: 'relative',
              height: '1010%`',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <LottieView
              style={{
                borderRadius: 17,
                height: Platform.isPad ? 500 : 300,
                width: '100%',
              }}
              autoPlay={true}
              loop
              resizeMode="cover"
              source={require('../../../assets/json/animation_empty.json')}
            />
            <UI.Text
              font={fonts.rm}
              size={Platform.isPad ? 22 / fontScale : 14 / fontScale}
              center
              color={colors.garyMidMaxBold}>
              Your{' '}
              <UI.Text
                size={14 / fontScale}
                center
                font={fonts.rm}
                color={colors.layoutTheme}>
                The Mewa Shoppe
              </UI.Text>{' '}
              Cart is empty
            </UI.Text>
          </View>
        ) : (
          <View
            style={{
              width: '80%',
              position: 'relative',
              height: '100%`',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <LottieView
              style={{
                borderRadius: 17,
                height: Platform.isPad ? 500 : 200,
                width: '100%',
              }}
              autoPlay={true}
              loop
              resizeMode="cover"
              source={require('../../../assets/json/Data_not_found.json')}
            />
            <UI.Text
              center
              font={fonts.rm}
              size={Platform.isPad ? 22 / fontScale : 14 / fontScale}
              mt={50}
              color={colors.layoutTheme}>
              Your {title} is Empty
            </UI.Text>
          </View>
        )}
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => navigation.navigate('Home')}>
          <UI.Text
            style={{textDecorationLine: 'underline'}}
            center
            bold
            p={10}
            size={14 / fontScale}
            color={'gray'}>
            Start Shopping
          </UI.Text>
        </TouchableOpacity>
      </UI.Div>
    </UI.Div>
  );
};

export default DataNotFound;
