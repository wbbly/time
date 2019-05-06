import { getUserFromLocalStorage, getUserRoleTitleFromLocalStorage } from './userStorageService';

export const ROLES = {
    ROLE_ADMIN: '00000000-0000-0000-0000-000000000000',
    ROLE_USER: '00000000-0000-0000-0000-000000000001',
};

export function userLoggedIn() {
    const user = getUserFromLocalStorage();

    return !!Object.keys(user).length && user.timezoneOffset;
}

export function checkIsAdminByRole(role) {
    return role === 'ROLE_ADMIN';
}

export function checkIsUserByRole(role) {
    return role === 'ROLE_USER';
}

export function checkIsAdmin() {
    return checkIsAdminByRole(getUserRoleTitleFromLocalStorage());
}
