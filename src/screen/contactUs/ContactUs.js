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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {sentContact} from '../../Redux/reducerSlice/ContactUsSlice';
import {useToast} from 'react-native-toast-notifications';
import {fonts} from '../../Components/common/CustomFonts';

const ContactUs = props => {
  const {width, fontScale} = Dimensions.get('window');
  const refInput = useRef(null); // Ref for text input
  const toast = useToast();
  const secondTextInput = useRef();
  const {contactLoading, contactLoadingStatus} = useSelector(
    state => state.contactUs,
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  sendWhatsApp = () => {
    let msg = 'Welcome to TMS';
    let phoneWithCountryCode = '8617239438';

    let mobile =
      Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
    if (mobile) {
      if (msg) {
        let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
        Linking.openURL(url)
          .then(data => {})
          .catch(() => {
            alert('Make sure WhatsApp installed on your device');
          });
      } else {
        alert('Please insert message to send');
      }
    } else {
      alert('Please insert mobile no');
    }
  };
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (formData.name === '') {
      errors.name = 'Please enter a valid name.';
    }
    if (formData.email == '' || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (formData.message === '' || phoneRegex.test(formData.phNumber)) {
      errors.message = 'Please enter message.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitToContactUs = () => {
    setLoading(true);
    if (validateForm()) {
      const data = {
        name: formData.name,
        email: formData.email,
        phone: '',
        message: formData.message,
      };
      dispatch(sentContact(data))
        .unwrap()
        .then(res => {
          setLoading(false);
          if (res.isSuccess) {
            setFormData({
              name: '',
              email: '',
              message: '',
            });
            toast.show('Your response has been sent successfully.', {
              type: 'black',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in | zoom-in',
            });
          } else {
          }
        })
        .catch(err => setLoading(false));
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    const focused = props.navigation.addListener('focus', async () => {
      setFormErrors({});
      refInput.current?.focus();
    });
    return () => {
      focused();
    };
  }, []);

  return (
    <Layout showBar back Dra comProps={props}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <UI.Div
          mt={'10%'}
          bg="#fff"
          width="90%"
          p={20}
          br={6}
          mr={'auto'}
          ml={'auto'}>
          <UI.Text
            mr={'auto'}
            ml={'auto'}
            center
            size={22 / fontScale}
            color={colors.layoutTheme}
            font={fonts.rm}>
            Got Questions?
          </UI.Text>
          <UI.Text
            center
            width="90%"
            ml={'auto'}
            mr={'auto'}
            size={14 / fontScale}
            mt={10}
            color={colors.grey}
            font={fonts.rr}>
            Get in Touch with Culinary Delights
          </UI.Text>
          <UI.Text
            center
            width="90%"
            ml={'auto'}
            mr={'auto'}
            size={14 / fontScale}
            mt={10}
            color={colors.grey}
            font={fonts.rr}>
            Contact Us for a Flavourful Experience!
          </UI.Text>

          <UI.Div mt={20}>
            <UI.Text font={fonts.rm} size={16 / fontScale} mb={4}>
              Name
            </UI.Text>
            <TextInput
              ref={refInput}
              value={formData.name}
              onChangeText={ex => setFormData({...formData, name: ex})}
              autoFocus={true}
              placeholder="Name"
              placeholderTextColor={colors.grayBold}
              style={{
                fontFamily: fonts.rr,
                backgroundColor: '#fff',
                borderColor: colors.grayMid,
                width: '100%',
                fontSize: 14 / fontScale,
                borderWidth: 1,
                borderRadius: 6,
                height: 50,
                padding: 10,
              }}
            />
            <UI.Text font={fonts.rr} color="#f87171" size={14 / fontScale}>
              {formErrors.name}
            </UI.Text>
          </UI.Div>
          <UI.Div mt={10}>
            <UI.Text size={16 / fontScale} font={fonts.rm} mb={4}>
              Email
            </UI.Text>
            <TextInput
              value={formData.email}
              onChangeText={ex => setFormData({...formData, email: ex})}
              placeholder="Email"
              placeholderTextColor={colors.grayBold}
              style={{
                fontFamily: fonts.rr,
                borderColor: colors.grayMid,
                width: '100%',
                borderWidth: 1,
                borderRadius: 6,
                height: 50,
                fontSize: 14 / fontScale,
                padding: 10,
              }}
            />
            <UI.Text font={fonts.rr} color="#f87171" size={14 / fontScale}>
              {formErrors.email}
            </UI.Text>
          </UI.Div>
          <UI.Div mt={20}>
            <UI.Text size={16 / fontScale} font={fonts.rm} mb={4}>
              Message
            </UI.Text>
            <TextInput
              value={formData.message}
              onChangeText={ex => setFormData({...formData, message: ex})}
              placeholder="Message"
              placeholderTextColor={colors.grayMid}
              multiline
              numberOfLines={8}
              // maxLength={40}

              style={{
                fontFamily: fonts.rr,
                color: '#000',
                padding: 6,
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: colors.grayMid,
                borderRadius: 6,
                // maxHeight: '100%',
                fontSize: 14 / fontScale,
              }}
            />
            {/* <UI.Div
              style={{
                borderWidth: 1,
                borderRadius: 6,
                borderColor: colors.grayMid,
              }}
              width="100%"
              // height={200}
              mr={'auto'}
              ml={'auto'}>
              <TextInput
                value={formData.message}
                onChangeText={ex => setFormData({...formData, message: ex})}
                placeholder="Message"
                placeholderTextColor={colors.grayMid}
                multiline
                numberOfLines={2}
                // maxLength={40}
                style={{
                  fontFamily: fonts.rr,
                  color: '#000',
                  padding: 6,
                  borderWidth: 1,

                  // maxHeight: '100%',
                  fontSize: 14 / fontScale,
                }}
              />
            </UI.Div> */}
            <UI.Text font={fonts.rr} color="#f87171" size={14}>
              {formErrors.message}
            </UI.Text>
          </UI.Div>
          {loading ? (
            <UI.Button
              border
              pt={16}
              mt={'10%'}
              size={16 / fontScale}
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
              onPress={() => submitToContactUs()}
              border
              pt={16}
              mt={'10%'}
              size={16 / fontScale}
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
        </UI.Div>
        <TouchableOpacity
          style={{paddingBottom: 50}}
          onPress={() => sendWhatsApp()}>
          <UI.Text
            size={14 / fontScale}
            center
            mr={'auto'}
            ml={'auto'}
            mt={20}
            font={fonts.rm}>
            Call us at{' '}
            <UI.Text
              font={fonts.rr}
              size={14 / fontScale}
              color={colors.layoutTheme}>
              {' '}
              +91 9330287636
            </UI.Text>
          </UI.Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

export default ContactUs;
