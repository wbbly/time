import { getProjectsList } from '../configAPI';

export const SET_PROJECTS_LIST = 'SET_PROJECTS_LIST';

export default function projectsPageAction(actionType, action) {
    if (actionType === 'CREATE_PROJECT') {
        return {
            type: 'CREATE_PROJECT',
            payload: action,
        };
    } else if (actionType === 'TOGGLE_MODAL') {
        return {
            type: 'TOGGLE_MODAL',
            payload: action,
        };
    } else if (actionType === 'CHANGE_ARR') {
        return {
            type: 'CHANGE_ARR',
            payload: action,
        };
    } else if (actionType === 'SET_EDIT_PROJECT') {
        return {
            type: 'SET_EDIT_PROJECT',
            payload: action,
        };
    } else if (actionType === 'TOGGLE_EDIT_PROJECT_MODAL') {
        return {
            type: 'TOGGLE_EDIT_PROJECT_MODAL',
            payload: action,
        };
    } else {
        return {
            type: 'TOGGLE_MODAL',
            payload: action,
        };
    }
}

const setProjectsListAction = payload => ({
    type: SET_PROJECTS_LIST,
    payload,
});

export const getProjectsListActions = (withTimerList = false) => async dispatch => {
    try {
        const { data } = await getProjectsList(withTimerList);

        const formattedList = data.data.project_v2.map(project => {
            const { is_active: isActive, project_color: projectColor, ...rest } = project;
            let { timer } = project;
            if (timer) {
                timer = timer.map(item => {
                    const { start_datetime: startDatetime, end_datetime: endDatetime } = item;
                    return {
                        startDatetime,
                        endDatetime,
                    };
                });

                return {
                    ...rest,
                    isActive,
                    projectColor,
                    timer,
                };
            } else {
                return {
                    ...rest,
                    isActive,
                    projectColor,
                };
            }
        });

        dispatch(setProjectsListAction(formattedList));
    } catch {
        dispatch(setProjectsListAction([]));
    }
};
