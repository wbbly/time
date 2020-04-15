import {
    GET_TIMER_PLANING_LIST_SUCCESS,
    GET_TIMER_PLANING_LIST,
    GET_TIMER_PLANING_LIST_FAIL,
} from '../actions/newPlaningActions';

const initialState = {
    timerPlaningList: [],
    isFetching: false,
    isInitialFetching: true,
    error:null
};

export const newPlaningReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_TIMER_PLANING_LIST_SUCCESS: {
            return {
                ...state,
                timerPlaningList: payload,
                isFetching: false,
                isInitialFetching: false
            };
        }

        case GET_TIMER_PLANING_LIST: {
            return {
                ...state,
                isFetching: true,
            };
        }

        case GET_TIMER_PLANING_LIST_FAIL: {
            return {
                ...state,
                error: payload,
                isFetching: false,
                isInitialFetching: false
            };
        }

        default:
            return state;
    }
};
