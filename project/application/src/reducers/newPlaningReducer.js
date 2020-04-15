import { SET_TIMER_PLANING_LIST } from '../actions/newPlaningActions';

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
                isFetching: true,
            };
        }

        default:
            return state;
    }
};
