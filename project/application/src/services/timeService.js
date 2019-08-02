import * as moment from 'moment';
import { store } from '../store/configureStore';

export function getDateInString(seconds) {
    if (!seconds) {
        return '00:00:00';
    }

    return getTimeDurationByGivenTimestamp(seconds);
}

export function getTimeDiff(timeFrom, inString) {
    const { serverClientTimediff } = store.getState().mainPageReducer;
    const timeDiff = +moment() - timeFrom + serverClientTimediff;

    return inString ? getTimeDurationByGivenTimestamp(+timeDiff) : moment(timeDiff).utc();
}

export function getTimeInSecondFromString(string) {
    let a = string.split(':');
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

    return seconds;
}

export function createArrTimeAndDate(arr, key, firstKey, secondKey) {
    let arrDates = [];
    let arrTime = [];
    for (let i = 0; i < arr.length; i++) {
        let index = arrDates.indexOf(arr[i][firstKey]);
        if (index === -1) {
            arrDates.push(arr[i][firstKey]);
            arrTime.push(arr[i][secondKey]);
        } else {
            arrTime[index] += arr[i][secondKey];
        }
    }
    if (key === 'secondArr') {
        return arrTime;
    } else if (key === 'firstArr') {
        return arrDates;
    }
}

export function changeDate(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(moment(arr[i]).format('dddd DD.MM.YYYY'));
    }

    return newArr;
}

export function getTimeDurationByGivenTimestamp(milliseconds) {
    let hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;

    return `${padTime(hour)}:${padTime(minute)}:${padTime(seconds)}`;
}

export function convertDateToISOString(date) {
    return moment(date)
        .utc()
        .toISOString();
}

export function convertDateToShiftedISOString(date, shiftTimestamp) {
    return moment(date)
        .add(shiftTimestamp, 'ms')
        .utc()
        .toISOString();
}

export function convertUTCDateToLocalISOString(date) {
    const user = { ...store.getState().userReducer.user };
    const { timezoneOffset } = user;

    return moment(date)
        .subtract(timezoneOffset)
        .utc()
        .toISOString();
}

export function convertUTCDateToShiftedLocalISOString(date, shiftTimestamp) {
    const user = { ...store.getState().userReducer.user };
    const { timezoneOffset } = user;

    return moment(date)
        .subtract(timezoneOffset)
        .add(shiftTimestamp, 'ms')
        .utc()
        .toISOString();
}

export function getDate(date) {
    return new Date(date);
}

export function getCurrentDate() {
    return new Date();
}

export function getTimestamp() {
    return new Date().getTime();
}

export function getDateTimestamp(date) {
    return new Date(date).getTime();
}

function padTime(item) {
    if (!item) {
        return '00';
    }

    if ((item + '').length === 1) {
        return '0' + item;
    }

    return item;
}
