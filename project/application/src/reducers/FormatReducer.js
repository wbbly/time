const initialState = {
    dateFormat: 'YYYY-MM-DD'
};

export function formatReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TASKS_ARR':
            return { ...state, timeEntriesList: action.payload.timeEntriesList };

        default:
            return state;
    }
}
