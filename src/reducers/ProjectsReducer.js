const initialState = {
    tableData: [
        {
            id: 1,
            name: '',
            projectStatus: '',
            created_at: '',
            team: '',
        },
    ],
    addNewProjectModalToggle: false
};

export function projectReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return {...state, addNewProjectModalToggle: action.payload.toggle};
        case 'CREATE_PROJECT':
            return {...state, addNewProjectModalToggle: action.payload.toggle, tableData: action.payload.tableData};
        case 'CHANGE_ARR':
            return {...state, tableData: action.payload.tableData};
        default:
            return state
    }
}
