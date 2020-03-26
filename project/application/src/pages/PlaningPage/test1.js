import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

//---COMPONENTS---
import PlaningUserBlock from '../../components/PlaningUserBlock';

//---ACTIONS---
import { createMonthArray, nextMonth, prevMonth, currentMonth } from '../../actions/PlaningActions';

//---STYLES---
import './style.scss';

class PlaningPage extends React.Component {
    state = {
        users: [
            {
                id: 1,
                avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
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

    componentDidMount() {
        moment.locale(`${this.props.user.language}`);
        this.props.currentMonth();
    }

    nextMonth = () => {
        this.props.nextMonth();
    };

    prevMonth = () => {
        this.props.prevMonth();
    };
    currentMonth = () => {
        this.props.currentMonth();
    };

    totalPlaned = () => {
        return this.state.users
            .map(el =>
                el.shedule
                    .map(item => item.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed)
                    .reduce((a, b) => a + b)
            )
            .reduce((a, b) => a + b);
    };
    totalTracked = () => {
        return this.state.users
            .map(el =>
                el.shedule
                    .map(item => item.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked)
                    .reduce((a, b) => a + b)
            )
            .reduce((a, b) => a + b);
    };

    render() {
        const { users } = this.state;
        const { planingReducer, vocabulary } = this.props;
        const { month, current } = planingReducer;
        const {
            v_planning,
            v_resource_planing,
            v_all_projects,
            v_tracked,
            v_hour_small,
            v_next_month,
            v_prev_month,
            v_current_month,
            v_week,
            v_plan,
            v_add_plan,
            v_time_off,
            v_add_time,
            v_add_preson,
            v_add,
            v_cancel,
            v_public_holiday,
        } = vocabulary;

        return (
            <div className="planing">
                <div className="planing-header">
                    <div className="planing-header-left" />
                    <div className="planing-header-right">
                        <p>{v_resource_planing}</p>
                        <div className="planing-header-right__info-container">
                            <div className="planing-header-right__counters">
                                <p>{`${this.totalPlaned()}${v_hour_small} ${v_all_projects} `}</p>
                                <p>{`${this.totalTracked()}${v_hour_small} ${v_tracked}`}</p>
                            </div>
                            <div className="planing-header-right__add-btn">
                                <button style={{ display: 'flex', alignItems: 'center' }}>
                                    {' '}
                                    <i className="planing-header-right__plus" />
                                    {v_add_plan}
                                </button>

                                <button>{v_time_off}</button>
                            </div>
                            <div className="planing-header-right__move-btn">
                                <button onClick={this.prevMonth}>{v_prev_month}</button>
                                <button onClick={this.currentMonth}>{v_current_month}</button>
                                <button onClick={this.nextMonth}>{v_next_month}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {-------BODY---------} */}
                <Scrollbars>
                    <div className="main-content-wrapper">
                        <div className="month-container">
                            <div className="month-container__add-user-block">
                                <i className="month-container__add-user" />
                            </div>
                            <div className="month-container__weeks-block">
                                {month.map((week, index) => (
                                    <div className="month-container__week" key={index}>
                                        <h2 style={{ whiteSpace: 'nowrap', color: week.weekColor }}>
                                            {`${v_week} ${week.weekCount} / ${moment(current).format('MMM')} ${
                                                week.dayStart
                                            } - ${week.dayEnd}`}
                                        </h2>
                                        <div className="month-container__days-block">
                                            {week.week.map((day, index) => (
                                                <div className="month-container__day" key={index}>
                                                    <div
                                                        style={{
                                                            fontSize: '1em',
                                                            whiteSpace: 'nowrap',
                                                            textAlign: 'center',
                                                            color: day.color,
                                                        }}
                                                    >
                                                        {moment(day.fullDate).format('ddd DD')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {users.map(user => (
                            <PlaningUserBlock key={user.id} month={month} user={user} {...vocabulary} />
                        ))}
                        {/* {users.map(user => (
                            <PlaningUserBlock key={user.id} month={month} user={user} {...vocabulary} />
                        ))}
                        {users.map(user => (
                            <PlaningUserBlock key={user.id} month={month} user={user} {...vocabulary} />
                        ))} */}
                        <div className="aside-footer" />
                    </div>
                </Scrollbars>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    // currentTeamData: state.teamReducer.currentTeamDetailedData.data,
    planingReducer: state.planingReducer,
    vocabulary: state.languageReducer.vocabulary,
});

const mapDispatchToProps = {
    createMonthArray,
    nextMonth,
    prevMonth,
    currentMonth,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningPage);
