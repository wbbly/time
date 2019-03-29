import { Redirect } from 'react-router-dom';
import React from 'react';

import { AppConfig } from '../config';

export function checkAuthentication() {
    if (!!localStorage.getItem('userObject')) {
        return;
    } else {
        return <Redirect to={'/'} />;
    }
}

export function checkAuthenticationOnLoginPage() {
    if (!!localStorage.getItem('userObject')) {
        return <Redirect to={'/main-page'} />;
    } else {
        return;
    }
}

export function adminOrNot(email = '') {
    let object = JSON.parse(localStorage.getItem('userObject'));
    if (object.role.title === 'ROLE_ADMIN') {
        return true;
    } else {
        return false;
    }
}

export function getUserId() {
    return (JSON.parse(localStorage.getItem('userObject')) || {}).id;
}

export function getUserAdminRight() {
    return (JSON.parse(localStorage.getItem('userObject')) || {}).role.title;
}
