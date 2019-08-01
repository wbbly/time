const initialState = {
    createUserModal: false,
    editUserModal: false,
    editedUser: {},
};

export function teamPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_ADD_USER_MODAL':
            return { ...state, createUserModal: action.payload.createUserModal };
        case 'TOGGLE_EDIT_USER_MODAL':
            return { ...state, editUserModal: action.payload.editUserModal };
        case 'SET_EDIT_USER':
            return { ...state, editedUser: action.payload.editedUser };
        case 'RESET_ALL':
            return initialState;
        default:
            return state;
    }
}
