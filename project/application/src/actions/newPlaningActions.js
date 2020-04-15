import { getTimerPlaningListData } from '../configAPI';

export const GET_TIMER_PLANING_LIST_REQUEST = 'GET_TIMER_PLANING_LIST_REQUEST';
export const GET_TIMER_PLANING_LIST_REQUEST_SUCCESS = 'GET_TIMER_PLANING_LIST_REQUEST_SUCCESS';
export const GET_TIMER_PLANING_LIST_REQUEST_FAIL = 'GET_TIMER_PLANING_LIST_REQUEST_FAIL';

const getTimerPlaningListRequest = () => ({
    type: GET_TIMER_PLANING_LIST_REQUEST,
});

const getTimerPlaningListRequestSuccess = payload => ({
    type: GET_TIMER_PLANING_LIST_REQUEST_SUCCESS,
    payload,
});

const getTimerPlaningListRequestFail = error => ({
    type: GET_TIMER_PLANING_LIST_REQUEST_FAIL,
    error,
});

export const getTimerPlaningListAction = () => async dispatch => {
    dispatch(getTimerPlaningListRequest());
    try {
        const { data } = await getTimerPlaningListData({});

        dispatch(getTimerPlaningListRequestSuccess(data));
    } catch (error) {
        dispatch(getTimerPlaningListRequestFail(error));
    }
};
