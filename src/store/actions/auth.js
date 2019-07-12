import { AsyncStorage } from 'react-native';

import * as actions from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs';
import App from '../../../App';

const API_KEY = 'AIzaSyCc6Qc9xkUEarkXFimccYXS1HAuH_kC2v4'

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    const url = authMode === 'login' ? 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + API_KEY : 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + API_KEY;
    dispatch(auth(authData, url));
  }
}

export const auth = (authData, url) => {
  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(err => {
      console.log(err);
      alert('Authentication falied! Please try again!');
      dispatch(uiStopLoading());
    })
    .then(res => res.json())
    .then(parsedRes => {
      dispatch(uiStopLoading());
      if(!parsedRes.idToken) {
        alert('Authentication falied! Please try again!');
      } else {
        dispatch(authStoreToken(parsedRes.idToken, parsedRes.expiresIn, parsedRes.refreshToken))
        startMainTabs();
      } 
    })
  }
} 

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const expiryDate = new Date().getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem('ap:auth:token', token);
    AsyncStorage.setItem('ap:auth:expiryDate', expiryDate.toString());
    AsyncStorage.setItem('ap:auth:refreshToken', refreshToken)
  }
}

export const authSetToken = (token, expiryDate) => {
  return {
    type: actions.SET_AUTH_TOKEN,
    token,
    expiryDate
  }
}

export const getAuthToken = () => {
  return (dispacth, getState) => {
    const promise =  new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;
      if(token || new Date(expiryDate) > new Date()) resolve(token);
      else {
        let fetchedToken;
        AsyncStorage.getItem('ap:auth:token')
          .catch(err => reject())
          .then((tokenFromStorage) => {
            fetchedToken = tokenFromStorage;
            if(!tokenFromStorage) {
              return reject(); 
            }
            return AsyncStorage.getItem('ap:auth:expiryDate');
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate))
            if(parsedExpiryDate > new Date()) {
              dispacth(authSetToken(fetchedToken, parsedExpiryDate));
              resolve(fetchedToken);
            } else {
              reject();
            }
            
          })
          .catch(err => reject());
      }
    });
    return promise.catch(err => {
      return AsyncStorage.getItem('ap:auth:refreshToken')
        .then(refreshToken => {
          return fetch('https://securetoken.googleapis.com/v1/token?key=' + API_KEY, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "grant_type=refresh_token&refresh_token=" + refreshToken
          });
        })
        .then(res => res.jeon())
        .then(parsedRes => {
          if(parsedRes.id_token) {
            dispacth(authStoreToken(parsedRes.id_token, parsedRes.expires_in, parsedRes.refresh_token));
            return parsedRes.id_token;
          } else {
            dispatch(authClearStorage()); 
          }
        })
    })
    .then(token => {
      if(!token) {
        throw(new Error());
      } else {
        return token;
      }
    })
  }
}

export const authAutoSignin = () => {
  return dispatch => {
    dispatch(getAuthToken())
      .then(token => {
        startMainTabs();
      })
  }
}

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem('ap:auth:token');
    AsyncStorage.removeItem('ap:auth:expiryDate');
    return AsyncStorage.removeItem('ap:auth:refreshToken');
  }
}

export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage())
      .then(() => {
        App();
      });
    dispatch(authRemoveToken());
  }
}

export const authRemoveToken = () => {
  return {
    type: actions.AUTH_REMOVE_TOKEN
  }
}