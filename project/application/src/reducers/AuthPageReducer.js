const initialState = {
    registerModal: false,
    forgotPasswordModal: false,
};

export function authPageReducer(state = initialState, action) {
    console.log(action);
    switch (action.type) {
        case 'TOGGLE_REGISTER_MODAL':
            return { ...state, registerModal: action.payload.registerModal };
        case 'TOGGLE_FORGOT_PASSWORD_MODAL':
            return { ...state, forgotPasswordModal: action.payload.forgotPasswordModal };
        default:
            return state;
    }
}
