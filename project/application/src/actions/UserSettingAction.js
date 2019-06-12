export default function userSettingAction(actionType, action) {
    if (actionType === 'TOGGLE_MODAL') {
        return {
            type: 'TOGGLE_MODAL',
            payload: action,
        };
    } else if (actionType === 'CHANGE_EMAIL') {
        return {
            type: 'CHANGE_EMAIL',
            payload: action,
        };
    } else if (actionType === 'CHANGE_NAME') {
        return {
            type: 'CHANGE_NAME',
            payload: action,
        };
    }
}
