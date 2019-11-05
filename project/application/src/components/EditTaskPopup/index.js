import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import { DatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import enLocale from 'date-fns/locale/en-GB';
import deLocale from 'date-fns/locale/de';
import ruLocale from 'date-fns/locale/ru';
import itLocale from 'date-fns/locale/it';
import uaLocale from 'date-fns/locale/uk';

// axios request
import { changeTask } from '../../configAPI';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

import { encodeTimeEntryIssue } from '../../services/timeEntryService';

import './style.scss';

const localeMap = {
    en: enLocale,
    ru: ruLocale,
    de: deLocale,
    it: itLocale,
    uk: uaLocale,
};

// MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedEnd

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

class EditTaskPopup extends Component {
    state = {
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        isChanged: false,
    };

    changeDate = value =>
        this.setState({
            date: value,
            isChanged: true,
        });

    onChangeTimeStart = value =>
        this.setState({
            startTime: value,
            isChanged: true,
        });

    onChangeTimeEnd = value =>
        this.setState({
            endTime: value,
            isChanged: true,
        });

    componentDidMount() {
        const { editedItem } = this.props;
        const { startDatetime, endDatetime } = editedItem;

        this.setState({
            startTime: moment(startDatetime).toDate(),
            endTime: moment(endDatetime).toDate(),
            date: moment(startDatetime).toDate(),
        });
    }

    async componentWillUnmount() {
        const { isChanged, startTime, endTime, date } = this.state;
        const { getUserTimeEntries, editedItem, vocabulary, setIsUpdatingTask, showNotificationAction } = this.props;
        const { startDatetime, endDatetime, id, project, issue } = editedItem;
        const { v_a_time_start_error } = vocabulary;
        if (isChanged) {
            setIsUpdatingTask(true);
            const startDateTime = moment(
                `${moment(date).format('YYYY-MM-DD')} ${
                    startTime ? moment(startTime).format('HH:mm') : moment(startDatetime).format('HH:mm')
                }`
            );
            const endDateTime = moment(
                `${moment(date).format('YYYY-MM-DD')} ${
                    endTime ? moment(endTime).format('HH:mm') : moment(endDatetime).format('HH:mm')
                }`
            );

            if (
                !startDateTime.utc().toISOString() ||
                !endDateTime.utc().toISOString() ||
                +startDateTime >= +endDateTime
            ) {
                // alert(v_a_time_start_error);
                showNotificationAction({ text: v_a_time_start_error, type: 'warning' });
                return;
            }

            await changeTask(id, {
                issue: encodeTimeEntryIssue(issue),
                projectId: project.id,
                startDatetime: startDateTime.utc().toISOString(),
                endDatetime: endDateTime.utc().toISOString(),
            });
            await getUserTimeEntries();
        }
        setIsUpdatingTask(false);
    }

    render() {
        const { date, startTime, endTime } = this.state;
        const { vocabulary, timeFormat, firstDayOfWeek } = this.props;
        const { v_time_start, v_time_end, lang } = vocabulary;

        const customLocale = localeMap[lang.short];
        customLocale.options.weekStartsOn = firstDayOfWeek;

        return (
            <div className="edit-task-popup">
                <ThemeProvider theme={muiTheme}>
                    <div className="edit-task-popup_set-time">
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
                            <div className="edit-task-popup_set-time-start">
                                <div className="edit-task-popup_set-time-label">{v_time_start}</div>
                                <KeyboardTimePicker
                                    disableToolbar
                                    ampm={timeFormat === '12'}
                                    value={startTime}
                                    onChange={this.onChangeTimeStart}
                                />
                            </div>
                            <div className="edit-task-popup_set-time-end">
                                <div className="edit-task-popup_set-time-label">{v_time_end}</div>
                                <KeyboardTimePicker
                                    disableToolbar
                                    ampm={timeFormat === '12'}
                                    value={endTime}
                                    onChange={this.onChangeTimeEnd}
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
                                onChange={this.changeDate}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </ThemeProvider>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    vocabulary: store.languageReducer.vocabulary,
    dateFormat: store.userReducer.dateFormat,
    timeFormat: store.userReducer.timeFormat,
    firstDayOfWeek: store.userReducer.firstDayOfWeek,
    vocabulary: store.languageReducer.vocabulary,
});

const mapDispatchToProps = {
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditTaskPopup);
