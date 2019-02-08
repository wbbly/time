export default function manualTimerModalAction(actionType, action) {
    if (actionType == 'TOGGLE_MODAL') {
        return {
            type: 'TOGGLE_MODAL',
            payload: action,
        }
    }
}
