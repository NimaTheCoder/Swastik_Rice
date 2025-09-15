import React, {useCallback, useState} from 'react';
import {
  View,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
// import Modal from 'react-native-modal';

import * as UI from '../../Components/UI/UI';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../../Components/Design';
import RangeSlider from '../../Components/RangeSlider';
import {fonts} from '../../Components/common/CustomFonts';
const FilterProducts = ({
  allProductList,
  setAllProductList,
  showFilterModal,
  setShowFilterModal,
  categoryByProduct,
  priceValue,
  setPriceValue,
}) => {
  const {width, fontScale} = Dimensions.get('window');
  const tabData = [{title: 'Price', id: 1}];
  const priceList = [
    {id: 1, title: '₹100 - ₹500', to: 100, form: 500},
    {id: 2, title: '₹500 - ₹1000', to: 500, form: 1000},
    {id: 3, title: '₹1500 - ₹2000', to: 1500, form: 2000},
    {id: 4, title: 'Over ₹2,000', to: 2000, form: 100000},
  ];

  const applyBtn = () => {
    setShowFilterModal(!showFilterModal);
    if (priceValue !== null) {
      const filteredProducts = categoryByProduct.filter(
        product =>
          product.salePrice >= priceValue.to &&
          product.salePrice <= priceValue.form,
      );

      setAllProductList(filteredProducts);
    }
  };
  const cancelBtn = () => {
    setAllProductList(categoryByProduct);
    setPriceValue(null);
    setShowFilterModal(!showFilterModal);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      // animationIn="slideInRight"
      // animationOut="slideOutRight"
      visible={showFilterModal}
      onRequestClose={() => {
        setShowFilterModal(!showFilterModal);
      }}>
      <View style={styles.centeredView}>
        <TouchableOpacity
          onPress={() => setShowFilterModal(!showFilterModal)}
          style={{
            backgroundColor: '',
            width: '100%',
            height: '80%',
          }}></TouchableOpacity>
        <View style={styles.modalView}>
          {/* <UI.Flex p={10} spaceb middle>
            <UI.Div></UI.Div>
            <TouchableOpacity
              style={{marginLeft: 'auto'}}
              onPress={() => setShowFilterModal(!showFilterModal)}>
              <AntDesign name="close" size={30} color={colors.layoutTheme} />
            </TouchableOpacity>
          </UI.Flex> */}
          <UI.Div style={{height: '90%'}}>
            <UI.Flex spaceb middle>
              <UI.Div width="30%" height="100%">
                {tabData.map((el, i) => (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    key={i}
                    style={{
                      backgroundColor: '#fcf7f0',
                      height: 50,
                      justifyContent: 'center',
                    }}>
                    <UI.Text font={fonts.rm} center size={14 / fontScale}>
                      {el.title}
                    </UI.Text>
                  </TouchableOpacity>
                ))}
              </UI.Div>
              <UI.Div
                style={{flexDirection: 'row', flexWrap: 'wrap'}}
                pl={10}
                pr={10}
                width="70%"
                height="100%">
                {priceList.map((el, i) => (
                  <TouchableOpacity
                    onPress={() => setPriceValue(el)}
                    activeOpacity={0.6}
                    key={i}
                    style={{
                      // backgroundColor: '#fcf7f0',
                      backgroundColor:
                        priceValue === null
                          ? 'fcf7f0'
                          : priceValue.id == el.id
                          ? colors.layoutTheme
                          : '#fcf7f0',

                      // height: 40,
                      margin: 3,
                      paddingVertical: 10,
                      paddingHorizontal: 10,

                      borderRadius: 6,
                    }}>
                    <UI.Text
                      font={fonts.rr}
                      center
                      size={14 / fontScale}
                      color={
                        priceValue === null
                          ? colors.layoutTheme
                          : priceValue.id == el.id
                          ? '#fff'
                          : colors.layoutTheme
                      }>
                      {el.title}
                    </UI.Text>
                  </TouchableOpacity>
                ))}
              </UI.Div>
            </UI.Flex>
          </UI.Div>

          <UI.Div style={{position: 'absolute', width: '100%', bottom: 0}}>
            <UI.Flex spaceb p={0} ml="auto" mr="auto" width="100%">
              <TouchableOpacity
                onPress={() => cancelBtn()}
                activeOpacity={0.6}
                style={{
                  borderRightWidth: 1,
                  borderColor: '#fff',
                  backgroundColor: colors.layoutTheme,

                  padding: 12,
                  width: '50%',
                }}>
                <UI.Text
                  font={fonts.rr}
                  size={14 / fontScale}
                  color="#fff"
                  center>
                  Cancel
                </UI.Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => applyBtn()}
                activeOpacity={0.6}
                style={{
                  backgroundColor: colors.layoutTheme,

                  padding: 12,
                  width: '50%',
                }}>
                <UI.Text
                  font={fonts.rr}
                  size={14 / fontScale}
                  color="#fff"
                  center>
                  Apply
                </UI.Text>
              </TouchableOpacity>
            </UI.Flex>
          </UI.Div>
        </View>
      </View>
    </Modal>
  );
};

export default FilterProducts;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 20,

    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
