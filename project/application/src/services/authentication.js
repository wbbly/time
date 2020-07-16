import jwtDecode from 'jwt-decode';

import { getTokenFromLocalStorage, removeTokenFromLocalStorage } from './tokenStorageService';

import { store } from '../store/configureStore';
import { resetAll } from '../actions/UserActions';

import { closeSocket } from '../configSocket';
import { func } from 'prop-types';

const APP_VERSION = 'v1.0.7';

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

export function logoutByUnauthorized() {
    closeSocket();
    removeTokenFromLocalStorage();
    store.dispatch(resetAll());
}
