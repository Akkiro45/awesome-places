import React, { Component } from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// API_KEY_TUT = AIzaSyDUaGU05JXGw2l-2SVx-rw_V9DpEqOkQE
// API_KEY_MY = AIzaSyCHHMC2keM90jl2qpFcyCYnG3cu55uY9zA

class PickLocation extends Component {
  state = {
    focusedLocation: {
      latitude: 37.7900352,
      longitude: -122.4013726,
      latitudeDelta: 0.0122,
      longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
    },
    locationChosen: false
  }
  reset = () => {
    this.setState({
      focusedLocation: {
        latitude: 37.7900352,
        longitude: -122.4013726,
        latitudeDelta: 0.0122,
        longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
      },
      locationChosen: false
    });
  }

  componentDidMount() {
    this.reset();
  }

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude: coords.latitude,
      longitude: coords.longitude
    });
    this.setState(prevState => {
      return {
        focusedLocation: {
          ...prevState.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        locationChosen: true
      }
    });
    this.props.onLocationPick({
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  }

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      }
      this.pickLocationHandler(coordsEvent);
    }, err => {
      alert('Unable to fetch Location!');
    });
  }

  render() {
    let marker = null;
    if(this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.focusedLocation} />
    }
    return (
      <View style={styles.container} >
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={
            this.state.focusedLocation
          }
          region={!this.state.locationChosen ? this.state.focusedLocation : null}
          style={styles.map}
          onPress={this.pickLocationHandler}
          ref={ref => this.map = ref}
        >
          {marker}
        </MapView>
        <View style={styles.button} >
          <Button title='Locate Me' onPress={this.getLocationHandler} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },   
  map: {
    width: '100%',
    height: 250 
  },
  button: {
    margin: 8
  }
});

export default PickLocation;