import { Redirect } from 'react-router-dom';
import React from 'react';
import adminEmails from '../config';

export function checkAuthentication() {
    if (!!localStorage.getItem('active_email')) {
        return;
    } else {
        return <Redirect to={'/'} />;
    }
}

export function adminOrNot(email = '') {
    email = atob(email);
    if (adminEmails.indexOf(email) !== -1) {
        return true;
    } else {
        return false;
    }
}
