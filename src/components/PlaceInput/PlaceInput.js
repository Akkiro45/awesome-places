import React from 'react';

import Input from '../UI/Input/Input';

const placeInput = (props) => (
  <Input 
    placeholder='Place Name' 
    value={props.placeName}
    onChangeText={props.onChangeText}
    valid={props.valid}
  />
);

export default placeInput;