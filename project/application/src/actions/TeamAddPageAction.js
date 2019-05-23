export default function teamAddPageAction(actionType, action) {
    if (actionType === 'TOGGLE_TEAM_ADD_MODAL') {
        return {
            type: 'TOGGLE_TEAM_ADD_MODAL',
            payload: action,
        };
    } else {
        return {
            type: 'TOGGLE_TEAM_ADD_MODAL',
            payload: action,
        };
    }
}
