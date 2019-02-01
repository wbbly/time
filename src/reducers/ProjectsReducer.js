const initialState = {
    tableData: [
        {
            id: 1,
            projectName: 'test',
            projectStatus: '21',
            team: 'Hr',
        },
        {
            id: 2,
            projectName: 'test',
            projectStatus: '21',
            team: 'Hr',
        },
    ],
    addNewProjectModalToggle: false
};

export function projectReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return {...state, addNewProjectModalToggle: action.payload};
        default:
            return state
    }
}
