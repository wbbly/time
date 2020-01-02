import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { border } from '@material-ui/system';

class PlaningPage extends React.Component {
    state = {
        current: moment(),
        month: [],
        dayFormat: false,
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
            const el = this.state.current.date(x).format('YYYY-MM-DD');
            const day = {
                fullDate: el,
                color: moment(el).isSame(moment(), 'day') ? '#FFFFFF' : '#717171',
                backgroundColor: moment(el).day() === 0 || moment(el).day() === 6 ? '#003434' : '#323232',
            };
            week.push(day);
            if (moment(el).day() === 0 || x === this.state.current.daysInMonth()) {
                console.log('WEEK', week);
                daysArray.push({
                    week: week,
                    weekCount: moment(el).isoWeek(),
                    dayStart: moment(week[0].fullDate).format('DDD'),
                    dayEnd: moment(week[week.length - 1].fullDate).format('DDD'),
                    weekColor: week.find(item => item.color === '#FFFFFF') ? '#FFFFFF' : '#717171',
                });
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
        console.log(month);
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
                                    margin: '0 5px 0 5px',
                                    flex: '1',
                                }}
                            >
                                <h2 style={{ whiteSpace: 'nowrap', color: week.weekColor }}>
                                    {`Week ${week.weekCount} / ${moment(week.week[0].fullDate).format('MMM')} ${
                                        week.dayStart
                                    } - ${week.dayEnd}`}
                                </h2>
                                <div style={{ display: 'flex', flex: '1' }}>
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
                                                {moment(day.fullDate).format(dayFormat ? 'ddd DD' : 'DD')}
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
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningPage);
