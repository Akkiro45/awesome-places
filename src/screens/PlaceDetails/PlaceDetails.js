import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { deletePlace } from '../../store/actions/index';

class PlaceDetails extends Component {

  deletePlaceHandler = () => {
    this.props.onDeletePlace(this.props.selectedPlace.key);
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container} >
        <View>
          <Image source={this.props.selectedPlace.image} style={styles.placeImage} />
          <MapView provider={PROVIDER_GOOGLE} style={styles.placeImage} region={{
            ...this.props.selectedPlace.location,
            latitudeDelta: 0.0122,
            longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
          }} >
            <MapView.Marker coordinate={this.props.selectedPlace.location} />
          </MapView>
          <Text style={styles.placeName} >{this.props.selectedPlace.name}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={this.deletePlaceHandler} >
            <View style={styles.delIcon} >
              <Icon name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'} color='red' size={30} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  container: {
    margin: 22
  },
  placeImage: {
    width: '100%',
    height: 200
  },
  placeName: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center'
  },
  delIcon: {
    alignItems: 'center'
  }
});


const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: (key) => dispatch(deletePlace(key))
  }
}

export default connect(null, mapDispatchToProps)(PlaceDetails);