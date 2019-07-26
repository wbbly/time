import { getCurrentTeamDataFromLocalStorage } from './currentTeamDataStorageService';

export function getLoggedUserRoleTitle() {
    const role = getCurrentTeamDataFromLocalStorage().role;

    return role;
}

export function getTokenFromLocalStorage() {
    const token = localStorage.getItem('token') || '';

    return token;
}

export function setTokenToLocalStorage(token) {
    localStorage.setItem('token', token);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
}
