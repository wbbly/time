import { getUserFromLocalStorage, getUserRoleTitleFromLocalStorage } from './userStorageService';

export const ROLES = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_USER: 'ROLE_USER',
};

export function userLoggedIn() {
    const user = getUserFromLocalStorage();

    return !!Object.keys(user).length && user.timezoneOffset;
}

export function checkIsAdminByRole(role) {
    return role === ROLES.ROLE_ADMIN;
}

export function checkIsUserByRole(role) {
    return role === ROLES.ROLE_USER;
}

export function checkIsAdmin() {
    return checkIsAdminByRole(getUserRoleTitleFromLocalStorage());
}
