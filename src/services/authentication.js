import { Redirect } from 'react-router-dom';
import React from 'react';

export function checkAuthentication() {
    if (!!localStorage.getItem('active_email')) {
        return;
    } else {
        return <Redirect to={'/'} />;
    }
}

export function adminOrNot(email = '') {
    email = atob(email);
    if (email === 'genryh.kovalenko@lazy-ants.de' || email === 'hr@lazy-ants.com') {
        return true;
    } else {
        return false;
    }
}
