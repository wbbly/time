import jwtDecode from 'jwt-decode';

import { getTokenFromLocalStorage, removeTokenFromLocalStorage } from './tokenStorageService';

import { store } from '../store/configureStore';
import { resetAll } from '../actions/UserActions';

import { closeSocket } from '../configSocket';

const APP_VERSION = 'v1.0.7';

export const ROLES = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_MEMBER: 'ROLE_MEMBER',
    ROLE_OWNER: 'ROLE_OWNER',
};

export const ROLES_TITLES = {
    [ROLES.ROLE_ADMIN]: 'Admin',
    [ROLES.ROLE_MEMBER]: 'Member',
    [ROLES.ROLE_OWNER]: 'Owner',
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

export function checkIsOwnerByRole(role) {
    return role === ROLES.ROLE_OWNER;
}

export function logoutByUnauthorized() {
    closeSocket();
    removeTokenFromLocalStorage();
    store.dispatch(resetAll());
}
