import {
    SET_VIEWPORT_SIZE,
    SWITCH_MENU,
    SET_IS_MOBILE,
    SET_SWIPED_TASK,
    SCROLL_TO,
} from '../actions/ResponsiveActions';

const initialState = {
    viewport: {
        width: 0,
        height: 0,
    },
    isShowMenu: true,
    isMobile: false,
    swipedTask: null,
    scrollTo: null,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_VIEWPORT_SIZE: {
            return { ...state, viewport: payload };
        }

        case SWITCH_MENU: {
            return { ...state, isShowMenu: !state.isShowMenu };
        }

        case SET_IS_MOBILE: {
            return { ...state, isMobile: payload };
        }

        case SET_SWIPED_TASK: {
            return { ...state, swipedTask: payload };
        }

        case SCROLL_TO: {
            return { ...state, scrollTo: payload };
        }

        default:
            return state;
    }
};
