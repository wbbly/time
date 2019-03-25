import * as moment from 'moment';

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
        if (index == -1) {
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
    console.log(arr, 'arr');
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(moment(arr[i]).format('dddd DD.MM.YYYY'));
    }
    return newArr;
}
