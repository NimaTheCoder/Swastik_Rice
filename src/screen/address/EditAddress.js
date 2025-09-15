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
} from 'react-native';

import Layout from '../../Components/common/Layouts';
import * as UI from '../../Components/UI/UI';
import {colors} from '../../Components/Design';
import {LoginBg, roundLogo, tmsLogo} from '../../Components/common/ALLImages';
const EditAddress = props => {
  return <Layout showBar back comProps={props}></Layout>;
};

export default EditAddress;
