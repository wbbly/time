import {
    GET_TIMER_PLANING_LIST_SUCCESS,
    GET_TIMER_PLANING_LIST,
    GET_TIMER_PLANING_LIST_FAIL,
} from '../actions/newPlaningActions';

const initialState = {
    timerPlaningList: [],
    isFetching: false,
};

export const newPlaningReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_TIMER_PLANING_LIST_SUCCESS: {
            return {
                ...state,
                timerPlaningList: payload,
                isFetching: false,
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
                isFetching: false,
            };
        }

        default:
            return state;
    }
};
