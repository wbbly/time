import { getTokenFromLocalStorage, removeTokenFromLocalStorage } from './tokenStorageService';
import { removeCurrentTimerFromLocalStorage } from './currentTimerStorageService';
import { removeServerClientTimediffFromLocalStorage } from './serverClientTimediffStorageService';
import { removeAvailableTeamsFromLocalStorage } from './availableTeamsStorageService';
import { removeCurrentTeamDataFromLocalStorage } from './currentTeamDataStorageService';

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
                        removeTokenFromLocalStorage();
                        removeCurrentTimerFromLocalStorage();
                        removeServerClientTimediffFromLocalStorage();
                        removeAvailableTeamsFromLocalStorage();
                        removeCurrentTeamDataFromLocalStorage();
                        window.location.href = window.location.origin;
                    } else {
                        throw res;
                    }
                }

                return res.json();
            })
            .then(res => resolve(res), err => reject(err));
    });
}
