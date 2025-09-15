import React from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import * as UI from '../UI/UI';
import {colors} from '../Design';
import {useDispatch, useSelector} from 'react-redux';
import {
  SkeletonLayOutProduct,
  SkeletonLayOutProductById,
  SkeletonProducts,
  SkeletonThreeCards,
} from '../common/laoding/Skeleton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {imageUrl} from '../../../config';
import {
  fetchCategory,
  resetCategoryMain,
} from '../../Redux/reducerSlice/CategorySlice';
import DataNotFound from '../common/laoding/DataNotFound';
import ImageFallback from '../common/ImageFallback';
import {fonts} from '../common/CustomFonts';
const CategoryProducts = props => {
  const {category, isLoading} = useSelector(state => state.category);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {width, fontScale} = Dimensions.get('window');
  return (
    <UI.Container>
      <UI.Div
        p={6}
        mt={10}
        height={Platform.isPad ? 280 : 220}
        bg={colors.lightWhite}
        style={{overflow: 'hidden'}}
        br={6}>
        {isLoading ? (
          <UI.Div
            style={{height: Platform.isPad ? 250 : 220, overflow: 'hidden'}}>
            <SkeletonThreeCards />
          </UI.Div>
        ) : (
          <UI.Div>
            {category == null || category?.data?.length == 0 ? (
              <UI.Text pl={10} pt={10}></UI.Text>
            ) : (
              <UI.Div>
                <UI.Flex spaceb middle>
                  <UI.Text
                    size={14 / fontScale}
                    color={colors.layoutTheme}
                    font={fonts.rm}>
                    Category
                  </UI.Text>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                      // dispatch(fetchCategory(1));
                      navigation.navigate('ViewAllCategory');
                    }}>
                    <UI.Text
                      mr={4}
                      font={fonts.rm}
                      color={colors.layoutTheme}
                      size={14 / fontScale}>
                      View all
                    </UI.Text>
                    <View>
                      <FontAwesome
                        name="angle-right"
                        size={20}
                        color={colors.layoutTheme}
                      />
                    </View>
                  </TouchableOpacity>
                </UI.Flex>

                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}>
                  {category?.data !== null && isLoading === false && (
                    <UI.Flex width={'100%'}>
                      {category?.data?.map((el, index) => (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('CategoryByProduct', {
                              cateID: el.id,
                              categoryType: el.categoryType,
                            })
                          }
                          key={index}
                          style={{
                            marginRight: 15,
                            width: Platform.isPad ? 140 : 110,
                          }}>
                          <ImageFallback
                            url={{uri: `${imageUrl}${el?.smallThumbnail}`}}
                            ImStyle={styles.tinyLogo}
                          />

                          <UI.Text
                            font={fonts.rm}
                            center
                            mt={12}
                            size={14 / fontScale}
                            color={colors.layoutThemeLight}
                            cp>
                            {el?.categoryType}
                          </UI.Text>
                        </TouchableOpacity>
                      ))}
                    </UI.Flex>
                  )}
                </ScrollView>
              </UI.Div>
            )}
          </UI.Div>
        )}
        {/* {category == null || category?.length == 0 ? null : (
         
        )} */}
      </UI.Div>
    </UI.Container>
  );
};

export default CategoryProducts;

const styles = StyleSheet.create({
  tinyLogo: {
    resizeMode: 'contain',
    borderRadius: 12,
    width: Platform.isPad ? 140 : 110,
    height: Platform.isPad ? 140 : 110,
  },
});
