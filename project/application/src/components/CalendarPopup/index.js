import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import enLocale from 'date-fns/locale/en-GB';
import deLocale from 'date-fns/locale/de';
import ruLocale from 'date-fns/locale/ru';
import itLocale from 'date-fns/locale/it';
import uaLocale from 'date-fns/locale/uk';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';
import { scrollToAction } from '../../actions/ResponsiveActions';

import './style.scss';

const localeMap = {
    en: enLocale,
    ru: ruLocale,
    de: deLocale,
    it: itLocale,
    uk: uaLocale,
};

const muiTheme = createMuiTheme({
    overrides: {
        MuiFormHelperText: {
            root: {
                display: 'none',
            },
        },
        MuiTypography: {
            root: {
                fontSize: '1.7rem !important',
            },
        },
        MuiInputAdornment: {
            root: {
                display: 'none',
            },
        },
        MuiInput: {
            root: {
                fontSize: '1.7rem !important',
            },
        },
        MuiFormControl: {
            root: {
                width: '100%',
            },
        },
        MuiPickersDay: {
            current: {
                color: '#27ae60',
            },
            daySelected: {
                backgroundColor: '#27ae60',
                '&:hover': {
                    backgroundColor: '#27ae60',
                },
            },
        },
    },
});

class CalendarPopup extends Component {
    state = {
        startTimeString: null,
        endTimeString: null,
        date: null,
        isChangedTime: false,
        isChangedDate: false,
        initialRender: true,
    };

    static getDerivedStateFromProps(props, state) {
        const { startDateTime, endDateTime, timeFormat } = props;
        const { initialRender } = state;
        if (initialRender) {
            return {
                startTimeString: moment(startDateTime).format(timeFormat === '12' ? 'hh:mm A' : 'HH:mm'),
                endTimeString: moment(endDateTime).format(timeFormat === '12' ? 'hh:mm A' : 'HH:mm'),
                date: moment(startDateTime).toDate(),
                initialRender: false,
            };
        }
        return null;
    }

    stringToDateString = string => {
        const { timeFormat } = this.props;

        const timeFormatter = timeFormat === '12' ? 'hh:mm A' : 'HH:mm';

        let date = moment(string, timeFormatter).format(timeFormatter);
        return date;
    };

    changeHandlerStartTime = ({ target: { value } }) => {
        this.setState({
            isChangedTime: true,
            startTimeString: value,
        });
    };

    changeHandlerEndTime = ({ target: { value } }) => {
        this.setState({
            isChangedTime: true,
            endTimeString: value,
        });
    };

    changeHandlerDate = date => {
        this.setState({
            isChangedDate: true,
            date,
        });
    };

    timeStringToDateTimeStringStartTime = () => {
        const { startTimeString } = this.state;
        this.setState({
            startTimeString: this.stringToDateString(startTimeString),
        });
    };

    timeStringToDateTimeStringEndTime = () => {
        const { endTimeString } = this.state;
        this.setState({
            endTimeString: this.stringToDateString(endTimeString),
        });
    };

    keyPressHandlerStartTime = ({ key }) => {
        if (key === 'Enter') {
            this.timeStringToDateTimeStringStartTime();
        }
    };

    keyPressHandlerEndTime = ({ key }) => {
        if (key === 'Enter') {
            this.timeStringToDateTimeStringEndTime();
        }
    };

    blurHandlerStartTime = () => {
        this.timeStringToDateTimeStringStartTime();
    };

    blurHandlerEndTime = () => {
        this.timeStringToDateTimeStringEndTime();
    };

    componentDidMount() {
        const { createRefCallback, scrollToAction } = this.props;
        createRefCallback(this.editTaskPopupRef);
        const height = window.innerHeight || window.document.documentElement.clientHeight;
        const boundingClientRect = this.editTaskPopupRef.current.getBoundingClientRect();
        const { bottom } = boundingClientRect;
        if (bottom > height) {
            const diff = bottom - height;
            scrollToAction(diff);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { createRefCallback } = this.props;
        createRefCallback(this.editTaskPopupRef);
    }

    componentWillUnmount() {
        const { updateTask, vocabulary, showNotificationAction, timeFormat } = this.props;
        const { v_a_time_start_error } = vocabulary;
        const { startTimeString, endTimeString, date, isChangedTime, isChangedDate } = this.state;

        const timeFormatter = timeFormat === '12' ? 'hh:mm A' : 'HH:mm';
        const startDateTime = moment(startTimeString, timeFormatter).toDate();
        const endDateTime = moment(endTimeString, timeFormatter).toDate();

        if (isChangedTime || isChangedDate) {
            if (moment(startDateTime).isValid() && moment(endDateTime).isValid()) {
                const startDay = moment(date).format('YYYY-MM-DD');
                let endDay = moment(date).format('YYYY-MM-DD');
                const startTime = isChangedTime
                    ? moment(`${startDay} ${moment(startDateTime).format('HH:mm')}`)
                    : moment(`${startDay} ${moment(startDateTime).format('HH:mm:ss')}`);
                let endTime = isChangedTime
                    ? moment(`${endDay} ${moment(endDateTime).format('HH:mm')}`)
                    : moment(`${endDay} ${moment(endDateTime).format('HH:mm:ss')}`);
                if (isChangedTime && +startTime >= +endTime) {
                    endDay = moment(date)
                        .add(1, 'days')
                        .format('YYYY-MM-DD');
                    endTime = moment(`${endDay} ${moment(endDateTime).format('HH:mm')}`);
                }
                updateTask({
                    startDateTime: startTime,
                    endDateTime: endTime,
                });
            } else {
                showNotificationAction({ text: v_a_time_start_error, type: 'warning' });
            }
        }
    }

    render() {
        const { date, startTimeString, endTimeString } = this.state;
        const { vocabulary, firstDayOfWeek } = this.props;
        const { lang, v_time_start, v_time_end } = vocabulary;

        const customLocale = localeMap[lang.short];
        customLocale.options.weekStartsOn = firstDayOfWeek;

        return (
            <div ref={(this.editTaskPopupRef = React.createRef())} className="edit-task-popup">
                <ThemeProvider theme={muiTheme}>
                    <div className="edit-task-popup_set-time">
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
                            <div className="edit-task-popup_set-time-start">
                                <div className="edit-task-popup_set-time-label">{v_time_start}</div>
                                <TextField
                                    value={startTimeString}
                                    onChange={this.changeHandlerStartTime}
                                    onKeyPress={this.keyPressHandlerStartTime}
                                    onBlur={this.blurHandlerStartTime}
                                />
                            </div>
                            <div className="edit-task-popup_set-time-end">
                                <div className="edit-task-popup_set-time-label">{v_time_end}</div>
                                <TextField
                                    value={endTimeString}
                                    onChange={this.changeHandlerEndTime}
                                    onKeyPress={this.keyPressHandlerEndTime}
                                    onBlur={this.blurHandlerEndTime}
                                />
                            </div>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="edit-task-popup_calendar">
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={customLocale}>
                            <DatePicker
                                autoOk
                                disableToolbar={true}
                                allowKeyboardControl={false}
                                variant="static"
                                openTo="date"
                                value={date}
                                onChange={this.changeHandlerDate}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </ThemeProvider>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    timeFormat: state.userReducer.timeFormat,
    firstDayOfWeek: state.userReducer.firstDayOfWeek,
});

const mapDispatchToProps = {
    showNotificationAction,
    scrollToAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarPopup);
