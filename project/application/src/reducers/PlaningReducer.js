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
    OPEN_DAY_OFF_CHANGE_WINDOW, SWITCH_MONTH
} from "../actions/PlaningActions";

import moment from 'moment';

const defaultState = {
    switchMonth:true,
    current: null,
    month: [],
    users: [
        // {
        //     id: '1',
        //     name: 'John Doe',
        //     avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        //     openFlag: false,
        //     heightMulti: 1,
        //     plan: [
        //         {
        //             id: '11e468ff-ae8e-4a54-89a1-7f2bfbca12f6',
        //             team_id: '11361827-073c-4333-8826-fbc9efdddefd',
        //             user_id: '9886ee22-fc3e-4cc7-97bc-e48314926aa6',
        //             user: {
        //                 username: 'sipode@evxmail.net',
        //                 email: 'sipode@evxmail.net',
        //             },
        //             project_id: null,
        //             project: null,
        //             timer_off_id: '2e8c3e92-5de0-41d4-be78-993f459fd98a',
        //             timer_off: {
        //                 name: 'Day off',
        //                 timer_off_color: {
        //                     name: 'red',
        //                     color: '#DB1040',
        //                 },
        //             },
        //             duration: 28800000,
        //             start_date: '2020-02-10T00:00:00+00:00',
        //             end_date: '2020-02-10T00:00:00+00:00',
        //             created_by_id: '9886ee22-fc3e-4cc7-97bc-e48314926aa6',
        //             created_by: {
        //                 username: 'sipode@evxmail.net',
        //                 email: 'sipode@evxmail.net',
        //             },
        //             created_at: '2020-02-21T10:09:21.006301+00:00',
        //         },
        //         {
        //             id: '11e468ff-ae8e-4a54-89a1-7f2bfbca12f6',
        //             team_id: '11361827-073c-4333-8826-fbc9efdddefd',
        //             user_id: '9886ee22-fc3e-4cc7-97bc-e48314926aa6',
        //             user: {
        //                 username: 'sipode@evxmail.net',
        //                 email: 'sipode@evxmail.net',
        //             },
        //             project_id: 'e07df3d2-d464-4054-bc20-a996a699927e',
        //             project: {
        //                 name: 'Ultradom',
        //                 project_color: {
        //                     name: 'orange',
        //                     color: '#FF7A00',
        //                 },
        //             },
        //             timer_off_id: null,
        //             timer_off: null,
        //             duration: 144000000,
        //             start_date: '2020-03-12T00:00:00+00:00',
        //             end_date: '2020-03-15T00:00:00+00:00',
        //             created_by_id: '9886ee22-fc3e-4cc7-97bc-e48314926aa6',
        //             created_by: {
        //                 username: 'sipode@evxmail.net',
        //                 email: 'sipode@evxmail.net',
        //             },
        //             created_at: '2020-02-21T10:09:21.006301+00:00',
        //         },
        //     ],
        //     userRenderMonth: [],
        // },
        {
            id: '1',
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            openFlag: false,
            heightMulti: 1,
            shedule: [
                {
                    dateStart: '2020-03-5',
                    dateEnd: '2020-03-13',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'ultradom',
                            color: 'orange',
                            planed: 8,
                            tracked: 4,
                        },
                        // {
                        //     name: 'siba',
                        //     color: 'purple',
                        //     planed: 8,
                        //     tracked: 3,
                        // },
                        // {
                        //     name: 'project1',
                        //     color: 'green',
                        //     planed: 10,
                        //     tracked: 5,
                        // },
                        // {
                        //     name: 'project2',
                        //     color: 'blue',
                        //     planed: 12,
                        //     tracked: 5,
                        // },
                    ],
                    timeOff: [
                        // {
                        //     id: '1',
                        //     name: 'public holiday',
                        //     color: '#008D8D',
                        //     checked: true,
                        // },
                        // {
                        //     id: '2',
                        //     name: 'day off',
                        //     color: '#DB1040',
                        //     checked: true,
                        // },
                    ],
                },
                {
                    dateStart: '2020-03-7',
                    dateEnd: '2020-03-7',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return (
                            this.projects && this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed
                        );
                    },
                    trackedTotal() {
                        return (
                            this.projects &&
                            this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked
                        );
                    },
                    projects: null,
                    timeOff: [
                        // {
                        //     id: '1',
                        //     name: 'public holiday',
                        //     color: '#008D8D',
                        //     checked: true,
                        // },
                        {
                            id: '2',
                            name: 'day off',
                            color: '#DB1040',
                            checked: true,
                        },
                    ],
                },
                {
                    dateStart: '2020-01-13',
                    dateEnd: '2020-01-19',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'ultradom',
                            color: 'orange',
                            planed: 2,
                            tracked: 0,
                        },
                        {
                            name: 'siba',
                            color: 'purple',
                            planed: 3,
                            tracked: 3,
                        },
                        {
                            name: 'project1',
                            color: 'green',
                            planed: 10,
                            tracked: 5,
                        },
                    ],
                    timeOff: [
                        {
                            id: '1',
                            name: 'public holiday',
                            color: '#008D8D',
                            checked: true,
                        },
                    ],
                },
                {
                    dateStart: '2020-01-1',
                    dateEnd: '2020-01-5',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'ultradom',
                            color: 'orange',
                            planed: 20,
                            tracked: 4,
                        },
                    ],
                    timeOff: [],
                },
                {
                    dateStart: '2020-01-20',
                    dateEnd: '2020-01-26',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'ultradom',
                            color: 'orange',
                            planed: 30,
                            tracked: 4,
                        },
                        {
                            name: 'siba',
                            color: 'purple',
                            planed: 10,
                            tracked: 4,
                        },
                    ],
                    timeOff: [
                        {
                            id: '2',
                            name: 'day off',
                            color: '#DB1040',
                            checked: true,
                        },
                        {
                            id: '2',
                            name: 'day off',
                            color: '#DB1040',
                            checked: true,
                        },
                        {
                            id: '2',
                            name: 'day off',
                            color: '#DB1040',
                            checked: true,
                        },
                    ],
                },
            ],
        },
        {
            id: '2',
            name: 'JO JO',
            avatar: 'https://randomuser.me/api/portraits/women/75.jpg',
            openFlag: false,
            heightMulti: 1,
            shedule: [
                {
                    dateStart: '2020-01-1',
                    dateEnd: '2020-01-5',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'siba',
                            color: 'purple',
                            planed: 40,
                            tracked: 4,
                        },
                    ],
                    timeOff: [],
                },
                {
                    dateStart: '2020-01-7',
                    dateEnd: '2020-01-10',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'ultradom',
                            color: 'orange',
                            planed: 4,
                            tracked: 4,
                        },
                        {
                            name: 'siba',
                            color: 'purple',
                            planed: 4,
                            tracked: 4,
                        },
                    ],
                    timeOff: [
                        {
                            id: '1',
                            name: 'public holiday',
                            color: '#008D8D',
                            checked: true,
                        },
                        {
                            id: '2',
                            name: 'day off',
                            color: '#DB1040',
                            checked: true,
                        },
                        {
                            id: '4',
                            name: 'own days',
                            color: '#03008D',
                            checked: true,
                        },
                        {
                            id: '5',
                            name: 'sick',
                            color: '#DB7110',
                            checked: true,
                        },
                    ],
                },
                {
                    dateStart: '2020-02-5',
                    dateEnd: '2020-02-10',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'ultradom',
                            color: 'orange',
                            planed: 8,
                            tracked: 0,
                        },
                    ],
                    timeOff: [
                        {
                            id: '5',
                            name: 'sick',
                            color: '#DB7110',
                            checked: true,
                        },
                    ],
                },
                {
                    dateStart: '2020-02-15',
                    dateEnd: '2020-02-20',
                    daysCount() {
                        return moment(this.dateEnd).diff(moment(this.dateStart), 'days') + 1;
                    },
                    planedTotal() {
                        return this.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed;
                    },
                    trackedTotal() {
                        return this.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked;
                    },
                    projects: [
                        {
                            name: 'ultradom',
                            color: 'orange',
                            planed: 4,
                            tracked: 4,
                        },
                        {
                            name: 'siba',
                            color: 'purple',
                            planed: 10,
                            tracked: 4,
                        },
                    ],
                    timeOff: [
                        {
                            id: '1',
                            name: 'public holiday',
                            color: '#008D8D',
                            checked: true,
                        },
                        {
                            id: '1',
                            name: 'public holiday',
                            color: '#008D8D',
                            checked: true,
                        },
                    ],
                },
            ],
        },
    ],
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
    swithcAllTimeOff: true,
};

export const planingReducer = (state = defaultState, action) => {
    switch (action.type) {
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

        case SWITCH_MONTH: {
            return {
                ...state,
                switchMonth: !state.switchMonth,
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
