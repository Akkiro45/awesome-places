import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AuthScreen from './src/screens/Auth/Auth';
import FindPlaceScreen from './src/screens/FindPlace/FindPlace';
import SharePlaceScreen from './src/screens/SharePlace/SharePlace';
import PlaceDetailsScreen from './src/screens/PlaceDetails/PlaceDetails';
import SideDreawerScreen from './src/screens/SideDrawer/SideDrawer';

import configStore from './src/store/configStore';

const store = configStore(); 

// Register Screens
// Navigation.registerComponent('awesome-places.AuthScreen', () => AuthScreen);
Navigation.registerComponent('awesome-places.AuthScreen', () => AuthScreen, store, Provider);
Navigation.registerComponent('awesome-places.FindPlaceScreen', () => FindPlaceScreen, store, Provider);
Navigation.registerComponent('awesome-places.SharePlaceScreen', () => SharePlaceScreen, store, Provider); 
Navigation.registerComponent('awesome-places.PlaceDetailsScreen', () => PlaceDetailsScreen, store, Provider);
Navigation.registerComponent('awesome-places.SideDrawerScreen', () => SideDreawerScreen, store, Provider);

// Start App
export default () => Navigation.startSingleScreenApp({
  screen: {
    screen: 'awesome-places.AuthScreen',
    title: 'Login'
  }
});