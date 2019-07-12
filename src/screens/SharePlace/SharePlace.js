import React, { Component } from 'react';
import { View, ActivityIndicator, Button, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { addPlace, placeAddStart } from '../../store/actions/index';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import { validate } from '../../utility/validation';
import { updateObject } from '../../utility/utility';

class SharePlace extends Component {

  state = {
    controls: {
      placeName: {
        value: '',
        valid: false,
        touched: false,
        validationRules: {
          notEmpty: true
        }
      },
      location: {
        value: null,
        valid: false
      },
      image: {
        value: null,
        valid: false
      }
    }
  }

  static navigatorStyle = {
    navBarButtonColor: '#2874ff'
  }

  placeNameChangedHandler = (key, value) => {
    // this.setState({ placeName: val });
    let valid = validate(this.state.controls[key].validationRules, value);
    this.setState(prevState => {
      const obj = prevState.controls[key];
      const updatedField = updateObject(obj, { value, valid, touched: true });
      const updatedControls = updateObject(prevState.controls, { [key]: updatedField });
      return updateObject({ controls: updatedControls });
    });
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    this.reset();
  }
  componentDidUpdate() {
    if(this.props.placeAdded) {
      this.props.navigator.switchToTab({ tabIndex: 0 });
    }
  }

  reset = () => {
    this.setState({
      controls: {
        placeName: {
          value: '',
          valid: false,
          touched: false,
          validationRules: {
            notEmpty: true
          }
        },
        location: {
          value: null,
          valid: false
        },
        image: {
          value: null,
          valid: false
        }
      }
    });
  }

  onNavigatorEvent = event => {
    if(event.type === 'ScreenChangedEvent') {
      if(event.id === 'willAppear') {
        this.props.onPlaceAddStart();
      }
    }
    if(event.type === 'NavBarButtonPress') {
      if(event.id === 'sideDrawerToggle') {
        this.props.navigator.toggleDrawer({
          side: 'left'
        });
      }
    }
  }

  locationPickedhandler = location => {
    this.setState(prevState => {
      return {
        controls: updateObject(prevState.controls, { location: { value: location, valid: true } })
      }
    });
  }

  imagePickedHandler = image => {
    this.setState(prevState => {
      return {
        controls: updateObject(prevState.controls, { image: { value: image, valid: true } })
      }
    });
  }

  placeAddHandler = () => {
    if(this.state.controls.location.valid) {
      this.props.onPlaceAdded(
        this.state.controls.placeName.value, 
        this.state.controls.location.value,
        this.state.controls.image.value);
      this.reset();
      this.imagePicker.reset();
      this.locationPicker.reset();
    }
  }

  render() {
    let submitButton = (
      <Button 
        title='Share a Place' 
        onPress={this.placeAddHandler} 
        disabled={
          !this.state.controls.placeName.valid ||
          !this.state.controls.location.valid ||
          !this.state.controls.image.valid
        }
      />
    );
    if(this.props.isLoading) {
      submitButton = (
        <ActivityIndicator />
      );
    }
    return (
      <ScrollView>
        <View style={styles.container} >
          <MainText><HeadingText>Share a place with us!</HeadingText></MainText>
          
          <PickImage 
            onImagePicked={this.imagePickedHandler} 
            ref={ref => (this.imagePicker = ref)}
          />
          
          <PickLocation 
            onLocationPick={this.locationPickedhandler}
            ref={ref => (this.locationPicker = ref)}  
          />
          
          <PlaceInput
            placeName={this.state.controls.placeName.value}
            valid={this.state.controls.placeName.touched ? this.state.controls.placeName.valid : true}
            onChangeText={(val) => this.placeNameChangedHandler('placeName', val)}
          />
          <View style={styles.button} >
            {submitButton}
          </View>
  
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    margin: 8
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  }
}

const mapdispatchToProps = dispatch => {
  return {
    onPlaceAdded: (placeName, location, image) => dispatch(addPlace(placeName, location, image)),
    onPlaceAddStart: () => dispatch(placeAddStart())
  }
}

export default connect(mapStateToProps, mapdispatchToProps)(SharePlace);