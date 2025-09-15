import React from 'react';
import {View, Text, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
// import { increment, decrement, reset } from './counterSlice';
import {increment, decrement, reset} from '../Redux/reducerSlice/CounterSlice';
import * as UI from './UI/UI';
import Autocomplete from './common/AutoComplete/AutoComplete';
const Counter = () => {
  const count = useSelector(state => state.counter.count);

  const dispatch = useDispatch();
  const handleIn = () => {
    // console.log('first');
    dispatch(increment());
  };
  return (
    <View>
      {/* <Text>Count: {count}</Text> */}
      <UI.Text color="yellow">Count : {count}</UI.Text>
      <Button title="Increment" onPress={handleIn} />
      <Button title="Decrement" onPress={() => dispatch(decrement())} />
      <Button title="Reset" onPress={() => dispatch(reset())} />
      <Autocomplete placeholder="Search here ....." />
    </View>
  );
};

export default Counter;
