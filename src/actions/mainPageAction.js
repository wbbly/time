export default function addTasks(actionType, action) {
    if (actionType == 'ADD_TASKS_ARR') {
        return {
            type: 'ADD_TASKS_ARR',
            payload: action,
        }
    }
}