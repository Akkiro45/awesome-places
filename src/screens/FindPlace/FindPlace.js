import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { connect } from 'react-redux';

import PlaceList from '../../components/PlaceList/PlaceList';
import { getPlaces } from '../../store/actions/index';

class FindPlace extends Component {

  state = {
    placesLoaded: false,
    removeAnim: new Animated.Value(1)
  }

  static navigatorStyle = {
    navBarButtonColor: '#2874ff'
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  // componentDidMount() {
  //   this.props.getPlaces();
  // }

  onNavigatorEvent = event => {
    if(event.type === 'ScreenChangedEvent') {
      if(event.id === 'willAppear') {
        this.props.getPlaces();
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

  itemSelectedHandler = key => {
    const selectedPlace = this.props.places.find(place => place.key === key);
    this.props.navigator.push({
      screen: 'awesome-places.PlaceDetailsScreen',
      title: selectedPlace.name,
      passProps: {
        selectedPlace 
      }
    });
  }

  placesSearchHandler = () => {
    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      this.setState({ placesLoaded: true});
    });
  }

  render() {
    let content = (
      <Animated.View style={{
        opacity: this.state.removeAnim,
        transform: [
          {
            scale: this.state.removeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 1]
            })
          }
        ]
      }} >
        <TouchableOpacity onPress={this.placesSearchHandler} >
          <View style={styles.searchButton} >
            <Text style={styles.searchButtonText} >Find Places</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
    if(this.state.placesLoaded) {
      content = (
        <PlaceList places={this.props.places} onItemSelected={this.itemSelectedHandler} />
      );
    }
    return (
      <View style={this.state.placesLoaded ? null : styles.buttonContainer} >
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchButton: {
    borderColor: '#2874ff',
    borderWidth: 3,
    borderRadius: 50,
    padding: 20
  },
  searchButtonText: {
    color: '#2874ff',
    fontWeight: 'bold',
    fontSize: 26
  }
});

const mapStateToProps = state => {
  return {
    places: state.places.places
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPlaces: () => dispatch(getPlaces())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPlace);