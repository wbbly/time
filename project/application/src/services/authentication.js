import { getLoggedUser, getLoggedUserRoleTitle } from './tokenStorageService';

const APP_VERSION = 'v0.0.1';

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
