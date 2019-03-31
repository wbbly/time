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
    let date = new Date(null);
    date.setMilliseconds(seconds);
    let result = date.toISOString().substr(11, 8);

    return result;
}

export function getTimInStringSeconds(seconds) {
    console.log(seconds, '!!!!');
    if (typeof seconds === 'string') {
        return '-'
    }
    let date = new Date(null);
    date.setSeconds(seconds);
    let result = date.toISOString().substr(11, 8);

    return result;
}
