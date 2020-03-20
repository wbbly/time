import {
    CREATE_MONTH_ARRAY,
    INCRIMENT_MONTH,
    DECREMENT_MONTH,
    SET_CURRENT_MONTH,
    ADD_USER,
    DELETE_USER,
    CHANGE_USER_OPEN_FLAG,
    CHANGE_TIME_OFF_FLAG,
    CHANGE_USER_TIME_OFF,
    CHANGE_MAIN_TIME_OFF_SWITCH,
    CHANGE_ALL_USER_TIME_OFF,
    OPEN_DAY_OFF_CHANGE_WINDOW,
    SET_SELECTED_USERS, SET_TIMER_PLANING_LIST,
} from '../actions/PlaningActions';

import moment from 'moment';

const defaultState = {
    current: null,
    month: [],
    selectedUsers: [],
    users: [],
    timerPlaningList: [],
    timeOff: [
        {
            id: '1',
            name: 'public holiday',
            color: '#008D8D',
            colorName: 'green',
            checked: true,
            openFlag: false,
        },
        {
            id: '2',
            name: 'day off',
            color: '#DB1040',
            colorName: 'red',
            checked: true,
            openFlag: false,
        },
        {
            id: '3',
            name: 'vacation',
            color: '#7E00CB',
            colorName: 'purple',
            checked: true,
            openFlag: false,
        },
        {
            id: '4',
            name: 'own days',
            color: '#03008D',
            colorName: 'blue',
            checked: true,
            openFlag: false,
        },
        {
            id: '5',
            name: 'sick leav',
            color: '#DB7110',
            colorName: 'orange',
            checked: true,
            openFlag: false,
        },
    ],
    switchAllTimeOff: true,
};

export const planingReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_SELECTED_USERS: {
            return {
                ...state,
                selectedUsers: action.payload,
            };
        }

        case SET_TIMER_PLANING_LIST: {
            return {
                ...state,
                timerPlaningList: action.payload,
            }
        }

        case INCRIMENT_MONTH: {
            return {
                ...state,
                current: state.current.add(1, 'month'),
                users: state.users.map(user => ({
                    ...user,
                    openFlag: false,
                })),
            };
        }

        case DECREMENT_MONTH: {
            return {
                ...state,
                current: state.current.subtract(1, 'month'),
                users: state.users.map(user => ({
                    ...user,
                    openFlag: false,
                })),
            };
        }
        case SET_CURRENT_MONTH: {
            return {
                ...state,
                current: moment(),
                users: state.users.map(user => ({
                    ...user,
                    openFlag: false,
                })),
            };
        }

        case OPEN_DAY_OFF_CHANGE_WINDOW: {
            return {
                ...state,
                timeOff: state.timeOff.map(
                    off =>
                        off.id == action.payload
                            ? {
                                  ...off,
                                  openFlag: !off.openFlag,
                              }
                            : {
                                  ...off,
                                  openFlag: false,
                              }
                ),
            };
        }

        case CHANGE_USER_OPEN_FLAG: {
            return {
                ...state,
                users: state.users.map(
                    user =>
                        user.id == action.payload
                            ? {
                                  ...user,
                                  openFlag: !user.openFlag,
                              }
                            : user
                ),
                swithcAllTimeOff: state.timeOff.every(el => !el.checked) ? false : true,
            };
        }

        case CHANGE_MAIN_TIME_OFF_SWITCH: {
            return {
                ...state,
                swithcAllTimeOff: !state.swithcAllTimeOff,
            };
        }
        case CHANGE_ALL_USER_TIME_OFF: {
            return {
                ...state,
                timeOff: state.timeOff.map(off => ({ ...off, checked: state.swithcAllTimeOff })),
                users: state.users.map(user => ({
                    ...user,
                    shedule: user.shedule.map(shed => ({
                        ...shed,
                        timeOff: shed.timeOff.map(off => ({ ...off, checked: state.swithcAllTimeOff })),
                    })),
                })),
            };
        }
        case CHANGE_TIME_OFF_FLAG: {
            return {
                ...state,
                timeOff: state.timeOff.map(
                    off => (off.id === action.payload.id ? { ...off, checked: !off.checked } : off)
                ),
            };
        }
        case CHANGE_USER_TIME_OFF: {
            const timeOffItem = state.timeOff.find(el => el.id === action.payload.id);
            return {
                ...state,
                users: state.users.map(user => ({
                    ...user,
                    shedule: user.shedule.map(shed => ({
                        ...shed,
                        timeOff: shed.timeOff.map(
                            off => (off.id === action.payload.id ? { ...off, checked: timeOffItem.checked } : off)
                        ),
                    })),
                })),
                swithcAllTimeOff: state.timeOff.every(el => el.checked),
            };
        }

        case ADD_USER: {
            const newUsersArray = state.users.slice();
            // newUsersArray.push({
            //     ...action.payload, //user object
            //     openFlag:false,
            //     heightMulti:1
            // })

            newUsersArray.forEach(user => {
                let longest = 1;
                user.shedule.forEach(el => {
                    if (el.projects && el.projects.length + el.timeOff.length > longest)
                        longest = el.projects.length + el.timeOff.length;
                });
                user.heightMulti = longest - 1;
            });
            return {
                ...state,
                users: newUsersArray,
            };
        }

        case DELETE_USER: {
            const newUsersArray = state.users.slice();
            newUsersArray.slice(newUsersArray.indexOf(newUsersArray.find(user => user.id === action.payload), 1));
            return {
                ...state,
                users: newUsersArray,
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
