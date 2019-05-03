const initialState = {
    mainTaskField: {
        classToggle: true,
        time: '',
        date: '',
        timeEntriesList: [],
    },
    timeEntriesList: [],
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
            return { ...state, timeEntriesList: action.payload.timeEntriesList };
        case 'CHANGE_ARR':
            return { ...state, timeEntriesList: action.payload.timeEntriesList };
        case 'SET_EDITED_ITEM':
            return { ...state, editedItem: action.payload.editedItem };
        default:
            return state;
    }
}
