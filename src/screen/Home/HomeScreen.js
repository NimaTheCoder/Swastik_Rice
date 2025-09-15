import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  View,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from './Header';
import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import ALlPRoducts from '../../Components/AllProducts';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts} from '../../Redux/reducerSlice/ProductSlice';
import Testimonials from '../../Components/others/Testimonials';
import {fetchCategory} from '../../Redux/reducerSlice/CategorySlice';
import {useScrollToTop} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../../Components/Design';
import {fetchProductsOne} from '../../Redux/reducerSlice/getProductsOne';
import {fetchProductsTwo} from '../../Redux/reducerSlice/getProductsTwo';
import {fetchBannerImages} from '../../Redux/reducerSlice/BannerSlice';
import {fetchAddress} from '../../Redux/reducerSlice/AddressSlice';
import {addDefaultAddress} from '../../Redux/reducerSlice/AllactionSlice';
import {imageUrl} from '../../../config';
import {fonts} from '../../Components/common/CustomFonts';
import ImageFallback from '../../Components/common/ImageFallback';
import {backgroundError} from '../../Components/common/ALLImages';
import {ImageLoader} from 'react-native-image-fallback';
const {width, fontScale} = Dimensions.get('window');
const HomeScreen = props => {
  const ref = React.useRef(null);
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const {address, getAddressLoading} = useSelector(state => state.address);
  const {defaultAddress} = useSelector(state => state.allActionSLice);
  const {bannerImages} = useSelector(state => state.bannerImages);
  const [imagewww, setImages] = useState([]);

  const {getProductsOne, isLoading} = useSelector(
    state => state.productsOneSlice,
  );

  const {getProductsTwo, isLoadingTwo} = useSelector(
    state => state.productsTowSlice,
  );
  const {category} = useSelector(state => state.category);
  console.log('category', category);
  console.log('getProductsOne', getProductsOne);
  console.log('getProductsTwo', getProductsTwo);

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      const securityCode = userInfo?.data?.securityCode;
      dispatch(fetchBannerImages());
      // dispatch(fetchProducts());
      dispatch(fetchCategory(1));
      dispatch(fetchProductsOne(securityCode));
      dispatch(fetchProductsTwo(securityCode));
      dispatch(fetchAddress(securityCode));
    });
    return () => {
      focused();
    };
  }, []);

  const onRefresh = async () => {
    const securityCode = userInfo?.data?.securityCode;
    setRefreshing(true);
    dispatch(fetchBannerImages());
    dispatch(fetchCategory(1));
    // dispatch(fetchProducts());
    dispatch(fetchProductsOne(securityCode));
    dispatch(fetchProductsTwo(securityCode));
    dispatch(fetchAddress(securityCode));
    setRefreshing(false);
  };
  const goToTop = () => {
    ref.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  useEffect(() => {
    setImages(bannerImages?.map(item => `${imageUrl}${item.imagePath}`));
  }, [bannerImages]);

  return (
    <Layout showBar sBar Dra comProps={props}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          position: 'relative',
          marginBottom: Platform.OS == 'ios' ? '10%' : '20%',
        }}>
        {category === null &&
        getProductsOne === null &&
        getProductsTwo === null ? (
          <UI.Flex height={500} column bw={1} center>
            <Image style={styles.tinyLogo} source={backgroundError} />
            <UI.Text
              mt={20}
              ml={'auto'}
              mr={'auto'}
              size={28 / fontScale}
              center
              color={colors.layoutTheme}
              font={fonts.rb}>
              Oops!
            </UI.Text>
            <UI.Text
              mt={8}
              ml={'auto'}
              mr={'auto'}
              size={16 / fontScale}
              center
              color={colors.layoutTheme}
              font={fonts.rm}>
              Something went wrong!
            </UI.Text>
          </UI.Flex>
        ) : (
          <View style={{position: 'relative'}}>
            <Header imagewww={imagewww} />
            <UI.Div mb={20} width="100%">
              <ALlPRoducts props={props} />
            </UI.Div>
            <View
              style={{
                bottom: 6,
                position: 'absolute',
                justifyContent: 'center',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.layoutShadow,
                  // width: Platform.isPad ? '15%' : '30%',

                  paddingVertical: 6,
                  paddingHorizontal: 16,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderRadius: 6,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => goToTop()}>
                <Feather name="arrow-up" size={14} color={colors.layoutTheme} />
                <UI.Text
                  color={colors.layoutTheme}
                  center
                  size={14 / fontScale}
                  font={fonts.rm}>
                  Back to Top
                </UI.Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* <Testimonials /> */}
      </ScrollView>
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  tinyLogo: {
    resizeMode: 'contain',
    borderRadius: 12,
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 150,
  },
});
