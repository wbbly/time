export default function teamAction(actionType, action) {
    if (actionType === 'SET_CURRENT_TEAM') {
        return {
            type: 'SET_CURRENT_TEAM',
            payload: action,
        };
    }
}
