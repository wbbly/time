export function userLoggedIn() {
    return !!localStorage.getItem('user-object');
}

export function adminOrNot(email = '') {
    let object = JSON.parse(localStorage.getItem('user-object'));
    if (!object) {
        return;
    }
    if (object.role.title === 'ROLE_ADMIN') {
        return true;
    } else {
        return false;
    }
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
        };
    }

    return {
        id: storageItem.id,
        username: storageItem.username,
    };
}

export function getUserAdminRight() {
    let storageItem = JSON.parse(localStorage.getItem('user-object'));
    if (!storageItem) {
        return;
    }
    return storageItem.role.title;
}
