import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  BackHandler,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';

import * as UI from '../../Components/UI/UI';
import {LoginBg} from '../../Components/common/ALLImages';
import {colors} from '../../Components/Design';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Layout from '../../Components/common/Layouts';
import {
  useNavigation,
  Router,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchViewAllProducts,
  resetAllData,
} from '../../Redux/reducerSlice/ViewAllProductsSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {imageUrl} from '../../../config';
import LottieView from 'lottie-react-native';
import {
  fetchCategory,
  resetCategoryMain,
} from '../../Redux/reducerSlice/CategorySlice';
import ImageFallback from '../../Components/common/ImageFallback';
import {
  SkeletonLayOutProduct,
  SkeletonProducts,
} from '../../Components/common/laoding/Skeleton';
import {fonts} from '../../Components/common/CustomFonts';
import {ImageLoader} from 'react-native-image-fallback';

const ViewAllCategory = props => {
  const {width, fontScale} = Dimensions.get('window');
  const {category, isLoading} = useSelector(state => state.category);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fullLoading, setFullLoading] = useState(true);
  const [allStateProducts, setAllStateProducts] = useState([]);

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      setAllStateProducts([]);
      fetchViewAll(pageNumber);
    });

    return () => {
      focused();
    };
  }, []);

  useEffect(() => {
    console.log('category', category);
    if (category?.data?.length > 0) {
      setAllStateProducts(prev => [...prev, ...category?.data]);
    }
  }, [category]);

  useEffect(() => {
    if (pageNumber !== 1) fetchDataScrollEnd();
  }, [pageNumber]);

  const pullFetch = () => {
    setAllStateProducts([]);
    setPageNumber(1);
    fetchViewAll(1);
  };
  const fetchDataScrollEnd = () => {
    if (category?.data?.length !== 0) {
      fetchViewAll(pageNumber);
    }
  };

  const fetchViewAll = n => {
    setFullLoading(true);
    dispatch(fetchCategory(n));
    setFullLoading(false);
  };
  const handleEndReached = () => {
    if (!refreshing) {
      setPageNumber(pageNumber + 1);
    }
  };

  const fallbacks = [
    require('../../assets/img/placeholder_image.jpg'), // A locally require'd image
  ];
  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CategoryByProduct', {
            cateID: item.id,
            categoryType: item.categoryType,
          });
          // navigation.navigate('ProductsDetails', {
          //   el: item,
          //   productId: item.id,
          // });
        }}
        style={{width: '100%', height: '100%'}}>
        <UI.Div
          br={6}
          mr={'auto'}
          ml={'auto'}
          width={'90%'}
          height={Platform.isPad ? 300 : 120}
          style={{position: 'relative'}}>
          <ImageFallback
            url={{uri: `${imageUrl}${item?.smallThumbnail}`}}
            ImStyle={styles.tinyLogo}
          />
          {/* <ImageLoader
            style={styles.tinyLogo}
            source={`${imageUrl}${item?.smallThumbnail}`}
            fallback={fallbacks}
          /> */}
          {/* <Image
            style={styles.tinyLogo}
            source={{
              uri: `${imageUrl}${item.smallThumbnail}`,
              // uri: `https://www.fnp.com/images/pr/l/v20220706124810/love-for-pastel-carnations-bouquet_1.jpg`,
            }}
          /> */}
        </UI.Div>
        <UI.Div mt={10}>
          <UI.Text
            font={fonts.rr}
            cp
            center
            color={colors.layoutTheme}
            size={Platform.isPad ? 18 / fontScale : 15 / fontScale}>
            {item.categoryType}
          </UI.Text>
        </UI.Div>
      </TouchableOpacity>
    </View>
  );

  // Inside useEffect hook to fetch data initially
  console.log('allStateProducts--------->', allStateProducts);
  return (
    <Layout showBar Dra back comProps={props}>
      {(isLoading && pageNumber == 1) || fullLoading ? (
        <UI.Div style={{height: '100%'}}>
          <LottieView
            style={{
              borderRadius: 17,
              height: '30%',
              width: '100%',
            }}
            autoPlay={true}
            loop
            resizeMode="cover"
            source={require('../../assets/json/AllProducts.json')}
          />
          <LottieView
            style={{
              borderRadius: 17,
              height: '30%',
              width: '100%',
            }}
            autoPlay={true}
            loop
            resizeMode="cover"
            source={require('../../assets/json/AllProducts.json')}
          />
          <LottieView
            style={{
              borderRadius: 17,
              height: '30%',
              width: '100%',
            }}
            autoPlay={true}
            loop
            resizeMode="cover"
            source={require('../../assets/json/AllProducts.json')}
          />
        </UI.Div>
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <UI.Div p={12}>
              <UI.Text
                color={colors.layoutTheme}
                size={18 / fontScale}
                font={fonts.rm}>
                Categories :
              </UI.Text>
            </UI.Div>
          )}
          contentContainerStyle={styles.container}
          keyExtractor={(item, index) => index}
          data={allStateProducts}
          numColumns={2}
          scrollEnabled={true}
          renderItem={renderItem}
          onRefresh={() => pullFetch()}
          refreshing={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1} // Adjust this threshold as needed
          // ListFooterComponent={() =>
          //   isLoading && pageNumber > 1 ? (
          //     <ActivityIndicator size="large" color={colors.layoutTheme} />
          //   ) : null
          // }
        />
      )}
      {isLoading && pageNumber !== 1 && (
        <ActivityIndicator size="large" color={colors.layoutTheme} />
      )}
    </Layout>
  );
};

export default ViewAllCategory;
const styles = StyleSheet.create({
  container: {
    // height: Dimensions.get('window').height * 0.8,
    // backgroundColor: '#fff',
    // width: '100%',
    // marginLeft: 'auto',
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // marginRight: 'auto',
  },
  item: {
    width: '50%',
    height: Platform.isPad ? 400 : 210,
    borderWidth: 1,
    padding: 12,
    borderColor: '#e2e8f0',
    // marginBottom: 16,
  },
  tinyLogo: {
    borderRadius: 12,
    resizeMode: Platform.isPad ? 'contain' : 'contain',
    width: '100%',
    height: '100%',
  },
});
