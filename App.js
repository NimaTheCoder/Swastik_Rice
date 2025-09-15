import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
// import { store, persistor } from './store';
import {persistor, store} from './src/Redux/store';
import SplashScreen from 'react-native-splash-screen';
import Navigation from './src/screen/Navigation';
import {Text, View, Platform} from 'react-native';
import Loading from './src/Components/common/laoding/Loading';
import {LoadingScreen} from './src/Components/common/ALLImages';
import LoginScreen from './src/screen/Login/LoginScreen';
import {ToastProvider} from 'react-native-toast-notifications';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

// https://github.com/rebininfotech/bharatitr/blob/1.0.2/src/Screen/AuthScreen/Login.js
const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);
  // const linking = {
  //   prefixes: ['https://tms.goldenbuzz.in/app'],
  //   config: {
  //     screens: {},
  //   },
  // };

  console.log('1');
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <NavigationContainer >
          <Navigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
