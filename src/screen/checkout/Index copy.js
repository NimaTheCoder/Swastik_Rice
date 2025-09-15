import React, {useState, useEffect} from 'react';
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
import {useSelector} from 'react-redux';
import {imageUrl} from '../../../config';
import {useNavigation} from '@react-navigation/native';
const data = ['Credit Card/ Debit Card', 'UPI', 'Wallets', 'Cash On Delivery'];
const Checkout = props => {
  const navigation = useNavigation();
  const {carts} = useSelector(state => state.cart);

  const [selectedProducts, setSelectedProducts] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentErrors, setPaymentErrors] = useState('');

  useEffect(() => {
    setSelectedProducts(carts?.data[0]);
  }, [carts]);
  const finalCheckout = () => {
    if (paymentMethod !== '') {
      navigation.navigate('paymentSuccess');
      setPaymentErrors('');
    } else {
      setPaymentErrors('Select Payment Method ');
    }
  };

  return (
    <Layout showBar back comProps={props}>
      <UI.Container>
        <ScrollView style={{marginBottom: '25%'}}>
          <UI.Div>
            <UI.Flex>
              <UI.Div width="40%" height={140}>
                <Image
                  source={{
                    uri: `${imageUrl}${selectedProducts.mediumThumbnail}`,
                  }}
                  style={style.loginBG}
                />
              </UI.Div>
              <UI.Div width="55%" height={140} ml={10}>
                <UI.Text
                  size={18}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: colors.layoutTheme,
                  }}>
                  Order id:{' '}
                  <UI.Text color={colors.layoutTheme}> 2023112209</UI.Text>
                </UI.Text>
                <UI.Text size={18} mt={10}>
                  Cart Value:{' '}
                  <UI.Text color={colors.layoutTheme}>
                    ₹
                    {carts?.data?.reduce(
                      (sum, product) => sum + product.salePrice,
                      0,
                    )}
                  </UI.Text>
                </UI.Text>
                <UI.Text size={18} mt={10}>
                  Products:{' '}
                  <UI.Text color={colors.layoutTheme}>
                    {carts?.data?.length}
                  </UI.Text>
                </UI.Text>
              </UI.Div>
            </UI.Flex>
            <UI.Div>
              <UI.Text color={colors.layoutTheme} size={18}>
                Products
              </UI.Text>
              <ScrollView>
                <UI.Flex middle>
                  {carts?.data?.map((el, index) => (
                    <UI.Div key={index} width="20%" height={100} mr={10}>
                      <Image
                        source={{
                          uri: `${imageUrl}${el.mediumThumbnail}`,
                        }}
                        style={style.oderImg}
                      />
                      <UI.Text center size={14} color={colors.layoutTheme}>
                        Products {index + 1}
                      </UI.Text>
                    </UI.Div>
                  ))}
                </UI.Flex>
              </ScrollView>
            </UI.Div>
          </UI.Div>
          {/* {******************adresss *******************************} */}

          <UI.Div>
            <UI.Text bold color={colors.layoutTheme}>
              Delivery address
            </UI.Text>
            <UI.Flex>
              <TouchableOpacity
                style={{
                  width: 150,
                  paddingVertical: 20,
                  marginHorizontal: 6,
                  borderRadius: 10,
                  borderColor: colors.layoutTheme,
                  borderWidth: 1,
                  backgroundColor: colors.grayLight,
                }}>
                <UI.Text center color={colors.layoutTheme}>
                  Address 1 ...
                </UI.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 150,
                  marginHorizontal: 6,
                  paddingVertical: 20,
                  borderRadius: 10,
                  borderColor: colors.garyMidMaxBold,
                  borderWidth: 1,
                  backgroundColor: colors.grayLight,
                }}>
                <UI.Text center color={colors.grayBoldMax}>
                  Address 2 ...
                </UI.Text>
              </TouchableOpacity>
            </UI.Flex>
            <UI.Div>
              <UI.Flex column>
                <UI.Text color={colors.layoutTheme}>Address 1 ...</UI.Text>
                <UI.Text color={colors.garyMidMaxBold}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do 900765
                </UI.Text>
              </UI.Flex>
            </UI.Div>
          </UI.Div>
          {/* {******************adresss *******************************} */}
          <UI.Flex width={'100%'}>
            <UI.Div width={'100%'}>
              {data.map((el, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setPaymentMethod(el);
                  }}
                  key={index}
                  style={{
                    width: '80%',
                    borderWidth: paymentMethod == el ? 1 : 0,
                    borderColor: paymentMethod == el ? 'green' : '',
                    backgroundColor: colors.grayLight,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    borderRadius: 6,
                    marginBottom: 10,
                  }}>
                  <UI.Text size={16} color={colors.garyMidMaxBold}>
                    {el}
                  </UI.Text>
                </TouchableOpacity>
              ))}
              <UI.Text color="red">{paymentErrors}</UI.Text>
            </UI.Div>
          </UI.Flex>

          <UI.Div pb={20}>
            <UI.Button
              onPress={() => finalCheckout()}
              width={'80%'}
              mr={'auto'}
              ml={'auto'}
              gpb={16}
              gpt={16}
              text="CHECKOUT"
            />
          </UI.Div>
        </ScrollView>
      </UI.Container>
    </Layout>
  );
};

export default Checkout;
const style = StyleSheet.create({
  shadow: {
    shadowColor: '#f7a824',
    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 10,
  },
  loginBG: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  oderImg: {
    borderRadius: 10,
    width: '100%',
    height: '70%',
  },
});
