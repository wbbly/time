export default function addTasks(actionType, action) {
    if (actionType === 'ADD_TASKS_ARR') {
        return {
            type: 'ADD_TASKS_ARR',
            payload: action,
        };
    } else if (actionType === 'SET_EDITED_ITEM') {
        return {
            type: 'SET_EDITED_ITEM',
            payload: action,
        };
    }
}
