import React, {useState, useEffect} from 'react';
import {
  TextInput,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../Design';
import {AntDesign} from 'react-native-vector-icons/AntDesign';
import {MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

import * as UI from '../../UI/UI';
import {fonts} from '../CustomFonts';

const AutoComplete = ({
  w,
  h,
  options,
  defaultValue,
  selectItem,
  placeholder,
}) => {
  const [value, setValues] = useState(defaultValue ? defaultValue : '');
  const [listItem, setListItem] = useState([]);
  const [showList, setShowList] = useState(false);
  const [inputValue, setInputValue] = useState(
    defaultValue ? defaultValue : '',
  );
  const {inputSet} = inputValue;
  const onHandelChangeText = text => {
    setValues(text);
    text.length === 0 && selectItem();
  };

  useEffect(() => {
    if (value.length > 1) {
      options && setListItem([...options]);
      setShowList(true);
      if (value.length > 2) {
        const newValues =
          options &&
          options.filter(
            el =>
              el.value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >
              -1,
          );
        setListItem([...newValues]);
        if (newValues.length === 0) {
          setShowList(false);
        }
      }
    } else {
      setShowList(false);
      options && setListItem([...options]);
    }
  }, [value]);

  return (
    <View
      style={{
        width: w ? w : '100%',
        height: h ? h : '100%',
        position: 'relative',
      }}>
      <TextInput
        placeholderTextColor={colors.grayBold}
        onChangeText={text => onHandelChangeText(text)}
        placeholder={placeholder}
        style={{
          backgroundColor: colors.white,
          // borderWidth: 1,
          padding: 10,
          width: '100%',
          height: 40,
          fontSize: 20,
          color: '#000',
          borderRadius: 6,
          fontFamily: fonts.rr,
        }}
      />
      {showList && (
        <View
          style={{
            position: 'absolute',
            zIndex: 30,
            width: '100%',
            height: 250,
            marginBottom: 20,
            overflow: 'hidden',
            borderBottomEndRadius: 6,
            top: 40,
            left: -15,
            backgroundColor: colors.white,
          }}>
          <ScrollView style={{flex: 1}} scrollEnabled={false}>
            {listItem.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setShowList(false);
                  selectItem(item);
                }}
                key={index}
                style={{
                  borderBottomWidth: 1,
                  padding: 8,
                  borderColor: colors.lightTheme,
                }}>
                <UI.Text font={fonts.rr} color="#000">
                  {item.title}
                </UI.Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default AutoComplete;
