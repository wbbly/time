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
};

export function projectReducer(state = initialState, action) {
    switch (action.type) {
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
        default:
            return state;
    }
}
