import React from 'react';
import { 
  TouchableOpacity, 
  View, 
  Text, 
  StyleSheet,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

const buttonWithBackground = (props) => {
  const content = (
    <View style={[styles.button, {backgroundColor: props.color}, props.disabeld ? styles.disabeld : null ]} >
      <Text styles={props.disabeld ? styles.diabledText : null} >{props.children}</Text>
    </View>
  );
  if(props.disabeld) {
    return content;
  }
  if(Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback onPress={props.onPress} >
        {content}
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity onPress={props.onPress} >
        {content}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black'
  },
  disabeld: {
    backgroundColor: '#bbb',
    borderColor: '#aaa'
  },
  diabledText: {
    color: '#aaa'
  }
});

export default buttonWithBackground;