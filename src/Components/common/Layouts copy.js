import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  BackHandler,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextPa} from './Design';
import * as UI from '../UI/UI';
import {colors} from '../Design';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AutoComplete from './AutoComplete/AutoComplete';
import data from '../../screen/product/data.json';
const Layout = props => {
  const {cart} = useSelector(state => state.cart);
  //dots-three-vertical
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] = useState(false);
  const route = useRoute();
  const canGoBack = () => {
    props.comProps.navigation.goBack();
  };

  const userInfoSubmit = () => {
    props.comProps.navigation.navigate('userInfo');
  };
  const handleLogin = () => {
    props.comProps.navigation.navigate('login');
  };
  // AutoComplete start
  const options =
    data &&
    data.map(item => ({
      ...item,
      id: item.id,
      value: item.title, // value is required !what you searching in input (auto Complete)
    }));

  const selectItem = item => {};
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          colors.grey,
          colors.white,
          colors.white,
          colors.white,
          colors.white,
          colors.white,
          colors.white,
          colors.white,
          colors.white,
          colors.white,
          colors.white,
        ]}
        start={{x: 1, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linearGradient}>
        <StatusBar
          animated={true}
          backgroundColor={colors.blue}
          barStyle={'light-content'}
          //  showHideTransition={statusBarTransition}
          //  hidden={hidden}
          //   {
          //     shadowColor: '#000',
          //     shadowOffset: {
          //       width: 0,
          //       height: 4,
          //     },
          //     shadowOpacity: 0.1,
          //     shadowRadius: 1.65,
          //   },
        />

        {props?.showBar && (
          <UI.Flex
            middle
            spaceb
            style={{
              height: 60,
              position: 'relative',
              zIndex: 1,
              paddingHorizontal: 12,
              paddingVertical: 4,
              backgroundColor: colors.lowLightColor,
              shadowColor: '#52006A',
            }}>
            <AutoComplete
              w={'80%'}
              h={'70%'}
              options={options}
              defaultValue={''} // optional default Value now only for text
              selectItem={selectItem}
              placeholder="Search Item..."
            />

            {/* <TextInput
              placeholder="Search Item"
              style={{
                backgroundColor: colors.white,
                borderColor: colors.white,
                borderWidth: 1,
                width: '80%',
                height: '70%',
                color: '#000',
                borderRadius: 6,
              }}
            /> */}

            <TouchableOpacity
              onPress={() => props.comProps.navigation.navigate('Cart')}
              style={{position: 'relative'}}>
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'red',
                  width: 25,
                  height: 25,
                  right: -10,
                  bottom: 15,
                  zIndex: 1,
                  borderRadius: 50,
                }}>
                <UI.Text color="#fff" center>
                  {cart.length}
                </UI.Text>
              </View>
              <MaterialCommunityIcons
                name="cart"
                size={25}
                color={colors.boldTheme}
              />
            </TouchableOpacity>
            <UI.Div>
              <TouchableOpacity onPress={() => handleLogin()}>
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={30}
                  color={colors.boldTheme}
                />
              </TouchableOpacity>
            </UI.Div>
          </UI.Flex>
        )}
        {props.children}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Layout;
var styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  logo: {
    height: 130,
    width: 150,
    resizeMode: 'stretch',
  },
});
