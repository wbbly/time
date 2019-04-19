const initialState = {
    programersArr: [],
    createUserModal: false,
    editUserModal: false,
    editedUser: {},
};

export function teamPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_TABLE_DATA':
            return { ...state, programersArr: action.payload.programersArr };
        case 'TOGGLE_ADD_USER_MODAL':
            return { ...state, createUserModal: action.payload.createUserModal };
        case 'TOGGLE_EDIT_USER_MODAL':
            return { ...state, editUserModal: action.payload.editUserModal };
        case 'SET_EDIT_USER':
            return { ...state, editedUser: action.payload.editedUser };
        default:
            return state;
    }
}
