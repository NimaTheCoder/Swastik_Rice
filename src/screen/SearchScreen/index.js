import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  PixelRatio,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Layout from '../../Components/common/Layouts';
import {colors} from '../../Components/Design';
import * as UI from '../../Components/UI/UI';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchSearchProducts,
  resetSearchData,
} from '../../Redux/reducerSlice/SearchProductSlice';
import LottieView from 'lottie-react-native';
import {useFocusEffect} from '@react-navigation/native';
import {fonts} from '../../Components/common/CustomFonts';

const SearchScreen = props => {
  const {searchProducts, isLoading} = useSelector(
    state => state.searchProducts,
  );
  const {width, fontScale} = Dimensions.get('window');
  const searchInputRef = useRef(null);
  const [focus, setFocus] = useState(false);
  const [values, setValue] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRoute();
  const handelSearch = text => {
    setValue(text);
    if (text.length >= 2) {
      dispatch(fetchSearchProducts(text))
        .unwrap()
        .then(res => console.log(''))
        .catch(er => console.log('er', er));
    } else {
      dispatch(resetSearchData());
    }
  };

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      searchInputRef.current?.focus();
      setValue('');
      dispatch(resetSearchData());
    });
    return () => {
      focused();
    };
  }, []);

  return (
    <Layout showBar back Dra comProps={props}>
      <View style={{padding: 10, backgroundColor: colors.grayLight}}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            zIndex: 1,
            elevation: 2,
            borderRadius: 6,
            height: 50,
            paddingHorizontal: 10,
            backgroundColor: colors.white,
          }}>
          <FontAwesome name="search" size={25} color={colors.grayBold} />
          <TextInput
            ref={searchInputRef}
            value={values}
            onChangeText={text => handelSearch(text)}
            focusable={true}
            autoFocus={true}
            placeholder="Search"
            style={{
              fontFamily: fonts.rr,
              marginLeft: 3,
              fontSize: 16 / fontScale,
              height: '100%',
              width: '90%',
            }}
          />
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <UI.Div width="90%" mt={10} ml={'auto'} mr={'auto'}>
          {isLoading && (
            <ActivityIndicator size="large" color={colors.layoutTheme} />
          )}
          {searchProducts?.data?.length == 0 && (
            <UI.Div
              mt={'30%'}
              br={10}
              style={{
                width: '100%',
                position: 'relative',
                height: '100%',
                // justifyContent: 'center',
              }}>
              <LottieView
                style={{
                  borderRadius: 17,
                  height: 100,
                  width: 350,
                }}
                autoPlay={true}
                loop
                resizeMode="cover"
                source={require('../../assets/json/Data_not_found.json')}
              />
              <UI.Text
                center
                font={fonts.rm}
                size={30}
                mt={50}
                color={colors.layoutTheme}>
                No Data Found
              </UI.Text>
            </UI.Div>
          )}
          {searchProducts &&
            searchProducts?.data?.map((el, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (el.type == 'item') {
                    navigation.navigate('ProductsDetails', {
                      el,
                      productId: el.id,
                    });
                  } else if (el.type == 'category') {
                    navigation.navigate('CategoryByProduct', {
                      cateID: el.id,
                      categoryType: el.url,
                    });
                  } else if (el.type == 'Collection') {
                    navigation.navigate('ViewAllProducts', {
                      value: el.id,
                      title: el.name,
                    });
                  } else {
                  }
                }}
                key={index}
                style={{
                  borderBottomWidth: 1,
                  borderColor: colors.grayMidBold,
                  paddingHorizontal: 10,
                  paddingVertical: 14,
                }}>
                <UI.Text
                  font={fonts.rr}
                  size={14 / fontScale}
                  color={colors.grayBoldMax}>
                  {el.name}
                </UI.Text>
              </TouchableOpacity>
            ))}
        </UI.Div>
      </ScrollView>
    </Layout>
  );
};

export default SearchScreen;
