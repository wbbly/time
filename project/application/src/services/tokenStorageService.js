import * as jwtDecode from 'jwt-decode';

import { getCurrentTeamDataFromLocalStorage } from './currentTeamDataStorageService';
import { AppConfig } from '../config';

export function getLoggedUserEmail() {
    const email = getLoggedUser().email || '';

    return email;
}

export function getLoggedUserRoleTitle() {
    const role = getCurrentTeamDataFromLocalStorage().role || '';

    return role;
}

export function getLoggedUserTimezoneOffset() {
    const timezoneOffset = getLoggedUser().timezoneOffset || 0;

    return timezoneOffset;
}

export function getLoggedUserName() {
    const username = getLoggedUser().username || '';

    return username;
}

export function getLoggedUserId() {
    const userId = getLoggedUser().id || '';

    return userId;
}

export function getLoggedUserLanguage() {
    const userLanguage = getLoggedUser().language || '';

    return userLanguage;
}

export function getLoggedUser() {
    let user;
    try {
        user = jwtDecode(getTokenFromLocalStorage());
    } catch (e) {
        // console.log(e);
    }

    return user || {};
}

export function getTokenFromLocalStorage() {
    const token = localStorage.getItem('token') || '';
    if (!token) {
        const message = `Action: getTokenFromLocalStorage, token: ${localStorage.getItem('token')}`;
        fetch(AppConfig.apiURL + 'email/send-alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
            }),
        });
    }

    return token;
}

export function setTokenToLocalStorage(token) {
    if (!token) {
        const message = `Action: setTokenToLocalStorage, token: ${token}`;
        fetch(AppConfig.apiURL + 'email/send-alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
            }),
        });
    }

    localStorage.setItem('token', token);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
}
