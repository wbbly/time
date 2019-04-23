import * as moment from 'moment';

import { getDate } from '../../services/timeService';

export function timeInSeconds(string) {
    let hms = string;
    let a = hms.split(':');
    let seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

    return seconds;
}

export function getDateInString(seconds) {
    if (!seconds) {
        return '-';
    }
    let date = getDate(null);
    date.setMilliseconds(seconds);
    let result = date.toISOString().substr(11, 8);

    return result;
}

export function getTimInStringSeconds(seconds) {
    if (typeof seconds === 'string') {
        return '-';
    }

    let date = getDate(null);
    date.setSeconds(seconds);
    let result = date.toISOString().substr(11, 8);

    return result;
}

export function getTimeDiff(timeFrom, inString) {
    let serverClientTimediff = localStorage.getItem('server-client-timediff');
    serverClientTimediff = serverClientTimediff ? +serverClientTimediff : 0;
    const timeDiff = moment(+moment() - timeFrom + serverClientTimediff).utc();

    return inString ? timeDiff.format('HH:mm:ss') : timeDiff;
}
