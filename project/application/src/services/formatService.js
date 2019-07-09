import * as moment from 'moment';

export function getTimeHoursFormat(timeFormat) {
    return timeFormat === '12h';
}

export function getFirstDayOfWeek(firstDayWeek) {
    return firstDayWeek === 'sun' ? 0 : 1
}

export function changeDisplayingDateFormat(date, dateFormat) {
    let momentStringDate = dateStringFormatToMomentStringFormat(date);

    return moment(momentStringDate).format(dateFormat);
}

function dateStringFormatToMomentStringFormat(dateInString) {
    if (typeof dateInString === 'string' && dateInString.includes('.') && !dateInString.includes('T')) {
        return dateInString
            .split('.')
            .reverse()
            .join('-');
    }

    return dateInString;
}
