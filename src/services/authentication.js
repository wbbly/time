import { Redirect } from 'react-router-dom';
import React from 'react';

export function checkAuthentication() {
    if (!!localStorage.getItem('active_email')) {
        return;
    } else {
        return <Redirect to={'/'} />;
    }
}
