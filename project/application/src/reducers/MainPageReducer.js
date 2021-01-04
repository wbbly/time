import moment from 'moment';
import {
    SET_CURRENT_TIMER,
    SET_SERVER_CLIENT_TIMEDIFF,
    GET_TIME_ENTRIES_LIST,
    SET_TIMER_TICK,
    INC_PAGINATION,
    GET_TIME_ENTRIES_LIST_PAGINATION,
    DISABLE_PAGINATION,
    RESTORE_PAGINATION,
    START_SEARCH_MODE,
    END_SEARCH_MODE,
} from '../actions/MainPageAction';

const initialState = {
    timeEntriesList: [],
    isFetchingTimeEntriesList: false,
    currentTimer: null,
    timerTick: null,
    serverClientTimediff: 0,
    pagination: {
        page: 1,
        limit: 100,
        disabled: false,
    },
    isSearchMode: false,
    searchValue: '',
    searchDateRange: {
        startDateTime: moment()
            .startOf('month')
            .utc()
            .toISOString(),
        endDateTime: moment()
            .endOf('month')
            .utc()
            .toISOString(),
    },
    isFetchingSearch: false,
};

export function mainPageReducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_TIME_ENTRIES_LIST:
            return { ...state, timeEntriesList: payload, isFetchingSearch: false };
        case 'CHANGE_ARR':
            return { ...state, timeEntriesList: payload.timeEntriesList };
        case SET_CURRENT_TIMER:
            return { ...state, currentTimer: payload };
        case SET_SERVER_CLIENT_TIMEDIFF:
            return { ...state, serverClientTimediff: payload };
        case SET_TIMER_TICK:
            return { ...state, timerTick: payload };
        case INC_PAGINATION:
            return {
                ...state,
                isFetchingTimeEntriesList: true,
                pagination: {
                    ...state.pagination,
                    page: state.pagination.page + 1,
                },
            };
        case RESTORE_PAGINATION:
            return {
                ...state,
                isFetchingTimeEntriesList: false,
                pagination: {
                    ...initialState.pagination,
                },
            };
        case DISABLE_PAGINATION:
            return {
                ...state,
                isFetchingTimeEntriesList: false,
                pagination: {
                    ...state.pagination,
                    disabled: true,
                    page: --state.pagination.page,
                },
            };
        case GET_TIME_ENTRIES_LIST_PAGINATION:
            return {
                ...state,
                isFetchingTimeEntriesList: false,
                timeEntriesList: state.timeEntriesList.concat(payload),
            };
        case START_SEARCH_MODE:
            return {
                ...state,
                pagination: {
                    ...initialState.pagination,
                },
                isSearchMode: true,
                searchValue: payload.searchValue,
                searchDateRange: payload.searchDateRange,
                isFetchingSearch: true,
            };
        case END_SEARCH_MODE:
            return {
                ...state,
                pagination: {
                    ...initialState.pagination,
                },
                isSearchMode: false,
                searchValue: '',
                isFetchingSearch: true,
            };
        case 'RESET_ALL':
            return initialState;
        default:
            return state;
    }
}
