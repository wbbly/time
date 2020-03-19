import { addPlan } from "../configAPI";

export const CREATE_MONTH_ARRAY = 'CREATE_MONTH_ARRAY';
export const INCRIMENT_MONTH = 'INCRIMENT_MONTH';
export const DECREMENT_MONTH = 'DECREMENT_MONTH';
export const SET_CURRENT_MONTH = 'SET_CURRENT_MONTH';
export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const CHANGE_USER_OPEN_FLAG = 'CHANGE_USER_OPEN_FLAG';
export const CHANGE_TIME_OFF_FLAG = 'CHANGE_TIME_OFF_FLAG';
export const CHANGE_USER_TIME_OFF = 'CHANGE_USER_TIME_OFF';
export const CHANGE_MAIN_TIME_OFF_SWITCH = 'CHANGE_ALL_TIME_OFF';
export const CHANGE_ALL_USER_TIME_OFF = 'CHANGE_ALL_USER_TIME_OFF';
export const OPEN_DAY_OFF_CHANGE_WINDOW = 'OPEN_DAY_OFF_CHANGE_WINDOW';

export const SWITCH_MONTH = 'SWITCH_MONTH';

export const openDayOffChangeWindow = payload => ({
    type: OPEN_DAY_OFF_CHANGE_WINDOW,
    payload,
});

const incrementMonth = () => ({
    type: INCRIMENT_MONTH,
});

export const nextMonth = () => {
    return async dispatch => {
        dispatch(incrementMonth());
        await dispatch(createMonthArray());
    };
};

const decrementMonth = () => ({
    type: DECREMENT_MONTH,
});

export const prevMonth = () => {
    return async dispatch => {
        dispatch(decrementMonth());
        await dispatch(createMonthArray());
    };
};

const setCurrentMonth = () => ({
    type: SET_CURRENT_MONTH,
});

export const currentMonth = () => {
    return async dispatch => {
        dispatch(setCurrentMonth());
        await dispatch(createMonthArray());
    };
};

export const createMonthArray = () => ({
    type: CREATE_MONTH_ARRAY,
});

export const switch_Month = () => ({
    type: SWITCH_MONTH,
});

export const addUser = payload => ({
    type: ADD_USER,
    payload,
});

export const deleteUser = payload => ({
    type: DELETE_USER,
    payload,
});

export const changeUserOpenFlag = payload => ({
    type: CHANGE_USER_OPEN_FLAG,
    payload,
});

const changeTimeOff = payload => ({
    type: CHANGE_TIME_OFF_FLAG,
    payload,
});

const changeUserTimeOff = payload => ({
    type: CHANGE_USER_TIME_OFF,
    payload,
});

export const changeTimeOffFlag = payload => {
    return async dispatch => {
        dispatch(changeTimeOff(payload));
        await dispatch(changeUserTimeOff(payload));
    };
};

const changeMainTimeOffSwitch = () => ({
    type: CHANGE_MAIN_TIME_OFF_SWITCH,
});

const changeAllUserTimeOff = () => ({
    type: CHANGE_ALL_USER_TIME_OFF,
});

export const changeAllTimeOff = () => {
    return async dispatch => {
        dispatch(changeMainTimeOffSwitch());
        await dispatch(changeAllUserTimeOff());
    };
};

export const addPlanUser = async data => {
    console.log(data)
    try {
        await addPlan(data);

    } catch (error) {
    }
};
