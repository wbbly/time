import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/configureStore';

import { apiCall } from './services/apiService';
import { getTokenFromLocalStorage } from './services/tokenStorageService';
import { AppConfig } from './config';
import { setUserDataAction } from './actions/UserSettingAction';

import * as serviceWorker from './serviceWorker';

import App from './App';

if (getTokenFromLocalStorage()) {
    apiCall(AppConfig.apiURL + `user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
        },
    }).then(result => {
        store.dispatch(setUserDataAction(result));
    });
}

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

serviceWorker.unregister();
