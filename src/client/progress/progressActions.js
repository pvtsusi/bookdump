
import { LOADED, LOADING } from './progressConstants';

export const startLoading = () => dispatch => dispatch({type: LOADING });
export const endLoading = () => dispatch => dispatch({type: LOADED });
