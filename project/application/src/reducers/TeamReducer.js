const initialState = {
    currentTeam: {
        id: '',
        name: '',
    },
};

export function teamReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CURRENT_TEAM':
            console.log('HERE!');
            return { ...state, currentTeam: action.payload };
        default:
            return state;
    }
}
