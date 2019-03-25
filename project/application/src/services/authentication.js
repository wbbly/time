import { Redirect } from 'react-router-dom';
import React from 'react';

import { AppConfig } from '../config';

export function checkAuthentication() {
    if (!!localStorage.getItem('active_email')) {
        return;
    } else {
        return <Redirect to={'/'} />;
    }
}

export function checkAuthenticationOnLoginPage() {
    if (!!localStorage.getItem('active_email')) {
        return <Redirect to={'/main-page'} />;
    } else {
        return;
    }
}

export function adminOrNot(email = '') {
    email = atob(email);

    if (AppConfig.adminEmails.indexOf(email) !== -1) {
        return true;
    } else {
        return false;
    }
}
