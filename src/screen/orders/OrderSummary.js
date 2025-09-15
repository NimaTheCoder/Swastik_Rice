import React, {useEffect} from 'react';
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
import {fetchOrdersDetails} from '../../Redux/reducerSlice/GetOrderAndReviewSlice';
import {useDispatch, useSelector} from 'react-redux';
import {imageUrl} from '../../../config';
import {
  SkeletonLayOutProduct,
  SkeletonLayOutProductById,
  SkeletonProducts,
  SkeletonThreeCards,
} from '../../Components/common/laoding/Skeleton';
import {fonts} from '../../Components/common/CustomFonts';

const OrderSummary = props => {
  const {width, fontScale} = Dimensions.get('window');
  const dispatch = useDispatch();
  const {orderDetails, orderDetailsLoading} = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrdersDetails(props.route.params))
      .unwrap()
      .then(res => console.log('res', res));
  }, [props.route.params]);
  return (
    <Layout showBar back comProps={props}>
      <ScrollView style={{flex: 1}}>
        {orderDetailsLoading ? (
          <View style={{height: Dimensions.get('window').height}}>
            <SkeletonLayOutProductById />
          </View>
        ) : (
          <View>
            {orderDetails !== null ? (
              <UI.Div p={10} width={'95%'} mr={'auto'} ml={'auto'}>
                <UI.Div>
                  <UI.Text font={fonts.rm} size={20 / fontScale} color={'#000'}>
                    Order Summary
                  </UI.Text>
                  {/* <UI.Text size={14 / fontScale}  color={'#000'}>Arrived at 7:57 pm</UI.Text> */}
                  {/* <TouchableOpacity
              style={{
                padding: 10,
                marginTop: 4,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <UI.Text size={14 / fontScale} color={colors.green} mr={6} bold>
                Download Invoice
              </UI.Text>
              <AntDesign name={'download'} size={18} color={colors.green} />
            </TouchableOpacity> */}
                </UI.Div>

                {/* order items *********** */}
                <UI.Div mt={10} bg={'#fff'} p={10} br={6}>
                  <UI.Text bold size={16 / fontScale} color={'#000'}>
                    {orderDetails?.data?.orderDetails?.length} Items in this
                    order
                  </UI.Text>
                  {/* map order ******** */}
                  {orderDetails?.data?.orderDetails?.map((el, index) => (
                    <UI.Flex key={index} mt={10} middle width={'100%'}>
                      <UI.Div width={'30%'} p={6} height={100}>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: colors.grayMidBold,
                            borderRadius: 6,
                            width: '100%',
                            height: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            justifyContent: 'center',
                            // alignItems: 'center',
                          }}>
                          <ImageFallback
                            // url={`${imageUrl}a/${el.largeThumbnail}`}
                            url={{
                              uri: `${imageUrl}${el.mediumThumbnail}`,
                            }}
                            ImStyle={style.tinyLogo}
                          />
                        </View>
                      </UI.Div>
                      <UI.Div width={'70%'} p={6} height={100}>
                        <UI.Text bold size={14 / fontScale} width={'90%'}>
                          {el.productName}
                        </UI.Text>
                        <UI.Flex p={0} mt={10} middle spaceb>
                          <UI.Text size={14 / fontScale}>Qty:{el.qty}</UI.Text>
                          <UI.Flex middle>
                            {/* <UI.Text
                        mr={6}
                        size={14}
                        color={colors.lightPrice}
                        style={{
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                        }}>
                        ₹{el.totalPrice}
                      </UI.Text> */}
                            <UI.Text
                              style={{}}
                              bold
                              color={colors.darkPrice}
                              size={14 / fontScale}>
                              ₹{el?.totalPrice}
                            </UI.Text>
                            {/* <UI.Text
                              style={{
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                              }}
                              bold
                              color={colors.darkPrice}
                              size={14 / fontScale}>
                              ₹{el.mrp}
                            </UI.Text> */}
                          </UI.Flex>
                        </UI.Flex>
                      </UI.Div>
                    </UI.Flex>
                  ))}
                </UI.Div>
                {/* bill Details */}
                <UI.Div mt={10} br={6} bg={'#fff'}>
                  <UI.Text
                    bold
                    size={16 / fontScale}
                    color={'#000'}
                    style={{padding: 20}}>
                    Bill details
                  </UI.Text>
                  <UI.Div
                    p={10}
                    style={{borderTopWidth: 1, borderColor: colors.grayMid}}>
                    <UI.Flex p={10} middle spaceb>
                      <UI.Text color="#000" size={16 / fontScale} bold>
                        Bill total
                      </UI.Text>
                      <UI.Text
                        color={colors.layoutTheme}
                        bold
                        size={14 / fontScale}>
                        ₹{orderDetails?.data?.subTotal}
                      </UI.Text>
                    </UI.Flex>
                  </UI.Div>
                </UI.Div>
              </UI.Div>
            ) : (
              <UI.Div p={10} width={'95%'} mr={'auto'} ml={'auto'}></UI.Div>
            )}
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

export default OrderSummary;
const style = StyleSheet.create({
  orderContainer: {
    borderWidth: 1,
  },
  tinyLogo: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});
