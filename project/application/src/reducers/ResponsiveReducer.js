import * as types from '../actions/ResponsiveActions';

const initialState = {
    viewport: {
        width: 0,
        height: 0,
    },
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_VIEWPORT_SIZE: {
            return { ...state, viewport: payload };
        }

        default:
            return state;
    }
};
