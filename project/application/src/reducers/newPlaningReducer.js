import {
    SET_TIMER_PLANING_LIST,
    GET_TIMER_PLANING_LIST
} from '../actions/newPlaningActions';

const initialState = {
    timerPlaningList: [],
    isFetching: false,
};

export const newPlaningReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_TIMER_PLANING_LIST: {
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

        default:
            return state;
    }
};
