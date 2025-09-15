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
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
  fetchAddWishlist,
  fetchRemoveWishlist,
} from '../../Redux/reducerSlice/WishlistSlice';
import {useToast} from 'react-native-toast-notifications';
import {fetchOtherProducts} from '../../Redux/reducerSlice/OtherProductsSlice';

const ViewAllOtherProducts = props => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {isLogin, userInfo} = useSelector(state => state.login);
  const {otherProducts, otherProductsIsLoading} = useSelector(
    state => state.otherProduct,
  );

  const [allStateProducts, setAllStateProducts] = useState([]);
  const [pageNumber, setPageNumber] = useEffect(1);

  // const handleEndReached = () => {
  //   if (!refreshing) {
  //     setPageNumber(pageNumber + 1);
  //   }
  // };

  // useEffect(() => {
  //   if (otherProducts?.data?.length > 0) {
  //     setAllStateProducts(prev => [...prev, ...otherProducts?.data]);
  //     //   setPrePage(otherProducts.pageNumber);
  //     //   dispatch(resetAllData());
  //   }
  // }, [otherProducts]);

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      fetchViewAllOtherProducts(1);
    });
    return () => {
      focused();
    };
  }, []);

  // const pullFetch = () => {};
  const fetchViewAllOtherProducts = n => {
    const values = {
      pid: props.route.params?.productsDetails?.id,
      CatID: props.route.params?.productsDetails?.parentCatID,
      pageNumber: n,
      securityCode: userInfo?.data?.securityCode,
    };

    dispatch(fetchOtherProducts(values));
  };

  return (
    <UI.Div>
      {/* {otherProductsIsLoading ? (
        <Text>Loading ....</Text>
      ) : (
        <UI.Div>
          {otherProducts?.data?.length === 0 || otherProducts == null ? (
            <UI.Div>
              <Text>No Data Found</Text>
            </UI.Div>
          ) : (
            <UI.Div>
              <FlatList
                ListHeaderComponent={() => (
                  <UI.Div p={12}>
                    <UI.Text
                      bold
                      color={colors.layoutTheme}
                      size={18}></UI.Text>
                  </UI.Div>
                )}
                contentContainerStyle={styles.container}
                keyExtractor={(item, index) => index}
                data={allStateProducts}
                numColumns={2}
                scrollEnabled={true}
                // renderItem={renderItem}
                onRefresh={() => pullFetch()}
                refreshing={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1} // Adjust this threshold as needed
              />
            </UI.Div>
          )}
        </UI.Div>
      )} */}
    </UI.Div>
  );
};

export default ViewAllOtherProducts;
const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // marginLeft: 'auto',
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // marginRight: 'auto',
  },
  nFlex: {
    position: 'absolute',
    bottom: 0,
    right: -0,
  },
  item: {
    width: '50%',
    height: 300,
    borderWidth: 1,
    padding: 10,
    borderColor: '#e2e8f0',
    // marginBottom: 16,
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
  },
});
