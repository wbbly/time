import {
    deleteUserFromProject,
    getProjectsList,
    getRelationProjectsList,
    changeProjectActiveStatus,
} from '../configAPI';

import { clientsMethods } from './ClientsActions';

import { getProjectListParseFunction } from '../queries';

export const SET_PROJECTS_LIST = 'SET_PROJECTS_LIST';
export const SET_RELATION_PROJECTS_LIST = 'SET_RELATION_PROJECTS_LIST';
export const DELETE_USER_FROM_PROJECT_REQUEST = 'DELETE_USER_FROM_PROJECT_REQUEST';
export const DELETE_USER_FROM_PROJECT_SUCCESS = 'DELETE_USER_FROM_PROJECT_SUCCESS';
export const DELETE_USER_FROM_PROJECT_ERROR = 'DELETE_USER_FROM_PROJECT_ERROR';
export const INCREMENT_PAGINATION = 'INCREMENT_PAGINATION';
export const GET_PROJECTS_LIST = 'GET_PROJECTS_LIST';
export const CHANGE_PROJECTS_SEARCH_VALUE = 'CHANGE_PROJECTS_SEARCH_VALUE';
export const SET_PROJECTS_PAGE = 'SET_PROJECTS_PAGE';
export const CHANGE_PROJECTS_FILTER_STATUS = 'CHANGE_PROJECTS_FILTER_STATUS';
export const SET_PROJECTS_LIST_ENDED = 'SET_PROJECTS_LIST_ENDED';

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
    } else if (actionType === 'RESET_PROJECTS_PAGE') {
        return {
            type: 'RESET_PROJECTS_PAGE',
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

const getProjectsListRequest = () => ({
    type: GET_PROJECTS_LIST,
});

const setRelationProjectsListAction = payload => ({
    type: SET_RELATION_PROJECTS_LIST,
    payload,
});

const deleteUserFromProjectRequest = () => ({
    type: DELETE_USER_FROM_PROJECT_REQUEST,
});

const deleteUserFromProjectSuccess = () => ({
    type: DELETE_USER_FROM_PROJECT_SUCCESS,
});

const deleteUserFromProjectError = payload => ({
    type: DELETE_USER_FROM_PROJECT_ERROR,
    payload,
});

const setProjectsPage = payload => ({
    type: SET_PROJECTS_PAGE,
    payload,
});

const setProjectsListEnded = payload => ({
    type: SET_PROJECTS_LIST_ENDED,
    payload,
});

export const changeProjectsSearchValue = payload => ({
    type: CHANGE_PROJECTS_SEARCH_VALUE,
    payload,
});

export const changeProjectsFilterStatus = payload => ({
    type: CHANGE_PROJECTS_FILTER_STATUS,
    payload,
});

export const resetProjectsParamsAction = () => dispatch => {
    dispatch(changeProjectsSearchValue(''));
    dispatch(changeProjectsFilterStatus('all'));
    dispatch(setProjectsPage(1));
    dispatch(setProjectsListEnded(false));
};

export const getProjectsListActions = ({
    withTimerList = true,
    withUserInfo = true,
    withPagination = false,
    filterStatus,
    searchValue,
    page,
} = {}) => async (dispatch, getState) => {
    dispatch(setProjectsPage(clientsMethods.checkOnValue(page, getState().projectReducer.pagination.page)));

    dispatch(
        changeProjectsFilterStatus(clientsMethods.checkOnValue(filterStatus, getState().projectReducer.filterStatus))
    );

    dispatch(
        changeProjectsSearchValue(clientsMethods.checkSearchValue(searchValue, getState().projectReducer.searchValue))
    );

    dispatch(getProjectsListRequest());

    try {
        const {
            projectReducer: { pagination, projectsList, searchValue },
        } = getState();

        const { data } = await getProjectsList({
            withTimerList,
            withUserInfo,
            page: withPagination ? (page ? page : pagination.page) : null,
            limit: withPagination ? pagination.limit : null,
            isActive: clientsMethods.statusValueToBool(
                clientsMethods.checkOnValue(filterStatus, getState().projectReducer.filterStatus)
            ),
            searchValue: clientsMethods.checkSearchValue(searchValue, getState().projectReducer.searchValue),
        });

        const formattedList = getProjectListParseFunction(data.data.project_v2);

        dispatch(
            setProjectsListAction(
                withPagination && page !== 1 && projectsList ? [...projectsList, ...formattedList] : formattedList
            )
        );

        if (withPagination && formattedList.length < pagination.limit) {
            dispatch(setProjectsListEnded(true));
        } else {
            dispatch(setProjectsListEnded(false));
        }
    } catch (error) {
        console.log(error);
        dispatch(setProjectsListAction([]));
    }
};

export const getRelationProjectsListAction = (syncType = 'jira') => async dispatch => {
    try {
        const { data } = await getRelationProjectsList(syncType);
        dispatch(setRelationProjectsListAction(data));
    } catch (error) {
        dispatch(setRelationProjectsListAction([]));
    }
};

export const deleteUserFromProjectAction = (userId, projectId) => async dispatch => {
    dispatch(deleteUserFromProjectRequest());
    try {
        await deleteUserFromProject(userId, projectId);
        dispatch(deleteUserFromProjectSuccess());
    } catch (error) {
        console.log(error);
        dispatch(deleteUserFromProjectError(error));
    }
};

export const changeProjectActiveStatusAction = (projectId, status) => async dispatch => {
    try {
        await changeProjectActiveStatus(projectId, status);
    } catch (error) {
        console.log(error);
    }
};
