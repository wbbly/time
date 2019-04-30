import * as moment from 'moment';

import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { getServerClientTimediffFromLocalStorage } from '../../services/serverClientTimediffStorageService';

export function getDateInString(seconds) {
    if (!seconds) {
        return '-';
    }

    return getTimeDurationByGivenTimestamp(seconds);
}

export function getTimeDiff(timeFrom, inString) {
    let serverClientTimediff = getServerClientTimediffFromLocalStorage();
    const timeDiff = +moment() - timeFrom + serverClientTimediff;

    return inString ? getTimeDurationByGivenTimestamp(+timeDiff) : moment(timeDiff).utc();
}
