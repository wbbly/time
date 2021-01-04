// Types
import {
    GET_USER_DATA_REQUEST,
    GET_USER_DATA_REQUEST_SUCCESS,
    GET_USER_DATA_REQUEST_FAIL,
    SET_USER_AVATAR_REQUEST,
    SET_USER_AVATAR_REQUEST_SUCCESS,
    SET_USER_AVATAR_REQUEST_FAIL,
    RESET_ALL,
    RESET_INITIAL_FETCHING,
    CHANGE_USER_DATA,
    TOGGLE_MODAL,
    SET_DATE_FORMAT,
    SET_TIME_FORMAT,
    SET_FIRST_DAY_OF_WEEK,
    SET_DURATION_TIME_FORMAT,
} from '../actions/UserActions';

const initialDateFormat = 'DD.MM.YYYY';
const dateFormat = localStorage.getItem('dateFormat') || initialDateFormat;

const initialTimeFormat = '24';
const timeFormat = localStorage.getItem('timeFormat') || initialTimeFormat;

const initialFirstDayOfWeek = 1;
const firstDayOfWeek = localStorage.getItem('firstDayOfWeek') || initialFirstDayOfWeek;

const initialDurationTimeFormat = 'improved';
const durationTimeFormat = localStorage.getItem('durationTimeFormat') || initialDurationTimeFormat;

const initialState = {
    changePasswordModal: false,
    user: null,
    error: null,
    avatar: {
        isFetching: false,
        error: null,
    },
    dateFormat,
    timeFormat,
    firstDayOfWeek,
    durationTimeFormat,
    isFetching: false,
    isInitialFetching: true,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_DURATION_TIME_FORMAT:
            return {
                ...state,
                durationTimeFormat: payload,
            };

        case SET_FIRST_DAY_OF_WEEK:
            return {
                ...state,
                firstDayOfWeek: payload,
            };

        case SET_TIME_FORMAT:
            return {
                ...state,
                timeFormat: payload,
            };

        case SET_DATE_FORMAT:
            return {
                ...state,
                dateFormat: payload,
            };

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

        case RESET_INITIAL_FETCHING:
            return {
                ...state,
                isInitialFetching: true,
            };

        default:
            return state;
    }
};
