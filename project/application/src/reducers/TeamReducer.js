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
        default:
            return state;
    }
}
