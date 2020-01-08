import { CREATE_MONTH_ARRAY, INCRIMENT_MONTH, DECREMENT_MONTH } from '../actions/PlaningActions';

import moment from 'moment';

const defaultState = {
    current: moment(),
    month: [],
};

export const planingReducer = (state = defaultState, action) => {
    switch (action.type) {
        case INCRIMENT_MONTH: {
            return {
                ...state,
                current: state.current.add(1, 'month'),
            };
        }

        case DECREMENT_MONTH: {
            return {
                ...state,
                current: state.current.subtract(1, 'month'),
            };
        }

        case CREATE_MONTH_ARRAY: {
            const daysArray = [];
            let week = [];
            for (let x = 1; x <= state.current.daysInMonth(); x++) {
                let el = state.current.date(x).format();
                const day = {
                    fullDate: el,
                    color: moment(el).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                    background: moment(el).day() === 6 || moment(el).day() === 0 ? '#003434' : '#323232',
                };
                week.push(day);
                if (moment(el).day() === 0 || x === state.current.daysInMonth()) {
                    daysArray.push({
                        week: week,
                        weekCount: moment(el).isoWeek(),
                        dayStart: moment(week[0].fullDate).format('DD'),
                        dayEnd: moment(week[week.length - 1].fullDate).format('DD'),
                        weekColor: week.find(item => item.color === '#FFFFFF') ? '#FFFFFF' : '#717171',
                    });
                    const iterations = 7 - week.length;
                    if (week.length < 7) {
                        if (moment(week[week.length - 1].fullDate).date() < 10) {
                            for (let x = 0; x < iterations; x++) {
                                const prevDay = moment(week[0].fullDate)
                                    .subtract(1, 'days')
                                    .format();
                                daysArray[0].week.unshift({
                                    fullDate: prevDay,
                                    color: moment(prevDay).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                                    background:
                                        moment(prevDay).day() === 6 || moment(prevDay).day() === 0
                                            ? `repeating-linear-gradient(
                                        60deg,
                                        #1F1F1F,
                                        #1F1F1F 5px,
                                        #003434 5px,
                                        #003434 10px
                                      )`
                                            : `repeating-linear-gradient(
                                        60deg,
                                        #1F1F1F,
                                        #1F1F1F 5px,
                                        #323232 5px,
                                        #323232 10px
                                      )`,
                                    checkFlag: true,
                                    opacity: '0.3',
                                });
                            }
                        } else {
                            for (let x = 0; x < iterations; x++) {
                                const nextDay = moment(week[week.length - 1].fullDate)
                                    .add(1, 'days')
                                    .format();
                                daysArray[daysArray.length - 1].week.push({
                                    fullDate: nextDay,
                                    color: moment(nextDay).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                                    background:
                                        moment(nextDay).day() === 6 || moment(nextDay).day() === 0
                                            ? `repeating-linear-gradient(
                                        60deg,
                                        #1F1F1F,
                                        #1F1F1F 5px,
                                        #003434 5px,
                                        #003434 10px
                                      )`
                                            : `repeating-linear-gradient(
                                        60deg,
                                        #1F1F1F,
                                        #1F1F1F 5px,
                                        #323232 5px,
                                        #323232 10px
                                      )`,
                                    checkFlag: true,
                                    opacity: '0.3',
                                });
                            }
                        }
                    }

                    week = [];
                }
            }
            return {
                ...state,
                month: daysArray,
            };
        }

        default:
            return state;
    }
};
