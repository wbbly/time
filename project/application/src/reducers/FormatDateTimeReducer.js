const initialState = {
    dateFormat: localStorage.getItem('date_format') || 'DD.MM.YYYY',
    timeFormat: localStorage.getItem('time_format') || 'decimal',
    timeHoursFormat: localStorage.getItem('time_hours_format') || '12h',
    startOfWeek: localStorage.getItem('start_week') || 'mun'
};

export function formatDateTimeReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}
