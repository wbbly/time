import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import PlaningUserBlock from '../../components/PlaningUserBlock';
import { Scrollbars } from 'react-custom-scrollbars';

class PlaningPage extends React.Component {
    state = {
        current: moment(),
        month: [],
        users: [
            {
                id: 1,
                avatar: 'url',
                shedule: [
                    {
                        dateStart: '2020-01-6',
                        dateEnd: '2020-01-12',
                        planedTotal() {
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
                        dateStart: '2020-01-13',
                        dateEnd: '2020-01-19',
                        planedTotal() {
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
                            return this.projects.reduce((a, b) => a.planed + b.planed);
                        },
                        trackedTotal() {
                            return this.projects.reduce((a, b) => a.tracked + b.tracked);
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
        this.setState({ current: moment() }, () => {
            this.getMonthArray();
        });
        // this.setState({month:[...Array(moment().daysInMonth() + 1).keys()].slice(1,)})
    }

    getMonthArray = () => {
        const daysArray = [];
        let week = [];
        for (let x = 1; x <= this.state.current.daysInMonth(); x++) {
            let el = this.state.current.date(x).format();
            const day = {
                fullDate: el,
                color: moment(el).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                background: moment(el).day() === 6 || moment(el).day() === 0 ? '#003434' : '#323232',
            };
            week.push(day);
            if (moment(el).day() === 0 || x === this.state.current.daysInMonth()) {
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
        this.setState({ month: daysArray });
    };

    nextMonth = () => {
        this.setState({ current: this.state.current.add(1, 'month') }, () => {
            this.getMonthArray();
        });
    };

    prevMonth = () => {
        this.setState({ current: this.state.current.subtract(1, 'month') }, () => {
            this.getMonthArray();
        });
    };

    render() {
        const { users, current, month, dayFormat } = this.state;
        const { user, currentTeamData } = this.props;
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
                        Planing Header
                        <button onClick={this.prevMonth}>Prev Month</button>
                        <button onClick={this.nextMonth}>Next Month</button>
                        <h2>742 h All projects</h2>
                        <h2>068 h Tracked</h2>
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
                                        {`Week ${week.weekCount} / ${moment(week.week[0].fullDate).format('MMM')} ${
                                            week.dayStart
                                        } - ${week.dayEnd}`}
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
                            <PlaningUserBlock key={user.id} month={month} user={user} />
                        ))}
                    </div>
                </Scrollbars>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    currentTeamData: state.teamReducer.currentTeamDetailedData.data,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningPage);
