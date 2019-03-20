export default function teamPageAction(actionType, action) {
    if (actionType === 'SET_TABLE_DATA') {
        return {
            type: 'SET_TABLE_DATA',
            payload: action,
        };
    } else if (actionType === 'TOGGLE_ADD_USER_MODAL') {
        return {
            type: 'TOGGLE_ADD_USER_MODAL',
            payload: action,
        };
    }
}
