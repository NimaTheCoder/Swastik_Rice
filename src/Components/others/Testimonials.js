import React, {useState, useEffect} from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as UI from '../UI/UI';
import StarRating from 'react-native-star-rating-widget';

import {colors} from '../Design';
import {useNavigation} from '@react-navigation/native';
const Testimonials = () => {
  return (
    <UI.Div mt={16} width="100%" pb={30}>
      <UI.Container>
        <UI.Flex spaceb middle>
          <UI.Text size={18} bold color={colors.layoutTheme}>
            Latest Testimonials
          </UI.Text>
          <TouchableOpacity>
            <UI.Text size={18} bold color={colors.layoutTheme}>
              View all
            </UI.Text>
          </TouchableOpacity>
        </UI.Flex>
        <ScrollView horizontal={true} style={{width: '100%'}}>
          <View
            style={{
              backgroundColor: colors.grayLight,
              position: 'relative',
              borderRadius: 6,
              padding: 12,
              width: 300,
              marginRight: 10,
              zIndex: -2,
              height: 180,
            }}>
            <Text numberOfLines={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim.
            </Text>
            <UI.Flex spaceb mt={20}>
              <UI.Div>
                <UI.Text color={colors.layoutTheme} bold size={18}>
                  Mathew.D
                </UI.Text>
                <UI.Text color={colors.grayBoldMax} size={12}>
                  17/10/2023
                </UI.Text>
              </UI.Div>
              <View></View>
            </UI.Flex>
            <View
              style={{
                width: 100,
                padding: 10,
                height: 100,

                backgroundColor: '#fff',
                position: 'absolute',
                borderRadius: 100,
                right: 10,
                zIndex: 123123,
                bottom: 0,
              }}>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: 'https://images.unsplash.com/photo-1523278669709-c05da80b6a65?auto=format&fit=crop&q=80&w=1074&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }}
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.grayLight,
              position: 'relative',
              borderRadius: 6,
              padding: 12,
              width: 300,
              marginRight: 10,
              zIndex: -2,
              height: 180,
            }}>
            <Text numberOfLines={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim.
            </Text>
            <UI.Flex spaceb mt={20}>
              <UI.Div>
                <UI.Text color={colors.layoutTheme} bold size={18}>
                  Mathew.D
                </UI.Text>
                <UI.Text color={colors.grayBoldMax} size={12}>
                  17/10/2023
                </UI.Text>
              </UI.Div>
              <View></View>
            </UI.Flex>
            <View
              style={{
                width: 100,
                padding: 10,
                height: 100,

                backgroundColor: '#fff',
                position: 'absolute',
                borderRadius: 100,
                right: 10,
                zIndex: 123123,
                bottom: 0,
              }}>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: 'https://images.unsplash.com/photo-1523278669709-c05da80b6a65?auto=format&fit=crop&q=80&w=1074&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }}
              />
            </View>
          </View>
        </ScrollView>
      </UI.Container>
    </UI.Div>
  );
};

export default Testimonials;
const styles = StyleSheet.create({
  tinyLogo: {
    width: '100%',
    zIndex: 123123,
    borderRadius: 100,
    height: '100%',
  },
});
