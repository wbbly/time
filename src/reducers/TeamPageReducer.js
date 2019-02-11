const initialState = {
    programersArr: [
        {
            id: 1,
            name: 'Alexey',
            email: 'alexeysergeev@gmail.com',
            access: 'Admin',
        },
        {
            id: 2,
            name: 'Alexey',
            email: 'alexeysergeev@gmail.com',
            access: 'Admin',
        },
        {
            id: 3,
            name: 'Alexey',
            email: 'alexeysergeev@gmail.com',
            access: 'Admin',
        },
    ],
};

export function teamPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TASKS_ARR':
            return { ...state, arrTasks: action.payload.arrTasks };
        default:
            return state;
    }
}
