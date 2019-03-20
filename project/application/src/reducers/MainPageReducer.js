const initialState = {
    mainTaskField: {
        classToggle: true,
        intervalId: '',
        time: '',
        date: '',
        arrTasks: [],
    },
    arrTasks: [],
    editedItem: {
        date: '',
        id: null,
        name: '',
        project: '',
        timeFrom: '',
        timePassed: '',
        timeTo: '',
    },
};

export function mainPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TASKS_ARR':
            return { ...state, arrTasks: action.payload.arrTasks };
        case 'CHANGE_ARR':
            return { ...state, arrTasks: action.payload.arrTasks };
        case 'SET_EDITED_ITEM':
            return { ...state, editedItem: action.payload.editedItem };
        default:
            return state;
    }
}
