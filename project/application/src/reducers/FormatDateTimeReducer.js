const initialState = {
    dateFormat: localStorage.getItem('date_format') || 'DD.MM.YYYY',
    timeFormat: localStorage.getItem('time_format') || 'decimal',
};

export function formatDateTimeReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}
