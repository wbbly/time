import jwtDecode from 'jwt-decode';

import { getLoggedUserRoleTitle, getTokenFromLocalStorage, removeTokenFromLocalStorage } from './tokenStorageService';
import { removeCurrentTimerFromLocalStorage } from './currentTimerStorageService';
import { removeServerClientTimediffFromLocalStorage } from './serverClientTimediffStorageService';
import { removeAvailableTeamsFromLocalStorage } from './availableTeamsStorageService';
import { removeCurrentTeamDataFromLocalStorage } from './currentTeamDataStorageService';

import { store } from '../store/configureStore';
import { resetAll } from '../actions/UserActions';

const APP_VERSION = 'v1.0.5';

export const ROLES = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_MEMBER: 'ROLE_MEMBER',
};

export const checkAppVersion = () => {
    const token = getTokenFromLocalStorage();

    try {
        const { appVersion } = jwtDecode(token);

        return APP_VERSION === appVersion;
    } catch (error) {
        return false;
    }
};

export function checkIsAdminByRole(role) {
    return role === ROLES.ROLE_ADMIN;
}

export function checkIsMemberByRole(role) {
    return role === ROLES.ROLE_MEMBER;
}

export function checkIsAdmin() {
    return checkIsAdminByRole(getLoggedUserRoleTitle());
}

export function logoutByUnauthorized() {
    removeTokenFromLocalStorage();
    removeCurrentTimerFromLocalStorage();
    removeServerClientTimediffFromLocalStorage();
    removeAvailableTeamsFromLocalStorage();
    removeCurrentTeamDataFromLocalStorage();
    store.dispatch(resetAll());
}
