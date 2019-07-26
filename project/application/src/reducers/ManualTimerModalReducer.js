const initialState = {
    manualTimerModalToggle: false,
};

export function manualTimerModalReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return { ...state, manualTimerModalToggle: action.payload.manualTimerModalToggle };
        case 'RESET_ALL':
            return initialState;
        default:
            return state;
    }
}
