import io from 'socket.io-client';
import moment from 'moment';

import { AppConfig } from './config';
import { getTokenFromLocalStorage } from './services/tokenStorageService';
import { logoutByUnauthorized } from './services/authentication';
import { store } from './store/configureStore';
import { setCurrentTimerAction, setServerClientTimediffAction } from './actions/MainPageAction';
import { decodeTimeEntryIssue, encodeTimeEntryIssue } from './services/timeEntryService';

const baseURL = AppConfig.apiURL;

let socket = null;

const socketEmit = (event, data = {}, ack = () => {}) => {
    socket.emit(
        event,
        {
            token: `Bearer ${getTokenFromLocalStorage()}`,
            ...data,
        },
        res => {
            ack(res);
        }
    );
};

const setCurrentTimer = data => {
    const { currentTimer } = store.getState().mainPageReducer;
    if (data) {
        const currentTimer = {
            id: data.id,
            timeStart: +moment(data.startDatetime),
            issue: decodeTimeEntryIssue(data.issue),
            project: data.project,
        };
        store.dispatch(setServerClientTimediffAction(data.time.timeISO));
        store.dispatch(setCurrentTimerAction(currentTimer));
    } else {
        if (currentTimer) {
            store.dispatch(setCurrentTimerAction(null));
        }
    }
};

export const startTimerSocket = ({ issue, projectId }, callback) => {
    socketEmit(
        'start-timer-v2',
        {
            issue: encodeTimeEntryIssue(issue.trim()),
            projectId,
        },
        callback
    );
};

export const stopTimerSocket = callback => {
    socketEmit('stop-timer-v2', null, callback);
};

export const updateTimerSocket = ({ issue, projectId }, callback) => {
    const data = {};
    if (projectId) {
        data.projectId = projectId;
    } else {
        data.issue = encodeTimeEntryIssue(issue.trim());
    }
    socketEmit('update-timer-v2', data, callback);
};

export const initSocket = () => {
    if (!socket) {
        socket = io(baseURL);
        socket.on('user-unauthorized', () => logoutByUnauthorized());
        socket.on('check-timer-v2', res => setCurrentTimer(res));

        socket.on('connect', () => socketEmit('join-v2', null, () => socketEmit('check-timer-v2')));
    } else if (socket.disconnected) {
        socket.open();
    }
};

export const closeSocket = () => {
    if (socket && socket.connected) {
        socketEmit('leave-v2');
        socket.close();
    }
};
