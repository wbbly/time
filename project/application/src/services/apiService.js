import { getTokenFromLocalStorage } from './tokenStorageService';
import { logoutByUnauthorized } from './authentication';
import { AppConfig } from '../config';

export function getParametersString(name, params) {
    let pharam = [];
    for (let i = 0; i < params.length; i++) {
        pharam.push(`${name}[]=${params[i]}`);
    }

    return pharam.join('&');
}

export function apiCall(url, params = { method: 'GET' }, withAuth = true) {
    params['headers'] = params['headers'] || {};
    if (withAuth) {
        params.headers['Authorization'] = `Bearer ${getTokenFromLocalStorage()}`;
    }

    return new Promise((resolve, reject) => {
        fetch(url, params)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401) {
                        const message = `Action: user-unauthorized api request, token: ${JSON.stringify(
                            getTokenFromLocalStorage()
                        )}, response: ${JSON.stringify(res)}`;
                        console.log(message);
                    } else {
                        throw res;
                    }
                }

                return res.json();
            })
            .then(res => resolve(res), err => reject(err));
    });
}
