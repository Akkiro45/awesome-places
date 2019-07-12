import React, { Component } from "react";
import { View, Keyboard, ActivityIndicator, TouchableWithoutFeedback, Dimensions, StyleSheet, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import HeaderText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import backgroundImage from '../../assets/background.jpg';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import { updateObject } from '../../utility/utility';
import { validate } from '../../utility/validation';
import { tryAuth, authAutoSignin } from '../../store/actions/index';

class AuthScreen extends Component {

  state = {
    viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
    authMode: 'login',
    controls: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validationRuls: {
          isEmail: true
        }
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validationRuls: {
          minLength: 6
        }
      },
      confirmPassword: {
        value: '',
        valid: false,
        touched: false,
        validationRuls: {
          equalTo: 'password'
        }
      }
    }
  }

  constructor(prosp) {
    super(prosp);
    Dimensions.addEventListener('change', this.updateStyles);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyles);
  }

  componentDidMount() {
    this.props.onAuthAutoSignin();
  }

  updateInputState = (key, value) => {
    let valid;
    this.setState(prevState => {
      const obj = prevState.controls[key];
      if(key === 'confirmPassword') {
        valid = validate(obj.validationRuls, value, prevState.controls[obj.validationRuls['equalTo']].value);
      } else if(key === 'password') {
        valid = validate(obj.validationRuls, obj.value);
      } else {
        valid = validate(obj.validationRuls, obj.value);
      }
      const updatedField = updateObject(obj, { value, valid, touched: true });
      const updatedControls = updateObject(prevState.controls, { [key]: updatedField });
      return updateObject({ controls: updatedControls });
    });
  }

  authModeChangeHandler = () => {
    this.setState(prevState => {
      return { 
        authMode: prevState.authMode === 'login' ? 'signup' : 'login'
      }
    });
  }

  updateStyles = (dims) => {
    this.setState({
      viewMode: dims.window.height > 500 ? 'portrait' : 'landscape'
    });
  }

  authHandler = () => {
    const authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
    this.props.onTryAuth(authData, this.state.authMode);
  }

  render() {
    let headingText = null;
    if(this.state.viewMode === 'portrait') {
      headingText = (
        <MainText>
          <HeaderText>Please Log in</HeaderText>
        </MainText>
      );
    }
    let confirmPasswordContent = null;
    if(this.state.authMode === 'signup') {
      confirmPasswordContent = (
        <View style={this.state.viewMode === 'portrait' ? styles.portraiPasswordWrappeer : styles.landscapePasswordWrappeer} >
          <Input 
            placeholder='Confirm Password' 
            style={styles.input}
            value={this.state.controls.confirmPassword.value} 
            onChangeText={(val) => this.updateInputState('confirmPassword', val)} 
            valid={this.state.controls.confirmPassword.touched ? this.state.controls.confirmPassword.valid : true}
            secureTextEntry
          />
        </View>
      );
    }
    let buttonRen = (
      <ButtonWithBackground 
        color='#29aaf4' 
        onPress={this.authHandler}
        disabeld={!this.state.controls.email.valid || !this.state.controls.password.valid || !this.state.controls.confirmPassword.valid && this.state.authMode === 'signup'} 
      >Submit</ButtonWithBackground>
    );
    if(this.props.isLoading) {
      buttonRen = <ActivityIndicator />
    }
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} >
        <KeyboardAvoidingView style={styles.container} behavior='padding' >
          {headingText}
          <ButtonWithBackground color='#29aaf4' onPress={this.authModeChangeHandler}>
            SWITCH TO {this.state.authMode === 'login' ? 'Login' : 'Signup'}
          </ButtonWithBackground>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={styles.inputContainer} >
              <Input 
                placeholder='Your Email Adress' 
                style={styles.input}
                value={this.state.controls.email.value} 
                onChangeText={(val) => this.updateInputState('email', val)} 
                valid={this.state.controls.email.touched ? this.state.controls.email.valid : true}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
              />
              <View style={this.state.viewMode === 'portrait' || this.state.authMode === 'login' ? styles.portraitPasswordConatiner : styles.landscapePasswordConatiner} >
                <View style={this.state.viewMode === 'portrait' || this.state.authMode === 'login' ? styles.portraiPasswordWrappeer : styles.landscapePasswordWrappeer} >
                  <Input 
                    placeholder='Password' 
                    style={styles.input}
                    value={this.state.controls.password.value} 
                    onChangeText={(val) => this.updateInputState('password', val)} 
                    valid={this.state.controls.password.touched ? this.state.controls.password.valid : true}
                    secureTextEntry
                  />
                </View>
                {confirmPasswordContent}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {buttonRen}
        </KeyboardAvoidingView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: '#eee',
    borderColor: '#bbb'
  },
  backgroundImage: {
    width: '100%',
    flex: 1
  },
  landscapePasswordConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  landscapePasswordWrappeer: {
    width: '45%'
  },
  portraitPasswordConatiner: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  portraiPasswordWrappeer: {
    width: '100%'
  }
});

// export default AuthScreen;

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading
  }
}

const mapDispachToProps = dispatch => {
  return {
    onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    onAuthAutoSignin: () => dispatch(authAutoSignin())
  }
}

export default connect(mapStateToProps, mapDispachToProps)(AuthScreen);