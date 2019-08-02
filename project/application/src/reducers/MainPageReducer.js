import { SET_CURRENT_TIMER, SET_SERVER_CLIENT_TIMEDIFF, RESET_CURRENT_TIMER } from '../actions/MainPageAction';

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
    currentTimer: {
        issue: '',
        project: {
            id: '',
            name: '',
            projectColor: {
                id: '',
                name: '',
            },
        },
        timeStart: 0,
    },
    serverClientTimediff: 0,
};

export function mainPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TASKS_ARR':
            return { ...state, timeEntriesList: action.payload.timeEntriesList };
        case 'CHANGE_ARR':
            return { ...state, timeEntriesList: action.payload.timeEntriesList };
        case 'SET_EDITED_ITEM':
            return { ...state, editedItem: action.payload.editedItem };
        case SET_CURRENT_TIMER:
            return { ...state, currentTimer: action.payload };
        case RESET_CURRENT_TIMER:
            return { ...state, currentTimer: initialState.currentTimer };
        case SET_SERVER_CLIENT_TIMEDIFF:
            return { ...state, serverClientTimediff: action.payload };
        case 'RESET_ALL':
            return initialState;
        default:
            return state;
    }
}
