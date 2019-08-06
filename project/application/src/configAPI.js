import axios from 'axios';

import { logoutByUnauthorized } from './services/authentication';

import { AppConfig } from './config';

import { getTokenFromLocalStorage } from './services/tokenStorageService';

const baseURL = AppConfig.apiURL;

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUserData = () =>
    instance({
        url: '/user',
        method: 'GET',
    });

export const getUserTeams = () =>
    instance({
        url: '/user/teams',
        method: 'GET',
    });

export const getCurrentTeam = () =>
    instance({
        url: '/team/current',
        method: 'GET',
    });

export const addTeam = ({ teamName }) =>
    instance({
        url: '/team/add',
        method: 'POST',
        data: {
            teamName,
        },
    });

export const getCurrentTeamDetailedData = () =>
    instance({
        url: '/team/current/detailed-data',
        method: 'GET',
    });

export const switchTeam = ({ teamId }) =>
    instance({
        url: '/team/switch',
        method: 'PATCH',
        data: {
            teamId,
        },
    });

export const setAvatar = (id, data) =>
    instance({
        url: `/user/${id}/avatar`,
        method: 'POST',
        data,
    });

export const deleteAvatar = id =>
    instance({
        url: `/user/${id}/avatar`,
        method: 'DELETE',
    });

// UNUSED AXIOS REQUESTS

export const userInvite = ({ email }) =>
    instance({
        url: '/user/invite',
        method: 'POST',
        data: {
            email,
        },
    });

export const userChangePassword = ({ password, newPassword }) =>
    instance({
        url: '/user/change-password',
        method: 'POST',
        data: {
            password,
            newPassword,
        },
    });

export const addProject = ({ name, projectColorId }) =>
    instance({
        url: '/project/add',
        method: 'POST',
        data: {
            project: {
                name,
                projectColorId,
            },
        },
    });

export const getProjectColorList = () =>
    instance({
        url: '/project-color/list',
        method: 'GET',
    });

export const changeProject = ({ id, name, projectColorId }) =>
    instance({
        url: `/project/${id}`,
        method: 'PATCH',
        data: {
            project: {
                name,
                projectColorId,
            },
        },
    });

export const changeUserInTeam = ({ id, email, username, isActive, roleName }) =>
    instance({
        url: `/user/${id}/team`,
        method: 'PATCH',
        data: {
            email,
            username,
            isActive,
            roleName,
        },
    });

export const syncTaskWithJira = ({ id }) =>
    instance({
        url: `/sync/jira/issue/${id}/worklog`,
        method: 'POST',
    });

export const changeTask = (
    { id, issue, projectId, startDatetime, endDatetime } // TODO: set deffault value for key
) =>
    instance({
        url: `/timer/${id}`,
        method: 'PATCH',
        data: {
            issue,
            projectId,
            startDatetime,
            endDatetime,
        },
    });

export const getTimerUserList = () =>
    instance({
        url: '/timer/user-list',
        method: 'GET',
    });

export const renameTeam = ({ teamId, newName }) =>
    instance({
        url: '/team/rename',
        method: 'PATCH',
        data: {
            teamId,
            newName,
        },
    });

export const getProjectList = (withTimerList = false) =>
    instance({
        url: '/project/list',
        method: 'GET',
        params: {
            withTimerList,
        },
    });

export const signIn = ({ email, password }) =>
    instance({
        url: '/user/login',
        method: 'POST',
        data: {
            email,
            password,
        },
    });

export const getCurrentTime = () =>
    instance({
        url: '/time/current',
        method: 'GET',
    });

export const deleteTask = ({ id }) =>
    instance({
        url: `/timer/${id}`,
        method: 'DELETE',
    });

export const signUp = ({ email, password, language }) =>
    instance({
        url: '/user/register',
        method: 'POST',
        data: {
            email,
            password,
            language,
        },
    });

export const getProjectReports = ({ projectName, startDate, endDate }) =>
    instance({
        url: '/project/reports-project',
        method: 'GET',
        params: {
            projectName,
            startDate,
            endDate,
        },
    });

export const getExportReport = ({ timezoneOffset, startDate, endDate }) =>
    instance({
        url: '/report/export',
        method: 'GET',
        params: {
            timezoneOffset,
            startDate,
            endDate,
        },
    });

export const getReportsProjects = ({ startDate, endDate }) =>
    instance({
        url: '/project/reports-projects',
        method: 'GET',
        params: {
            startDate,
            endDate,
        },
    });

export const getTimerReportsList = ({ startDate, endDate }) =>
    instance({
        url: '/timer/reports-list',
        method: 'GET',
        params: {
            startDate,
            endDate,
        },
    });

export const getUserList = () =>
    instance({
        url: '/timer/reports-list',
        method: 'GET',
    });

export const changeUserData = ({ id, email, username, language, tokenJira }) =>
    instance({
        url: `user/${id}`,
        method: 'PATCH',
        data: {
            email,
            username,
            language,
            tokenJira,
        },
    });

export const verifyJiraToken = ({ token }) =>
    instance({
        url: 'sync/jira/my-permissions',
        method: 'GET',
        params: {
            token,
        },
    });

// TODO: create functions of open, close and emit socket connection

// Add a request interceptor
instance.interceptors.request.use(
    config => {
        const token = getTokenFromLocalStorage();
        if (token) {
            return {
                ...config,
                headers: { ...config.headers, Authorization: `Bearer ${token}` },
            };
        }

        return config;
    },
    error => Promise.reject(error)
);

// Add a response interceptor
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.data.statusCode === 401) {
            logoutByUnauthorized();
        }
        return Promise.reject(error);
    }
);
