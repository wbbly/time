export default function reportsPageAction(actionType, action) {
    if (actionType === 'SET_LINE_GRAPH') {
        return {
            type: 'SET_LINE_GRAPH',
            payload: action,
        };
    } else if (actionType === 'SET_DOUGHNUT_GRAPH') {
        return {
            type: 'SET_DOUGHNUT_GRAPH',
            payload: action,
        };
    } else if (actionType === 'SET_DATA_FROM_SERVER') {
        return {
            type: 'SET_DATA_FROM_SERVER',
            payload: action,
        };
    } else if (actionType === 'SET_PROJECTS') {
        return {
            type: 'SET_PROJECTS',
            payload: action,
        };
    } else if (actionType === 'SET_TIME') {
        return {
            type: 'SET_TIME',
            payload: action,
        };
    } else if (actionType === 'SET_ACTIVE_USER') {
        return {
            type: 'SET_ACTIVE_USER',
            payload: action,
        };
    }
}
