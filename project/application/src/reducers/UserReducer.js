// Types
import {
    GET_USER_DATA_REQUEST,
    GET_USER_DATA_REQUEST_SUCCESS,
    GET_USER_DATA_REQUEST_FAIL,
    SET_USER_AVATAR_REQUEST,
    SET_USER_AVATAR_REQUEST_SUCCESS,
    SET_USER_AVATAR_REQUEST_FAIL,
    RESET_ALL,
    CHANGE_USER_DATA,
    TOGGLE_MODAL,
} from '../actions/UserActions';

const initialState = {
    changePasswordModal: false,
    user: null,
    error: null,
    avatar: {
        isFetching: false,
        error: null,
    },
    isFetching: false,
    isInitialFetching: true,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_USER_DATA_REQUEST:
            return {
                ...state,
                isFetching: true,
            };

        case GET_USER_DATA_REQUEST_SUCCESS:
            return {
                ...state,
                user: payload,
                error: null,
                isFetching: false,
                isInitialFetching: false,
            };

        case GET_USER_DATA_REQUEST_FAIL:
            return {
                ...state,
                error: payload,
                isFetching: false,
                isInitialFetching: false,
            };

        // SET_USER_AVATAR
        case SET_USER_AVATAR_REQUEST:
            return {
                ...state,
                avatar: {
                    ...state.avatar,
                    isFetching: true,
                },
            };

        case SET_USER_AVATAR_REQUEST_SUCCESS:
            return {
                ...state,
                user: payload,
                avatar: {
                    ...state.avatar,
                    error: null,
                    isFetching: false,
                },
            };

        case SET_USER_AVATAR_REQUEST_FAIL:
            return {
                ...state,
                avatar: {
                    ...state.avatar,
                    error: payload,
                    isFetching: false,
                },
            };

        case CHANGE_USER_DATA:
            return {
                ...state,
                user: payload,
            };

        case TOGGLE_MODAL:
            return {
                ...state,
                changePasswordModal: payload,
            };

        case RESET_ALL:
            return {
                ...initialState,
                isInitialFetching: false,
            };

        default:
            return state;
    }
};
