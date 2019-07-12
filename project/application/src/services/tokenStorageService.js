import * as jwtDecode from 'jwt-decode';

import { getCurrentTeamDataFromLocalStorage } from './currentTeamDataStorageService';

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
    return localStorage.getItem('token') || '';
}

export function setTokenToLocalStorage(token) {
    localStorage.setItem('token', token);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
}
