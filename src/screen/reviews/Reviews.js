import React, {useState} from 'react';
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
import {submitReview} from '../../Redux/reducerSlice/GetOrderAndReviewSlice';
import {useToast} from 'react-native-toast-notifications';
import {imageUrl} from '../../../config';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const Reviews = props => {
  const toast = useToast();

  const {isLogin, otpDetails, userInfo} = useSelector(state => state.login);

  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({message: ''});
  const {addReviewLoading} = useSelector(state => state.order);
  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (formData.message === '' || phoneRegex.test(formData.phNumber)) {
      errors.message = 'Please enter review.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const submitToReview = () => {
    setLoading(true);
    if (validateForm()) {
      const values = {
        newValues: {
          productID: props?.route?.params?.data?.id,
          reviewDate: new Date().toLocaleString(),
          review: formData.message,
          rating: rating,
          isApproved: true,
        },
        securityCode: userInfo?.data?.securityCode,
      };
      dispatch(submitReview(values))
        .unwrap()
        .then(res => {
          setLoading(false);
          if (res.isSuccess) {
            setFormData({message: ''});
            setRating(0);
            toast.show('Review Added Successfully.', {
              type: 'black',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          } else {
            toast.show('Something is wrong.', {
              type: 'black',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          }
        })
        .catch(err => {
          toast.show('Something is wrong.', {
            type: 'black',
            placement: 'bottom',
            duration: 2000,
            offset: 30,
            animationType: 'slide-in | zoom-in',
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  return (
    <Layout showBar back comProps={props}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{height: '110%', marginBottom: 30}}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.itemContainer}>
            <UI.Div width="50%" height={200} mr={'auto'} ml="auto">
              <ImageFallback
                // url={`${imageUrl}a/${el.largeThumbnail}`}
                url={{
                  uri: `${imageUrl}${props?.route?.params?.data?.mediumThumbnail}`,
                }}
                ImStyle={styles.tinyLogo}
              />
            </UI.Div>
            <UI.Text mt={20} center size={16}>
              {props?.route?.params.data.title}
            </UI.Text>
            <UI.Div mt={30} width="80%" mr={'auto'} ml="auto">
              <UI.Text bold size={20} center>
                Rate the Product
              </UI.Text>
              <UI.Text mt={10} center>
                How did you find this product based on Your Usage?
              </UI.Text>
            </UI.Div>

            <UI.Div width="60%" ml="auto" mr="auto" mt={20}>
              <StarRating
                maxStars={5}
                disabled={false}
                rating={rating}
                starSize={30}
                selectedStar={rating => setRating(rating)}
                fullStarColor={colors.layoutTheme}
              />
            </UI.Div>
            <UI.Div width="80%" ml="auto" mr="auto" mt={30}>
              <UI.Text size={16} bold mb={4}>
                Write a Review
              </UI.Text>
              <UI.Div
                style={{
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: colors.grayMid,
                }}
                bg="#fff"
                width="100%"
                height={100}
                mr={'auto'}
                ml={'auto'}>
                <TextInput
                  value={formData.message}
                  onChangeText={ex => setFormData({...formData, message: ex})}
                  placeholder="Message"
                  placeholderTextColor={colors.grayMid}
                  multiline
                  // maxLength={40}
                  style={{
                    color: '#000',
                    padding: 6,
                    maxHeight: '100%',
                    fontSize: 20,
                  }}
                />
              </UI.Div>
              <UI.Text color="red"> {formErrors.message}</UI.Text>
            </UI.Div>
            {loading ? (
              <UI.Button
                border
                pt={16}
                mt={'10%'}
                size={16}
                pb={16}
                bg={'#ffff'}
                width={'80%'}
                ml={'auto'}
                mr="auto"
                b={2}
                bR={6}
                text="Loading..."
                bColor={colors.layoutTheme}
              />
            ) : (
              <UI.Button
                onPress={() => submitToReview()}
                border
                pt={16}
                mt={'10%'}
                size={16}
                pb={16}
                bg={'#ffff'}
                width={'80%'}
                ml={'auto'}
                mr="auto"
                b={2}
                bR={6}
                text="SEND NOW"
                bColor={colors.layoutTheme}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </Layout>
  );
};

export default Reviews;
const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: '80%',
    marginTop: '10%',
    //  justifyContent: 'center',
    //  alignItems: 'center',
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});
