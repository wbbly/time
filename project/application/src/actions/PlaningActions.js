export const CREATE_MONTH_ARRAY = 'CREATE_MONTH_ARRAY';
export const INCRIMENT_MONTH = 'INCRIMENT_MONTH';
export const DECREMENT_MONTH = 'DECREMENT_MONTH';
export const SET_CURRENT_MONTH = 'SET_CURRENT_MONTH';

const incrementMonth = () => ({
    type: INCRIMENT_MONTH,
});

const decrementMonth = () => ({
    type: DECREMENT_MONTH,
});

const setCurrentMonth = () => ({
    type: SET_CURRENT_MONTH,
});

export const createMonthArray = () => ({
    type: CREATE_MONTH_ARRAY,
});

export const nextMonth = () => {
    return async dispatch => {
        dispatch(incrementMonth());
        await dispatch(createMonthArray());
    };
};

export const prevMonth = () => {
    return async dispatch => {
        dispatch(decrementMonth());
        await dispatch(createMonthArray());
    };
};

export const currentMonth = () => {
    return async dispatch => {
        dispatch(setCurrentMonth());
        await dispatch(createMonthArray());
    };
};
