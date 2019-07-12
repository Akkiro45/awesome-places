import { SET_AUTH_TOKEN, AUTH_REMOVE_TOKEN } from '../actions/actionTypes';

const initState = {
  token: null,
  expiryDate: null
}

const reducer = (state = initState, action) => {
  switch(action.type) {
    case SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.token,
        expiryDate: action.expiryDate
      }
    case AUTH_REMOVE_TOKEN:
      return {
        ...state,
        token: null,
        expiryDate: null
      }
    default:
      return state;
  }
}

export default reducer;