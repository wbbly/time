export default function toggleRegisterModal(actionType, action) {
    if (actionType === 'TOGGLE_REGISTER_MODAL') {
        return {
            type: 'TOGGLE_REGISTER_MODAL',
            payload: action,
        };
    } else if (actionType === 'TOGGLE_FORGOT_PASSWORD_MODAL') {
        return {
            type: 'TOGGLE_FORGOT_PASSWORD_MODAL',
            payload: action,
        };
    }
}
