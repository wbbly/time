import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class PlaningPage extends React.Component {
    state = {
        current: moment(),
        month: [],
        dayFormat: false,
        users: [
            {
                id: 1,
                avatar: 'url',
                shedule: [
                    {
                        date: '2020-01-13',
                        planed: 8,
                        tracked: 0,
                        porject: {
                            name: 'ultradom',
                            color: 'orange',
                        },
                    },
                    {
                        date: '2020-01-14',
                        planed: 8,
                        tracked: 0,
                        porject: {
                            name: 'ultradom',
                            color: 'orange',
                        },
                    },
                    {
                        date: '2020-01-15',
                        planed: 8,
                        tracked: 0,
                        porject: {
                            name: 'ultradom',
                            color: 'orange',
                        },
                    },
                    {
                        date: '2020-01-16',
                        planed: 8,
                        tracked: 0,
                        porject: {
                            name: 'ultradom',
                            color: 'orange',
                        },
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
        window.addEventListener('resize', this.changeDayFormat);
        // this.setState({month:[...Array(moment().daysInMonth() + 1).keys()].slice(1,)})
    }

    componentWillMount() {
        window.removeEventListener('resize', this.changeDayFormat);
    }

    changeDayFormat = () => {
        window.screen.width > 1300 ? this.setState({ dayFormat: true }) : this.setState({ dayFormat: false });
    };

    getMonthArray = () => {
        const daysArray = [];
        let week = [];
        for (let x = 1; x <= this.state.current.daysInMonth(); x++) {
            let el = this.state.current.date(x).format();
            const day = {
                fullDate: el,
                color: moment(el).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                backgroundColor: moment(el).day() === 6 || moment(el).day() === 0 ? '#003434' : '#323232',
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
                console.log(daysArray.week);
                if (week.length < 7) {
                    if (moment(week[week.length - 1].fullDate).date() < 10) {
                        for (let x = 0; x < iterations; x++) {
                            const prevDay = moment(week[0].fullDate)
                                .subtract(1, 'days')
                                .format();
                            console.log(daysArray.week);
                            daysArray.week.unshift({
                                fullDate: prevDay,
                                color: moment(prevDay).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                                backgroundColor:
                                    moment(prevDay).day() === 6 || moment(prevDay).day() === 0 ? '#003434' : '#323232',
                            });
                        }
                    } else {
                        for (let x = 0; x < iterations; x++) {
                            const nextDay = moment(week[week.length - 1].fullDate)
                                .add(1, 'days')
                                .format();
                            daysArray.week.push({
                                fullDate: nextDay,
                                color: moment(nextDay).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                                backgroundColor:
                                    moment(nextDay).day() === 6 || moment(nextDay).day() === 0 ? '#003434' : '#323232',
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
        const { current, month, dayFormat } = this.state;
        const { user, currentTeamData } = this.props;
        console.log('Month array:', month);
        return (
            <div
                style={{
                    display: 'flex',
                    backgroundColor: '#1F1F1F',
                    width: '100%',
                    height: '100%',
                }}
            >
                <div style={{ position: 'fixed', height: '100%', width: '55px', backgroundColor: 'grey' }}>aside</div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: '55px',
                        padding: '10px',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <div>
                        Planing Header
                        <button onClick={this.prevMonth}>Prev Month</button>
                        <button onClick={this.nextMonth}>Next Month</button>
                        <h2>{current.format('MMMM-MM-YYYY')}</h2>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {month.map((week, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    margin: '0 5px 0 5px',
                                    flex: '1',
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
                                                {moment(day.fullDate).format(!dayFormat ? 'ddd DD' : 'DD')}
                                            </div>
                                            <div
                                                key={index}
                                                id={day.fullDate}
                                                style={{
                                                    flex: '1',
                                                    border: '1px solid #1F1F1F',
                                                    backgroundColor: day.backgroundColor,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
