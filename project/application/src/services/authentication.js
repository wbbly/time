import { getLoggedUser, getLoggedUserRoleTitle, removeTokenFromLocalStorage } from './tokenStorageService';
import { removeCurrentTimerFromLocalStorage } from './currentTimerStorageService';
import { removeServerClientTimediffFromLocalStorage } from './serverClientTimediffStorageService';
import { removeAvailableTeamsFromLocalStorage } from './availableTeamsStorageService';
import { removeCurrentTeamDataFromLocalStorage } from './currentTeamDataStorageService';

const APP_VERSION = 'v1.0.5';

export const ROLES = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_MEMBER: 'ROLE_MEMBER',
};

export function userLoggedIn() {
    const user = getLoggedUser();

    return !!Object.keys(user).length && user.appVersion === APP_VERSION; // @TODO: replace with real application version
}

export function checkIsAdminByRole(role) {
    return role === ROLES.ROLE_ADMIN;
}

export function checkIsMemberByRole(role) {
    return role === ROLES.ROLE_MEMBER;
}

export function checkIsAdmin() {
    return checkIsAdminByRole(getLoggedUserRoleTitle());
}

export function logoutByUnauthorized(withRedirect = true) {
    removeTokenFromLocalStorage();
    removeCurrentTimerFromLocalStorage();
    removeServerClientTimediffFromLocalStorage();
    removeAvailableTeamsFromLocalStorage();
    removeCurrentTeamDataFromLocalStorage();

    if (withRedirect) {
        window.location.href = window.location.origin;
    }

    return true;
}
