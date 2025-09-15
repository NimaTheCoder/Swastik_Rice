import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import * as UI from '../../Components/UI/UI';
import Layout from '../../Components/common/Layouts';
import {LoginBg} from '../../Components/common/ALLImages';

const Registration = props => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gmail: '',
    password: '',
    conPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    if (formData.name.trim() === '') {
      errors.name = 'Name is required.';
    }
    if (formData.phone.trim() === '') {
      errors.phone = 'Phone number is required.';
    }
    if (formData.gmail.trim() === '') {
      errors.gmail = 'Gmail is required.';
    }
    if (formData.password.trim() === '') {
      errors.password = 'Password is required.';
    }
    if (formData.conPassword.trim() === '') {
      errors.conPassword = 'Please enter confirm password';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const submitForm = () => {
    if (validateForm()) {
      props.navigation.navigate('Bottom');
    }
  };
  return (
    <UI.Div>
      <Image resizeMode="cover" source={LoginBg} style={styles.loginBG}></Image>
      <ScrollView>
        <UI.Container style={{marginBottom: '20%'}}>
          <UI.Flex middle column>
            <UI.Div width="100%">
              <View style={{gap: 18, marginTop: '20%'}}>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: 25,
                      textAlign: 'center',
                    }}>
                    Registration
                  </Text>
                </View>
                <View style={{}}>
                  <TextInput
                    value={formData.name}
                    style={{borderWidth: 1, width: '85%'}}
                    placeholder="Enter Name"
                    placeholderTextColor={'grey'}
                    onChangeText={text =>
                      setFormData({...formData, name: text})
                    }
                  />
                  {formErrors.name && (
                    <Text style={styles.errorText}>{formErrors.name}</Text>
                  )}
                </View>
                <View>
                  <TextInput
                    value={formData.phone}
                    style={{borderWidth: 1, width: '85%'}}
                    placeholder="Enter Phone Number"
                    placeholderTextColor={'grey'}
                    onChangeText={text =>
                      setFormData({...formData, phone: text})
                    }
                  />
                  {formErrors.phone && (
                    <Text style={styles.errorText}>{formErrors.phone}</Text>
                  )}
                </View>
                <View>
                  <TextInput
                    value={formData.gmail}
                    style={{borderWidth: 1, width: '85%'}}
                    placeholder="Enter Gmail"
                    placeholderTextColor={'grey'}
                    onChangeText={text =>
                      setFormData({...formData, gmail: text})
                    }
                  />
                  {formErrors.gmail && (
                    <Text style={styles.errorText}>{formErrors.gmail}</Text>
                  )}
                </View>
                <View>
                  <TextInput
                    value={formData.password}
                    style={{borderWidth: 1, width: '85%'}}
                    placeholder="Enter Password"
                    placeholderTextColor={'grey'}
                    onChangeText={text =>
                      setFormData({...formData, password: text})
                    }
                  />
                  {formErrors.password && (
                    <Text style={styles.errorText}>{formErrors.password}</Text>
                  )}
                </View>
                <View>
                  <TextInput
                    value={formData.conPassword}
                    style={{borderWidth: 1, width: '85%'}}
                    placeholder="Enter Confirm Password"
                    placeholderTextColor={'grey'}
                    onChangeText={text =>
                      setFormData({...formData, conPassword: text})
                    }
                  />
                  {formErrors.conPassword && (
                    <Text style={styles.errorText}>
                      {formErrors.conPassword}
                    </Text>
                  )}
                </View>
              </View>
              <View style={{alignItems: 'center', marginTop: '15%'}}>
                <TouchableOpacity
                  style={{borderWidth: 1, width: '50%', padding: 10}}
                  onPress={() => submitForm()}>
                  <Text style={{color: 'black', textAlign: 'center'}}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </UI.Div>
          </UI.Flex>
        </UI.Container>
      </ScrollView>
    </UI.Div>
  );
};

export default Registration;

const styles = StyleSheet.create({
  errorText: {
    // marginTop: 1,
    color: 'red',
    // textAlign: 'left',
    // alignItems: 'flex-start',
  },
  loginBG: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
