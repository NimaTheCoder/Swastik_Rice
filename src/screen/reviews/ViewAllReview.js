import React, {useState, useEffect} from 'react';
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
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import ImageFallback from '../../Components/common/ImageFallback';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating-widget';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  getReviews,
  submitReview,
} from '../../Redux/reducerSlice/GetOrderAndReviewSlice';
import {useToast} from 'react-native-toast-notifications';
import {imageUrl} from '../../../config';
import LottieView from 'lottie-react-native';
import {SkeletonLayOutProduct} from '../../Components/common/laoding/Skeleton';
const ViewAllReview = props => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [allStateReviews, setAllStateReviews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isViewLoading, setIsLoading] = useState(false);
  const {getProductBR, getReviewLoading} = useSelector(state => state.order);
  const {isLogin, userInfo} = useSelector(state => state.login);

  useEffect(() => {
    if (getProductBR?.data?.reviews?.length > 0) {
      setAllStateReviews(prev => [...prev, ...getProductBR?.data?.reviews]);
      // setPrePage(getProductBR?.data?.pageNumber);
      // dispatch(resetAllData());
    }
  }, [getProductBR]);

  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      getAllReview(pageNumber);
    });

    return () => {
      focused();
    };
  }, []);

  const pullFetch = () => {
    setRefreshing(true);
    setPageNumber(1);
    getAllReview(1);
    setAllStateReviews([]);
  };

  useEffect(() => {
    if (pageNumber !== 1) fetchDataScrollEnd();
  }, [pageNumber]);

  const fetchDataScrollEnd = () => {
    getAllReview(pageNumber);
  };

  const handleEndReached = () => {
    if (!refreshing) {
      setPageNumber(pageNumber + 1);
    }
  };
  const getAllReview = pageN => {
    const data = {
      id: props?.route?.params?.id,
      pageSize: 10,
      pageNumber: pageN,
    };
    dispatch(getReviews(data))
      .unwrap()
      .then(res => {
        setRefreshing(false);
      })
      .catch(err => setRefreshing(false));
  };

  // const data = {
  //   id: props?.route?.params?.id,
  //   pageSize: 6,
  //   pageNumber: 1,
  // };
  // dispatch(getReviews(data))
  //   .unwrap()
  //   .then(res => console.log('res -----x--------------->', res))
  //   .catch(err => console.log('err -----', err));

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <UI.Text
        mt={10}
        width={'90%'}
        color={colors.grayBoldMax}
        center
        size={14}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        {item?.review}
      </UI.Text>
      <UI.Flex spaceb middle>
        <UI.Div>
          <UI.Text size={20} bold color={colors.layoutTheme}>
            {item?.name}
          </UI.Text>
          <UI.Text size={14} color={colors.grayBoldMax}>
            {new Date(item.reviewDate).toLocaleDateString()}
          </UI.Text>
        </UI.Div>
        <UI.Div>
          <StarRating
            maxStars={5}
            disabled={false}
            rating={item?.rating}
            starSize={20}
            // selectedStar={rating => setStar(rating)}
            fullStarColor={colors.layoutTheme}
            starStyle={{padding: 6}}
          />
        </UI.Div>
      </UI.Flex>
    </View>
  );

  return (
    <Layout showBar back comProps={props}>
      {getReviewLoading && pageNumber == 1 ? (
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').width,
          }}>
          <SkeletonLayOutProduct />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <UI.Div p={12}>
              <UI.Text bold color={colors.layoutTheme} size={18}>
                View all Reviews :
              </UI.Text>
            </UI.Div>
          )}
          contentContainerStyle={styles.container}
          keyExtractor={(item, index) => index}
          data={allStateReviews}
          scrollEnabled={true}
          renderItem={renderItem}
          onRefresh={() => pullFetch()}
          refreshing={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1} // Adjust this threshold as needed
        />
      )}

      {getReviewLoading && pageNumber !== 1 && (
        <ActivityIndicator size="small" color={colors.layoutTheme} />
      )}
    </Layout>
  );
};

export default ViewAllReview;
const styles = StyleSheet.create({
  container: {},
  nFlex: {
    position: 'absolute',
    bottom: 0,
    right: -0,
  },
  item: {
    marginVertical: 20,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
  },
});
