import {
    GET_TIMER_PLANING_LIST_REQUEST,
    GET_TIMER_PLANING_LIST_REQUEST_SUCCESS,
    GET_TIMER_PLANING_LIST_REQUEST_FAIL,
} from '../actions/newPlaningActions';

const initialState = {
    timerPlaningList: [],
    isFetching: false,
    isInitialFetching: true,
    error: null,
};

export const newPlaningReducer = (state = initialState, { type, payload, error }) => {
    switch (type) {
        case GET_TIMER_PLANING_LIST_REQUEST: {
            return {
                ...state,
                isFetching: true,
            };
        }

        case GET_TIMER_PLANING_LIST_REQUEST_SUCCESS: {
            return {
                ...state,
                timerPlaningList: payload,
                isFetching: false,
                isInitialFetching: false,
            };
        }

        case GET_TIMER_PLANING_LIST_REQUEST_FAIL: {
            return {
                ...state,
                error,
                isFetching: false,
                isInitialFetching: false,
            };
        }

        default:
            return state;
    }
};
