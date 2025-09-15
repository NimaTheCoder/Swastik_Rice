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
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {fetchOrders} from '../../Redux/reducerSlice/GetOrderAndReviewSlice';
import {imageUrl} from '../../../config';
import LottieView from 'lottie-react-native';
import {SkeletonLayOutProduct} from '../../Components/common/laoding/Skeleton';
import moment from 'moment';
import DataNotFound from '../../Components/common/laoding/DataNotFound';
import {fonts} from '../../Components/common/CustomFonts';

const data = [];

const YourOrders = props => {
  const {width, fontScale} = Dimensions.get('window');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);
  const {getAllOrders, allOrderLoading} = useSelector(state => state.order);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      dispatch(fetchOrders(userInfo?.data?.securityCode));
    });
    return () => {
      focused();
    };
  }, []);

  const pullFetch = () => {
    setRefreshing(true);
    dispatch(fetchOrders(userInfo?.data?.securityCode));
    setRefreshing(false);
  };

  const handleEndReached = () => {};

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.itemList}
        onPress={() => navigation.navigate('OrderSummary', item.id)}>
        <UI.Div p={12} height={110} width="30%">
          {/* <Image */}
          <ImageFallback
            // url={`${imageUrl}a/${el.largeThumbnail}`}
            url={{uri: `${imageUrl}${item.actualThumbnail}`}}
            ImStyle={styles.tinyLogo}
          />
        </UI.Div>
        <UI.Div height={140} width="50%">
          <UI.Text font={fonts.rm} size={14} color={colors.green}>
            {/* Arriving Friday between 7 AM - 9 PM */}
          </UI.Text>
          <UI.Text
            font={fonts.rr}
            size={14 / fontScale}
            color={colors.layoutTheme}
            mt={10}>
            {moment(item.orderDate).format('llll')}
          </UI.Text>

          <UI.Text
            mt={6}
            pl={4}
            pr={4}
            pt={2}
            pb={2}
            size={14 / fontScale}
            color={item.isPaid ? '#fff' : '#ef4444'}
            font={fonts.rm}
            style={{
              borderRadius: 6,

              textAlign: 'center',
              width: '50%',
              backgroundColor: item.isPaid ? '#22c55e' : '#fecaca',
            }}>
            {item.isPaid ? 'Success' : 'Failed'}
          </UI.Text>
          {item.isPaid && (
            <TouchableOpacity
              style={{padding: 6}}
              onPress={() => navigation.navigate('Reviews', {data: item})}>
              <UI.Text
                size={14 / fontScale}
                u
                color={colors.layoutThemeLight}
                font={fonts.rm}>
                Write Review
              </UI.Text>
            </TouchableOpacity>
          )}
        </UI.Div>
        <UI.Div
          p={12}
          height={120}
          width="20%"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name="right" size={25} color={colors.layoutTheme} />
        </UI.Div>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout showBar back comProps={props}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={pullFetch} />
        }>
        {allOrderLoading ? (
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').width,
            }}>
            <SkeletonLayOutProduct />
          </View>
        ) : (
          <UI.Div>
            {getAllOrders?.length == 0 || getAllOrders == null ? (
              <DataNotFound title="Orders" />
            ) : (
              <FlatList
                ListHeaderComponent={() => (
                  <UI.Div p={12}>
                    <UI.Text
                      font={fonts.rm}
                      color={colors.layoutTheme}
                      size={20 / fontScale}>
                      Your Orders
                    </UI.Text>
                  </UI.Div>
                )}
                contentContainerStyle={styles.container}
                keyExtractor={(item, index) => index}
                data={getAllOrders}
                // numColumns={1}
                scrollEnabled={true}
                renderItem={renderItem}
                onRefresh={() => pullFetch()}
                refreshing={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1} // Adjust this threshold as needed
              />
            )}
          </UI.Div>
        )}
      </ScrollView>
    </Layout>
  );
};

export default YourOrders;
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 6,
    // borderRadius: 6,
    elevation: 2,
    backgroundColor: '#fff',
  },
  itemList: {
    flexDirection: 'row',
    padding: 6,
    marginVertical: 10,
  },
  tinyLogo: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});
