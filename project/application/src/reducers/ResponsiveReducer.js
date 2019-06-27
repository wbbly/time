import * as types from '../actions/ResponsiveActions';

const initialState = {
    viewport: {
        width: 0,
        height: 0,
    },
    isShowMenu: false,
    isMobile: false,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_VIEWPORT_SIZE: {
            return { ...state, viewport: payload };
        }

        case types.SWITCH_MENU: {
            return { ...state, isShowMenu: !state.isShowMenu };
        }

        case types.SET_IS_MOBILE: {
            return { ...state, isMobile: payload };
        }

        default:
            return state;
    }
};
