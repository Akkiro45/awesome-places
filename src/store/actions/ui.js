import { UI_START_LOADING, UI_STOP_LOADING } from './actionTypes.js';

export const uiStartLoading = () => {
  return {
    type: UI_START_LOADING
  }
}
export const uiStopLoading = () => {
  return {
    type: UI_STOP_LOADING
  }
}