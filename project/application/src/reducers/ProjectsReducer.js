import {
    SET_PROJECTS_LIST,
    SET_RELATION_PROJECTS_LIST,
    SET_PROJECTS_PAGE,
    GET_PROJECTS_LIST,
    CHANGE_PROJECTS_SEARCH_VALUE,
    CHANGE_PROJECTS_FILTER_STATUS,
    SET_PROJECTS_LIST_ENDED,
} from '../actions/ProjectsActions';

const initialState = {
    tableData: [
        {
            id: 1,
            name: '',
            projectStatus: '',
            isActive: true,
            created_at: '',
            team: '',
            colorProject: '',
        },
    ],
    addNewProjectModalToggle: false,
    editedProject: '',
    editProjectModal: false,
    projectsList: null,
    relationProjectsList: [],
    isInitialFetching: true,
    isFetching: false,
    pagination: {
        page: 1,
        limit: 10,
        isListEnded: false,
        listFetching: false,
    },
    searchValue: '',
    filterStatus: 'all',
};

export function projectReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PROJECTS_LIST:
            return { ...state, pagination: { ...state.pagination, listFetching: true } };
        case SET_PROJECTS_LIST:
            return {
                ...state,
                projectsList: action.payload,
                isInitialFetching: false,
                pagination: {
                    ...state.pagination,
                    listFetching: false,
                },
            };
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
        case SET_PROJECTS_PAGE:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.payload,
                },
            };
        case SET_PROJECTS_LIST_ENDED:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    isListEnded: action.payload,
                },
            };
        case CHANGE_PROJECTS_SEARCH_VALUE:
            return {
                ...state,
                searchValue: action.payload,
            };
        case CHANGE_PROJECTS_FILTER_STATUS:
            return {
                ...state,
                filterStatus: action.payload,
            };
        case 'RESET_ALL':
            return initialState;
        case 'RESET_PROJECTS_PAGE':
            return initialState;
        default:
            return state;
    }
}
