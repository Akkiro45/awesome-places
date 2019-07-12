import * as actions from './actionTypes';
import { uiStartLoading, uiStopLoading, getAuthToken } from './index';

export const addPlace = (placeName, location, image) => {
  return dispatch => {
    dispatch(uiStartLoading());
    dispatch(getAuthToken())
      .then(token => {
        return fetch('https://us-central1-awesome-places-1561283364393.cloudfunctions.net/storeImage', {
          method: 'POST',
          body: JSON.stringify({
            image: image.base64
          }),
          headers: {
            "Authorization": "Bearer " + token
          }
        })
          .then(res => {
            if(res.ok) {
              return res.json()
            } else {
              throw new Error();
            }
          })
          .then(parsedRes => {
            const placeData = {
              name: placeName,
              location: location,
              image: parsedRes.imageUrl,
              imagePath: parsedRes.imagePath
            };
            return  fetch('https://awesome-places-1561283364393.firebaseio.com/places.json?auth=' + token, {
              method: 'POST',
              body: JSON.stringify(placeData)
            })
          })
          .catch(err => {
            alert('Something went wrong! Please try Again!');
            dispatch(uiStopLoading());
          })
          .then(res => {
            if(res.ok) {
              return res.json()
            } else {
              throw new Error();
            }
          })
          .then(parseRes => {
            console.log(parseRes);
            dispatch(uiStopLoading());
            dispatch(placesAdded());
          })
          .catch(err => {
            alert('Something went wrong! Please try Again!');
            dispatch(uiStopLoading());
          });
      })
      .catch(() => {
        alert('Something went wrong! Please try Again!');
        dispatch(uiStopLoading());
      })
  }
}

export const getPlaces = () => {
  return (dispatch, ) => {
    dispatch(getAuthToken())
      .then(token => {
        return fetch('https://awesome-places-1561283364393.firebaseio.com/places.json?auth=' + token)
      })
      .catch(() => {
        alert('Something went wrong! Please try Again!');
      })
      .then(res => {
        if(res.ok) {
          return res.json()
        } else {
          throw new Error();
        }
      })
      .then(parseRes => {
        const places = [];
        for(let key in parseRes) {
          places.push({
            ...parseRes[key],
            image: {
              uri: parseRes[key].image
            },
            key: key
          });
        }
        dispatch(setPlaces(places));
      })
      .catch(err => {
        alert('Something went wrong! Please try Again!');
      });
  }
}

export const setPlaces = places => {
  return {
     type: actions.SET_PLACES,
     places
  }
}

export const placeAddStart = () => {
  return {
    type: actions.ADD_START
  }
}

export const placesAdded = () => {
  return {
    type: actions.PLACE_ADDED
  }
}

export const deletePlace = (key) => {
  return {
    type: actions.DELETE_PLACE,
    key
  }
}

export const deletePlace1 = (key) => {
  return dispatch => {
    dispatch(uiStartLoading());
    fetch('https://awesome-places-1561283364393.firebaseio.com/places/' + key +'.json', {
      method: 'DELTE'
    })
      .catch(err => {
        console.log(err);
        alert('Something went wrong! Please try Again!');
      })
      .then((res) => {
        console.log(res);
        dispatch(uiStartLoading());
      })
  }
} 