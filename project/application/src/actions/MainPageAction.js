import moment from 'moment';
import { getTimeEntriesList } from '../configAPI';
import { getTodayTimeEntriesParseFunction } from '../queries';
import { updatePageTitle } from '../services/pageTitleService';
import { getTimeDiff } from '../services/timeService';
import { store } from '../store/configureStore';

export const SET_CURRENT_TIMER = 'SET_CURRENT_TIMER';
export const RESET_CURRENT_TIMER = 'RESET_CURRENT_TIMER';
export const SET_SERVER_CLIENT_TIMEDIFF = 'SET_SERVER_CLIENT_TIMEDIFF';
export const GET_TIME_ENTRIES_LIST = 'GET_TIME_ENTRIES_LIST';
export const SET_TIMER_TICK = 'SET_TIMER_TICK';
export const INC_PAGINATION = 'INC_PAGINATION';
export const GET_TIME_ENTRIES_LIST_PAGINATION = 'GET_TIME_ENTRIES_LIST_PAGINATION';
export const DISABLE_PAGINATION = 'DISABLE_PAGINATION';

const setTimeEntriesListAction = payload => ({
    type: GET_TIME_ENTRIES_LIST,
    payload,
});

export const getTimeEntriesListAction = byPage => async dispatch => {
    const { page, limit, disabled } = store.getState().mainPageReducer.pagination;
    let res = [];

    if (disabled) {
        res = await getTimeEntriesList();
    } else if (page === 1) {
        res = await getTimeEntriesList({ page, limit });
    } else {
        res = await getTimeEntriesList({
            page: 1,
            limit: page * limit,
        });
    }
    const parsedList = getTodayTimeEntriesParseFunction(res.data.data);
    const { timerV2 } = parsedList;
    dispatch(setTimeEntriesListAction(timerV2));
};

export const setCurrentTimerAction = payload => ({
    type: SET_CURRENT_TIMER,
    payload,
});

export const setServerClientTimediffAction = time => ({
    type: SET_SERVER_CLIENT_TIMEDIFF,
    payload: +moment(time) - +moment(),
});

export const setTimerTickAction = key => {
    if (key === 'reset') {
        return {
            type: SET_TIMER_TICK,
            payload: null,
        };
    } else {
        const { mainPageReducer, userReducer } = store.getState();
        const { currentTimer } = mainPageReducer;
        const duration = getTimeDiff(currentTimer.timeStart, true, userReducer.durationTimeFormat);
        updatePageTitle(duration, currentTimer.issue, currentTimer.project.name);
        return {
            type: SET_TIMER_TICK,
            payload: duration,
        };
    }
};

export const incPaginationAction = () => ({
    type: INC_PAGINATION,
});

const setTimeEntriesListPaginationAction = payload => ({
    type: GET_TIME_ENTRIES_LIST_PAGINATION,
    payload,
});

const disablePaginationAction = payload => ({
    type: DISABLE_PAGINATION,
});

export const getTimeEntriesListPaginationAction = () => async dispatch => {
    const { page, limit } = store.getState().mainPageReducer.pagination;

    const res = await getTimeEntriesList({ page, limit });
    if (res.data.data.timer_v2.length) {
        const parsedList = getTodayTimeEntriesParseFunction(res.data.data);
        const { timerV2 } = parsedList;
        dispatch(setTimeEntriesListPaginationAction(timerV2));
    } else {
        dispatch(disablePaginationAction());
    }
};
