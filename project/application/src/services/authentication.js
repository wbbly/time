import { Redirect } from 'react-router-dom';
import React from 'react';

export function checkAuthentication() {
    if (!!localStorage.getItem('user-object')) {
        return;
    } else {
        return <Redirect to={'/authorisation-page'} />;
    }
}

export function checkAuthenticationOnLoginPage() {
    if (!!localStorage.getItem('user-object')) {
        return <Redirect to={'/main-page'} />;
    } else {
        return;
    }
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
