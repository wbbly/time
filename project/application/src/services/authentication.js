import { getUserFromLocalStorage, getUserRoleTitleFromLocalStorage } from './userStorageService';

export const ROLES = {
    ROLE_USER: 'e1f1f00c-abee-448c-b65d-cdd51bb042f1',
    ROLE_ADMIN: '449bca08-9f3d-4956-a38e-7b5de27bdc73',
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
