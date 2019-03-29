export default function toggleRegisterModal(actionType, action) {
    if (actionType === 'TOGGLE_REGISTER_MODAL') {
        return {
            type: 'TOGGLE_REGISTER_MODAL',
            payload: action,
        };
    }
}