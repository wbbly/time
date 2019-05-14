import { getUserFromLocalStorage, getUserRoleTitleFromLocalStorage } from './userStorageService';

export const ROLES = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_MEMBER: 'ROLE_MEMBER',
};

export function userLoggedIn() {
    const user = getUserFromLocalStorage();

    return !!Object.keys(user).length && user.timezoneOffset;
}

export function checkIsAdminByRole(role) {
    return role === ROLES.ROLE_ADMIN;
}

export function checkIsMemberByRole(role) {
    return role === ROLES.ROLE_MEMBER;
}

export function checkIsAdmin() {
    return checkIsAdminByRole(getUserRoleTitleFromLocalStorage());
}
