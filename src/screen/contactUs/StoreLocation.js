import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio,
  TextInput,
  Linking,
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {imageUrl} from '../../../config';
import {
  Kabi_Bharati,
  P34A_Scheme,
  sarat_bose,
} from '../../Components/common/ALLImages';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fonts} from '../../Components/common/CustomFonts';
const StoreLocation = props => {
  const {width, fontScale} = Dimensions.get('window');
  return (
    <Layout showBar back Dra comProps={props}>
      <ScrollView style={{flex: 1, width: '100%'}}>
        <UI.Div
          mt={'15%'}
          width={'95%'}
          height={Platform.isPad ? 250 : 160}
          mr={'auto'}
          ml={'auto'}>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: colors.grayLight,
              elevation: 4,
              margin: 6,
              backgroundColor: '#ffff',
              padding: 10,
              borderRadius: 6,
              justifyContent: 'space-between',
            }}>
            <UI.Div width={Platform.isPad ? '30%' : '40%'} height={'100%'}>
              <Image source={sarat_bose} style={style.loginBG} />
            </UI.Div>
            <UI.Div width={Platform.isPad ? '60%' : '56%'}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                }}
                onPress={() => {
                  // Create a URL for Google Maps with the latitude and longitude
                  const mapsUrl = `https://maps.app.goo.gl/v32sfna2VP4TJ6GV8`;
                  // Open the Google Maps URL using the Linking module
                  Linking.openURL(mapsUrl).catch(err =>
                    console.error('Error opening Google Maps:', err),
                  );
                }}>
                <Ionicons
                  name="location"
                  size={16}
                  style={{marginTop: 4}}
                  color={colors.layoutTheme}
                />
                <UI.Text
                  ml={6}
                  style={{textTransform: 'uppercase'}}
                  size={Platform.isPad ? 16 : 14 / fontScale}
                  color={colors.layoutTheme}
                  font={fonts.rm}>
                  31 sarat bose road, kolkata 700 020
                </UI.Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                }}
                onPress={() => Linking.openURL(`tel:74394 77598`)}>
                <Ionicons name="call" size={16} color={colors.layoutTheme} />
                <UI.Text
                  ml={6}
                  size={Platform.isPad ? 16 : 14 / fontScale}
                  font={fonts.rm}
                  color={colors.grayBoldMax}>
                  74394 77598
                </UI.Text>
              </TouchableOpacity>
              <UI.Flex spaceb mt={Platform.isPad ? 10 : 0}>
                <UI.Button
                  onPress={() => Linking.openURL(`tel:74394 77598`)}
                  width="30%"
                  gpt={5}
                  size={Platform.isPad ? 18 : 14 / fontScale}
                  gpb={5}
                  text="Call"
                />
                <UI.Button
                  onPress={() => {
                    // Create a URL for Google Maps with the latitude and longitude
                    const mapsUrl = `https://maps.app.goo.gl/v32sfna2VP4TJ6GV8`;
                    // Open the Google Maps URL using the Linking module
                    Linking.openURL(mapsUrl).catch(err =>
                      console.error('Error opening Google Maps:', err),
                    );
                  }}
                  width="65%"
                  gpt={5}
                  size={Platform.isPad ? 18 : 14 / fontScale}
                  gpb={5}
                  text="Directions"
                />
              </UI.Flex>
            </UI.Div>
          </View>
        </UI.Div>
        <UI.Div
          mt={'5%'}
          width={'95%'}
          mb={'5%'}
          height={Platform.isPad ? 250 : 160}
          mr={'auto'}
          ml={'auto'}>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: colors.grayLight,
              elevation: 4,
              margin: 6,
              backgroundColor: '#ffff',
              padding: 10,
              borderRadius: 6,
              justifyContent: 'space-between',
            }}>
            <UI.Div width={Platform.isPad ? '30%' : '40%'} height={'100%'}>
              <Image source={P34A_Scheme} style={style.loginBG} />
            </UI.Div>
            <UI.Div width={Platform.isPad ? '60%' : '56%'}>
              <TouchableOpacity
                onPress={() => {
                  // Create a URL for Google Maps with the latitude and longitude
                  const mapsUrl = `https://maps.app.goo.gl/M29G57tUJ2rSQVaQ6`;
                  // Open the Google Maps URL using the Linking module
                  Linking.openURL(mapsUrl).catch(err =>
                    console.error('Error opening Google Maps:', err),
                  );
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <Ionicons
                  name="location"
                  size={16}
                  style={{marginTop: 4}}
                  color={colors.layoutTheme}
                />
                <UI.Text
                  ml={6}
                  style={{textTransform: 'uppercase'}}
                  size={Platform.isPad ? 16 : 14 / fontScale}
                  color={colors.layoutTheme}
                  font={fonts.rm}>
                  p34a, C.I.T road scheme no. VII(M), KOL-54
                </UI.Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:93303 11946`)}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <Ionicons name="call" size={16} color={colors.layoutTheme} />
                <UI.Text
                  ml={6}
                  size={Platform.isPad ? 16 : 14 / fontScale}
                  font={fonts.rm}
                  color={colors.grayBoldMax}>
                  93303 11946
                </UI.Text>
              </TouchableOpacity>
              <UI.Flex spaceb mt={Platform.isPad ? 10 : 0}>
                <UI.Button
                  onPress={() => Linking.openURL(`tel:93303 11946`)}
                  width="30%"
                  gpt={5}
                  size={Platform.isPad ? 18 : 14 / fontScale}
                  gpb={5}
                  text="Call"
                />
                <UI.Button
                  onPress={() => {
                    // Create a URL for Google Maps with the latitude and longitude
                    const mapsUrl = `https://maps.app.goo.gl/M29G57tUJ2rSQVaQ6`;
                    // Open the Google Maps URL using the Linking module
                    Linking.openURL(mapsUrl).catch(err =>
                      console.error('Error opening Google Maps:', err),
                    );
                  }}
                  width="65%"
                  gpt={5}
                  size={Platform.isPad ? 18 : 14 / fontScale}
                  gpb={5}
                  text="Directions"
                />
              </UI.Flex>
            </UI.Div>
          </View>
        </UI.Div>
        {/* <UI.Div mt={'10%'} width={'95%'} height={190} mr={'auto'} ml={'auto'}>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: colors.grayLight,
              elevation: 4,
              margin: 6,
              backgroundColor: '#ffff',
              padding: 10,
              borderRadius: 6,
              justifyContent: 'space-between',
            }}>
            <UI.Div width={'40%'} height={'100%'}>
              <Image source={Kabi_Bharati} style={style.loginBG} />
            </UI.Div>
            <UI.Div width={'56%'}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <Ionicons
                  name="location"
                  size={16}
                  style={{marginTop: 4}}
                  color={colors.layoutTheme}
                />
                <UI.Text
                  ml={6}
                  style={{textTransform: 'uppercase'}}
                  size={16}
                  color={colors.layoutTheme}
                  font={fonts.rm}>
                  3, kavi bharati {'  '}
                  <UI.Text
                    ml={6}
                    style={{textTransform: 'uppercase'}}
                    size={16}
                    color={colors.layoutTheme}
                    font={fonts.rm}>
                    {'  '}
                    sarani, lake road, kol-29
                  </UI.Text>
                </UI.Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <Ionicons name="call" size={16} color={colors.layoutTheme} />
                <UI.Text ml={6} size={15} font={fonts.rm} color={colors.grayBoldMax}>
                  99033 33520
                </UI.Text>
              </TouchableOpacity>
              <UI.Flex spaceb>
                <UI.Button
                  onPress={() => Linking.openURL(`tel:99033 33520`)}
                  width="30%"
                  gpt={5}
                  gpb={5}
                  text="Call"
                />
                <UI.Button
                  onPress={() => {
                    // Create a URL for Google Maps with the latitude and longitude
                    const mapsUrl = `https://maps.app.goo.gl/SmS686WV4qgL3Tw29`;
                    // Open the Google Maps URL using the Linking module
                    Linking.openURL(mapsUrl).catch(err =>
                      console.error('Error opening Google Maps:', err),
                    );
                  }}
                  width="65%"
                  gpt={5}
                  gpb={5}
                  text="Directions"
                />
              </UI.Flex>
            </UI.Div>
          </View>
        </UI.Div> */}
      </ScrollView>
    </Layout>
  );
};

export default StoreLocation;
const style = StyleSheet.create({
  loginBG: {
    resizeMode: 'strach',
    borderRadius: 6,
    width: '100%',
    height: '100%',
  },
});
