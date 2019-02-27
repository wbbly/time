const initialState = {
    programersArr: [],
    createUserModal: false,
};

export function teamPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_TABLE_DATA':
            return { ...state, programersArr: action.payload.programersArr };
        case 'TOGGLE_ADD_USER_MODAL':
            return { ...state, createUserModal: action.payload.createUserModal };
        default:
            return state;
    }
}
