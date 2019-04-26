export const ROLES = {
    ROLE_USER: 'e1f1f00c-abee-448c-b65d-cdd51bb042f1',
    ROLE_ADMIN: '449bca08-9f3d-4956-a38e-7b5de27bdc73',
};

export function userLoggedIn() {
    return !!localStorage.getItem('user-object');
}

export function checkIsAdmin() {
    let object = JSON.parse(localStorage.getItem('user-object'));
    if (!object) {
        return;
    }

    return this.checkIsAdminByRole(object.role.title);
}

export function checkIsAdminByRole(role) {
    return role === 'ROLE_ADMIN';
}

export function checkIsUserByRole(role) {
    return role === 'ROLE_USER';
}

export function getUserId() {
    let storageItem = JSON.parse(localStorage.getItem('user-object'));
    if (!storageItem) {
        return;
    }
    return storageItem.id;
}

export function getUserData() {
    let storageItem = JSON.parse(localStorage.getItem('user-object'));
    if (!storageItem) {
        return {
            id: null,
            username: '',
            email: '',
        };
    }

    return {
        id: storageItem.id,
        username: storageItem.username,
        email: storageItem.email,
    };
}
