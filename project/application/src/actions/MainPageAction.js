export const SET_CURRENT_TIMER = 'SET_CURRENT_TIMER';
export const RESET_CURRENT_TIMER = 'RESET_CURRENT_TIMER';
export const SET_SERVER_CLIENT_TIMEDIFF = 'SET_SERVER_CLIENT_TIMEDIFF';

export default function addTasks(actionType, action) {
    if (actionType === 'ADD_TASKS_ARR') {
        return {
            type: 'ADD_TASKS_ARR',
            payload: action,
        };
    } else if (actionType === 'SET_EDITED_ITEM') {
        return {
            type: 'SET_EDITED_ITEM',
            payload: action,
        };
    }
}

export const setCurrentTimerAction = payload => ({
    type: SET_CURRENT_TIMER,
    payload,
});

export const resetCurrentTimerAction = () => ({
    type: RESET_CURRENT_TIMER,
});

export const setServerClientTimediffAction = payload => ({
    type: SET_SERVER_CLIENT_TIMEDIFF,
    payload,
});
