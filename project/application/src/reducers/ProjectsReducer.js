import { SET_PROJECTS_LIST, SET_RELATION_PROJECTS_LIST } from '../actions/ProjectsActions';

const initialState = {
    tableData: [
        {
            id: 1,
            name: '',
            projectStatus: '',
            created_at: '',
            team: '',
            colorProject: '',
        },
    ],
    addNewProjectModalToggle: false,
    editedProject: '',
    editProjectModal: false,
    projectsList: [],
    relationProjectsList: [],
};

export function projectReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PROJECTS_LIST:
            return { ...state, projectsList: action.payload };
        case SET_RELATION_PROJECTS_LIST:
            return { ...state, relationProjectsList: action.payload };
        case 'TOGGLE_MODAL':
            return { ...state, addNewProjectModalToggle: action.payload.toggle };
        case 'CREATE_PROJECT':
            return { ...state, tableData: action.payload.tableData };
        case 'CHANGE_ARR':
            return { ...state, tableData: action.payload.tableData };
        case 'SET_EDIT_PROJECT':
            return { ...state, editedProject: action.payload.tableData };
        case 'TOGGLE_EDIT_PROJECT_MODAL':
            return { ...state, editProjectModal: action.payload.tableData };
        case 'RESET_ALL':
            return initialState;
        default:
            return state;
    }
}
