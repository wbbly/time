export const CREATE_MONTH_ARRAY = 'CREATE_MONTH_ARRAY';
export const INCRIMENT_MONTH = 'INCRIMENT_MONTH';
export const DECREMENT_MONTH = 'DECREMENT_MONTH';
export const SET_CURRENT_MONTH = 'SET_CURRENT_MONTH';
export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const CHANGE_USER_OPEN_FLAG = 'CHANGE_USER_OPEN_FLAG';

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
