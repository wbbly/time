import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

//---COMPONENTS---
import PlaningUserBlock from '../../components/PlaningUserBlock';

//---ACTIONS---
import { createMonthArray, nextMonth, prevMonth } from '../../actions/PlaningActions';

//---STYLES---
import './style.scss';

class PlaningPage extends React.Component {
    state = {
        users: [
            {
                id: 1,
                avatar: 'url',
                shedule: [
                    {
                        dateStart: '2020-01-6',
                        dateEnd: '2020-01-12',
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
                    },
                    {
                        dateStart: '2020-01-13',
                        dateEnd: '2020-01-19',
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
                                name: 'ultradom',
                                color: 'orange',
                                planed: 4,
                                tracked: 4,
                            },
                        ],
                    },
                    {
                        dateStart: '2020-01-1',
                        dateEnd: '2020-01-5',
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
                    },
                    {
                        dateStart: '2020-01-20',
                        dateEnd: '2020-01-26',
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
                    },
                ],
            },
            {
                id: 2,
                avatar: 'url',
                shedule: [
                    {
                        dateStart: '2020-01-1',
                        dateEnd: '2020-01-5',
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
                    },
                    {
                        dateStart: '2020-01-7',
                        dateEnd: '2020-01-10',
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
                    },
                    {
                        dateStart: '2020-02-5',
                        dateEnd: '2020-01-10',
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
                                tracked: 0,
                            },
                            {
                                name: 'siba',
                                color: 'purple',
                                planed: 4,
                                tracked: 4,
                            },
                        ],
                    },
                    {
                        dateStart: '2020-02-15',
                        dateEnd: '2020-01-20',
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
                    },
                ],
            },
        ],
    };

    componentDidMount() {
        moment.locale(`${this.props.user.language}`);
        this.props.createMonthArray();
    }

    nextMonth = () => {
        this.props.nextMonth();
    };

    prevMonth = () => {
        this.props.prevMonth();
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
        const { month } = planingReducer;
        const {
            v_planning,
            v_resource_planing,
            v_all_projects,
            v_tracked,
            v_hour_small,
            v_next_month,
            v_prev_month,
            v_week,
            v_plan,
            v_add_plan,
            v_time_off,
            v_add_time,
            v_add_preson,
            v_add,
            V_cancel,
            v_public_holiday,
        } = vocabulary;

        return (
            <div
                className="planing"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#1F1F1F',
                    height: '100%',
                }}
            >
                <div
                    className="planing-header"
                    style={{
                        display: 'flex',
                        height: '150px',
                        width: '100%',
                    }}
                >
                    <div
                        className="planing-header__left"
                        style={{
                            width: '55px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    />
                    <div className="planing-header__right" style={{ marginLeft: '10px' }}>
                        <div>{v_resource_planing}</div>

                        <button onClick={this.prevMonth}>{v_prev_month}</button>
                        <button onClick={this.nextMonth}>{v_next_month}</button>
                        <h2>{`${this.totalPlaned()} ${v_hour_small} ${v_all_projects} `}</h2>
                        <h2>{`${this.totalTracked()} ${v_hour_small} ${v_tracked}`}</h2>
                    </div>
                </div>
                {/* {-------BODY---------} */}
                <Scrollbars>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '100%',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                // marginLeft: '55px',
                            }}
                        >
                            <div
                                className="add-user-btn"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minWidth: '55px',
                                    maxWidth: '55px',
                                    height: '53px',
                                }}
                            >
                                X
                            </div>
                            <div
                                style={{
                                    minWidth: '20px',
                                    maxWidth: '20px',
                                    height: '53px',
                                }}
                            />
                            {month.map((week, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        margin: '0 10px 0 10px',
                                        maxWidth: '280px',
                                        minWidth: '280px',
                                        height: '53px',
                                    }}
                                >
                                    <h2 style={{ whiteSpace: 'nowrap', color: week.weekColor }}>
                                        {`${v_week} ${week.weekCount} / ${moment(week.week[0].fullDate).format(
                                            'MMM'
                                        )} ${week.dayStart} - ${week.dayEnd}`}
                                    </h2>
                                    <div style={{ display: 'flex', flex: '1', width: '100%' }}>
                                        {week.week.map((day, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: '1',
                                                }}
                                            >
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
                        {users.map(user => (
                            <PlaningUserBlock key={user.id} month={month} user={user} {...vocabulary} />
                        ))}
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningPage);
