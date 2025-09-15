import React, {useState} from 'react';
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
  Linking,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {LoginBg, roundLogo, tmsLogo} from '../../Components/common/ALLImages';
import {WebView} from 'react-native-webview';
import {fonts} from '../../Components/common/CustomFonts';

const AboutUs = props => {
  const {width, fontScale} = Dimensions.get('window');
  const [show, setShow] = useState(false);
  return (
    <Layout showBar back Dra comProps={props}>
      <ScrollView>
        <UI.Div
          p={10}
          // width={Dimensions.get('window').width}
          ml="auto"
          mr="auto"
          mb={20}>
          <UI.Div mt={30}>
            <View
              style={{
                height: 150,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 150,
              }}>
              <Image source={roundLogo} style={styles.loginBG} />
            </View>
            <View
              style={{
                height: 80,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 300,
              }}>
              <Image source={tmsLogo} style={styles.loginBG} />
            </View>
          </UI.Div>

          <UI.Text center font={fonts.rm} size={20 / fontScale} mt={30}>
            About Us
          </UI.Text>

          <UI.Text
            pl={10}
            pr={10}
            mt={10}
            font={fonts.rr}
            style={{textAlign: 'justify'}}
            size={14 / fontScale}>
            Warm Welcome to Mewa Shoppe, where a legacy of over 20 years in the
            food industry meets dedicated passion for quality.
          </UI.Text>
          <UI.Text
            mt={10}
            pl={10}
            pr={10}
            font={fonts.rr}
            style={{textAlign: 'justify'}}
            size={14 / fontScale}>
            The foundation of Mewa Shoppe was laid with a vision to cater to the
            demand for premium dry fruits and hampers, as well as offering
            top-notch snacks, digestive and mouth fresheners. Our mission is
            simple: - to provide customers with quality products, excellent
            service with a hygienic shopping environment at reasonable prices.
          </UI.Text>
          {show && (
            <UI.Div>
              <UI.Text
                mt={10}
                pl={10}
                pr={10}
                font={fonts.rr}
                style={{textAlign: 'justify'}}
                size={14 / fontScale}>
                At Mewa Shoppe, we believe that our customers are our most
                valuable asset. We strive to create an experience that goes
                beyond just a transaction, making every visit memorable. Our
                commitment to quality extends to our curated selection of custom
                hampers, flavored dry fruits, healthy snacks, imported
                chocolates, and beverages. Discover a world of taste and
                sophistication at Mewa Shoppe – where every product tells a
                story of premium quality and dedication to customer
                satisfaction.
              </UI.Text>
              <UI.Text
                mt={10}
                pl={10}
                pr={10}
                font={fonts.rr}
                style={{textAlign: 'justify'}}
                size={14 / fontScale}>
                We look forward to serve you & your family through our App &
                Physical Stores with assured quality, guaranteed services 😋
              </UI.Text>
            </UI.Div>
          )}
          <TouchableOpacity onPress={() => setShow(!show)}>
            <UI.Text
              mt={20}
              size={14 / fontScale}
              color={colors.layoutTheme}
              font={fonts.rm}
              center>
              {!show ? `View More` : 'View Less'}
            </UI.Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'https://www.youtube.com/channel/' + 'UCGzyteYVkptzf-QmC6XCwYw',
              ).catch(err => console.log('err', err));
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <UI.Text
              font={fonts.rr}
              size={16 / fontScale}
              mr={8}
              color={colors.layoutTheme}>
              Watch us on Youtube
            </UI.Text>
            <AntDesign name="youtube" size={25} color={'#FF0000'} />
          </TouchableOpacity>
        </UI.Div>
      </ScrollView>
    </Layout>
  );
};

export default AboutUs;
var styles = StyleSheet.create({
  loginBG: {
    marginHorizontal: 'auto',
    width: '100%',
    height: '100%',
  },
  //   ssss: {
  //     width: 100,
  //     height: 200,
  //   },
});
