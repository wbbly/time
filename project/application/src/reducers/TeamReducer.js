const initialState = {
    currentTeam: {
        id: '',
        name: '',
    },
};

export function teamReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CURRENT_TEAM':
            return { ...state, currentTeam: action.payload };
        case 'RESET_ALL':
            return initialState;
        default:
            return state;
    }
}
