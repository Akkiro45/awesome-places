import * as actions from '../actions/actionTypes';
import { updateObject } from '../../utility/utility';

const initialState = {
  places: [],
  placeAdded: true
};

const setPlace = (state, action) => {
  return {
    ...state,
    places: action.places
  }
}

const deletePlace = (state, action) => {
  return updateObject(state, {
    places: state.places.filter((p,i) => p.key !== action.key)
  });
} 

const placeAdded = (state, action) => {
  return updateObject(state, {
    placeAdded: true
  });
}
const placeAddStart = (state, action) => {
  return updateObject(state, {
    placeAdded: false
  });
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actions.SET_PLACES:
      return setPlace(state, action);
    case actions.DELETE_PLACE:
      return deletePlace(state, action);
    case actions.PLACE_ADDED:
      return placeAdded(state, action);
    case actions.ADD_START:
      return placeAddStart(state, action);
    default:
      return state;
  }
};

export default reducer;