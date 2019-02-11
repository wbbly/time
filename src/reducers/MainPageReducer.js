const initialState = {
    mainTaskField: {
        classToggle: true,
        intervalId: '',
        time: '',
        date: '',
        arrTasks: [],
    },
    arrTasks: [],
};

export function mainPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TASKS_ARR':
            return { ...state, arrTasks: action.payload.arrTasks };
        default:
            return state;
    }
}
