import { getCurrentTeamDataFromLocalStorage } from './teamStorageService';

export function getUserIdFromLocalStorage() {
    const id = getUserFromLocalStorage().id;

    return id;
}

export function getUserEmailFromLocalStorage() {
    const email = getUserFromLocalStorage().email || '';

    return email;
}

export function getUserRoleTitleFromLocalStorage() {
    const role = getCurrentTeamDataFromLocalStorage().role || '';

    return role;
}

export function getUserTimezoneOffsetFromLocalStorage() {
    const timezoneOffset = getUserFromLocalStorage().timezoneOffset || 0;

    return timezoneOffset;
}

export function getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem('user-object')) || {};
}

export function setUserToLocalStorage(user) {
    localStorage.setItem('user-object', JSON.stringify(user));
}

export function removeUserFromLocalStorage() {
    localStorage.removeItem('user-object');
}
