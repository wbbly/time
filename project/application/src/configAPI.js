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

export const setSocialConnect = (userId, { socialId, socialName }) =>
    instance({
        url: `user/${userId}/set-social/${socialName}`,
        method: 'POST',
        data: {
            socialId,
        },
    });

export const loginWithFacebook = ({ email = '', id, name: username, language }) =>
    instance({
        url: '/user/login-fb',
        method: 'POST',
        data: {
            email,
            id,
            username,
            language,
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

export const tutorialChecked = (id, key) =>
    instance({
        url: `user/${id}`,
        method: 'PATCH',
        data: {
            onboardingMobile: key,
        },
    });
export const getClientsList = () =>
    instance({
        url: '/client/list',
        method: 'GET',
    });

export const setClient = client =>
    instance({
        url: '/client/add',
        method: 'POST',
        data: {
            name: client,
        },
    });
export const editClient = (data, id) =>
    instance({
        url: `client/${id}`,
        method: 'PATCH',
        data: {
            name: data,
        },
    });

export const deleteTask = id =>
    instance({
        url: `/timer/${id}`,
        method: 'DELETE',
    });

export const getTimeEntriesList = (params = {}) =>
    instance({
        url: '/timer/user-list',
        method: 'GET',
        params,
    });

export const getCurrentTime = () =>
    instance({
        url: '/time/current',
        method: 'GET',
    });

export const getProjectsList = (withTimerList = false) =>
    instance({
        url: '/project/list',
        method: 'GET',
        params: {
            withTimerList,
        },
    });

// keys for data: issue, projectId, startDatetime, endDatetime
export const changeTask = (id, data) =>
    instance({
        url: `/timer/${id}`,
        method: 'PATCH',
        data,
    });

export const syncTaskWithJira = id =>
    instance({
        url: `/sync/jira/issue/${id}/worklog`,
        method: 'POST',
    });

export const userInvite = ({ email }) =>
    instance({
        url: '/user/invite',
        method: 'POST',
        data: {
            email,
        },
    });

// UNUSED AXIOS REQUESTS

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

export const renameTeam = ({ teamId, newName }) =>
    instance({
        url: '/team/rename',
        method: 'PATCH',
        data: {
            teamId,
            newName,
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

export const requestChangeUserData = (data, id) =>
    instance({
        url: `user/${id}`,
        method: 'PATCH',
        data,
    });

export const verifyJiraToken = ({ token, urlJira }) =>
    instance({
        url: 'sync/jira/my-permissions',
        method: 'GET',
        params: {
            token,
            urlJira,
        },
    });

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

export const resetPassword = email =>
    instance({
        url: '/user/reset-password',
        method: 'POST',
        data: {
            email,
        },
    });

export const setPassword = ({ password, token }) =>
    instance({
        url: '/user/set-password',
        method: 'POST',
        data: {
            password,
            token,
        },
    });

export const addPlan = data =>
    instance({
        url: '/timer-planning/add',
        method: 'POST',
        data,
    });
