import { getTimerPlaningListData } from "../configAPI";

export const GET_TIMER_PLANING_LIST_SUCCESS = 'SET_TIMER_PLANING_LIST';
export const GET_TIMER_PLANING_LIST = 'GET_TIMER_PLANING_LIST';
export const GET_TIMER_PLANING_LIST_FAIL = 'GET_TIMER_PLANING_LIST_FAIL';

export const setTimerPlaningList = payload => ({
    type: GET_TIMER_PLANING_LIST_SUCCESS,
    payload,
});

const getTimerPlaningListRequestFail = payload => ({
    type: GET_TIMER_PLANING_LIST_FAIL,
    payload
});

const getTimerPlaningListRequest = () => ({
    type: GET_TIMER_PLANING_LIST,
});

export const getTimerPlaningListAction = () => async dispatch => {
    dispatch(getTimerPlaningListRequest());
    try {
        const { data } = await getTimerPlaningListData({});

        dispatch(setTimerPlaningList(data));

    } catch (error) {
        dispatch(getTimerPlaningListRequestFail(error));
    }
};