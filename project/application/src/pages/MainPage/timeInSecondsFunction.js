import * as moment from 'moment';

import { getTimeDurationByGivenTimestamp } from '../../services/timeService';

export function getDateInString(seconds) {
    if (!seconds) {
        return '-';
    }

    return getTimeDurationByGivenTimestamp(seconds);
}

export function getTimeDiff(timeFrom, inString) {
    let serverClientTimediff = localStorage.getItem('server-client-timediff');
    serverClientTimediff = serverClientTimediff ? +serverClientTimediff : 0;
    const timeDiff = +moment() - timeFrom + serverClientTimediff;

    return inString ? getTimeDurationByGivenTimestamp(+timeDiff) : moment(timeDiff).utc();
}
