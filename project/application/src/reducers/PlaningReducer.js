import {
    CREATE_MONTH_ARRAY,
    INCRIMENT_MONTH,
    DECREMENT_MONTH,
    SET_CURRENT_MONTH,
    ADD_USER,
    DELETE_USER,
    CHANGE_USER_OPEN_FLAG,
} from '../actions/PlaningActions';

import moment from 'moment';

const defaultState = {
    current: null,
    month: [],
    users: [
        {
            id: 1,
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            openFlag: false,
            heightMulti: 1,
            shedule: [
                {
                    dateStart: '2020-01-6',
                    dateEnd: '2020-01-12',
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
                        {
                            name: 'siba',
                            color: 'purple',
                            planed: 8,
                            tracked: 3,
                        },
                        {
                            name: 'project1',
                            color: 'green',
                            planed: 10,
                            tracked: 5,
                        },
                        {
                            name: 'project2',
                            color: 'blue',
                            planed: 12,
                            tracked: 5,
                        },
                    ],
                    timeOff: [
                        {
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
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
                            name: 'public holiday',
                            color: '#008D8D',
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
                            name: 'day off',
                            color: '#DB1040',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
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
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
                        },
                        {
                            name: 'own days',
                            color: '#03008D',
                        },
                        {
                            name: 'sick',
                            color: '#DB7110',
                        },
                    ],
                },
                {
                    dateStart: '2020-02-5',
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
                            planed: 8,
                            tracked: 0,
                        },
                    ],
                    timeOff: [
                        {
                            name: 'sick',
                            color: '#DB7110',
                        },
                    ],
                },
                {
                    dateStart: '2020-02-15',
                    dateEnd: '2020-01-20',
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
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                        {
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                    ],
                },
            ],
        },
        {
            id: 3,
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            openFlag: false,
            heightMulti: 1,
            shedule: [
                {
                    dateStart: '2020-01-6',
                    dateEnd: '2020-01-12',
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
                        {
                            name: 'siba',
                            color: 'purple',
                            planed: 8,
                            tracked: 3,
                        },
                        {
                            name: 'project1',
                            color: 'green',
                            planed: 10,
                            tracked: 5,
                        },
                        {
                            name: 'project2',
                            color: 'blue',
                            planed: 12,
                            tracked: 5,
                        },
                    ],
                    timeOff: [
                        {
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
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
                            name: 'public holiday',
                            color: '#008D8D',
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
                            name: 'day off',
                            color: '#DB1040',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
                        },
                    ],
                },
            ],
        },
        {
            id: 4,
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
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                        {
                            name: 'day off',
                            color: '#DB1040',
                        },
                        {
                            name: 'own days',
                            color: '#03008D',
                        },
                        {
                            name: 'sick',
                            color: '#DB7110',
                        },
                    ],
                },
                {
                    dateStart: '2020-02-5',
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
                            planed: 8,
                            tracked: 0,
                        },
                    ],
                    timeOff: [
                        {
                            name: 'sick',
                            color: '#DB7110',
                        },
                    ],
                },
                {
                    dateStart: '2020-02-15',
                    dateEnd: '2020-01-20',
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
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                        {
                            name: 'public holiday',
                            color: '#008D8D',
                        },
                    ],
                },
            ],
        },
    ],
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
                    if (el.projects.length + el.timeOff.length > longest)
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
