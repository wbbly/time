import React, { Component } from 'react';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

import { DateRangePicker } from 'react-date-range';
import { enGB, ru, de, it, ua } from 'react-date-range/src/locale';
import { staticRanges, inputRanges } from './ranges';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'moment/locale/uk';
import 'moment/locale/ru';
import 'moment/locale/it';
import 'moment/locale/en-gb';
import 'moment/locale/de';
import InputMask from 'react-input-mask';

import { connect } from 'react-redux';

// dependencies
import classNames from 'classnames';
import _ from 'lodash';

// Services
import { checkIsAdminByRole, checkIsOwnerByRole } from '../../services/authentication';
import { getParametersString } from '../../services/apiService';
import {
    getTimeDurationByGivenTimestamp,
    convertDateToISOString,
    convertDateToShiftedISOString,
    convertUTCDateToLocalISOString,
    getCurrentDate,
    getDateTimestamp,
} from '../../services/timeService';
import { apiCall } from '../../services/apiService';

// Components
import ReportsSearchBar from '../../components/reportsSearchBar';
import { Loading } from '../../components/Loading';
import { UnitedReportsComponents } from './UnitedReportsComponents';
import { BlankListComponent } from '../../components/CommonComponents/BlankListcomponent/BlankListComponent';
import PageHeader from '../../components/PageHeader/index';
import Spinner from '../../components/Spinner';

// Actions
import reportsPageAction from '../../actions/ReportsPageAction';
import { getClientsAction } from '../../actions/ClientsActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

const moment = extendMoment(Moment);

const localeMap = {
    ru: ru,
    en: enGB,
    de: de,
    it: it,
    uk: ua,
};

class ReportsPage extends Component {
    state = {
        isInitialFetching: true,
        isFetchingProjects: false,
        isFetchingList: false,
        toggleBar: false,
        toggleChar: false,
        selectionRange: {
            startDate: getCurrentDate(),
            endDate: getCurrentDate(),
            key: 'selection',
        },
        dateSelect: false,
        dateSelectUsers: false,
        projectsData: [],
        totalUpChartTime: '',
        startDateValue: moment(getCurrentDate()).format(this.props.dateFormat),
        endDateValue: moment(getCurrentDate()).format(this.props.dateFormat),
        // This code was used for detecting first/last date select (click) on calendar, remove it for if this feature will needed
        // but its still doesnt work correct (select side ranges)
        // focusedRange: [0, 0],
    };

    lineChartOption = durationTimeFormat => ({
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#BDBDBD',
                    },
                },
            ],
            yAxes: [
                {
                    display: false,
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        legend: {
            display: true,
            labels: {
                fontColor: '#BDBDBD',
            },
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    return getTimeDurationByGivenTimestamp(tooltipItem.yLabel, durationTimeFormat);
                },
            },
        },
    });

    setDataToGraph(object, objectData) {
        const { vocabulary } = this.props;
        const { v_chart_label_total } = vocabulary;
        let newObject = object;
        newObject.labels = objectData.labels;
        newObject.datasets[0].data = objectData.timeArr;
        newObject.datasets[0].label = v_chart_label_total;
        return newObject;
    }

    addDebounceToSearch = _.debounce(selection => {
        this.props.reportsPageAction('SET_TIME', { data: selection });
        this.applySearch(this.getYear(selection.startDate), this.getYear(selection.endDate));
    }, 1);

    handleSelect = (ranges, inputSearch = false) => {
        const { dateFormat } = this.props;
        // This code was used for detecting first/last date select (click) on calendar, remove it for if this feature will needed
        // but its still doesnt work correct (select side ranges)
        // const { focusedRange } = this.state;
        if (
            moment(ranges.selection.startDate).diff(moment([1919, 11, 18])) === 0
            // This code was used for detecting first/last date select (click) on calendar, remove it for if this feature will needed
            // but its still doesnt work correct (select side ranges)
            // ||
            // (!inputSearch && focusedRange[1] === 0)
        ) {
            this.setState({
                selectionRange: ranges.selection,
                startDateValue: moment(ranges.selection.startDate).format(dateFormat),
                endDateValue: moment(ranges.selection.endDate).format(dateFormat),
            });
            return;
        }
        this.setState(
            {
                selectionRange: ranges.selection,
                startDateValue: moment(ranges.selection.startDate).format(dateFormat),
                endDateValue: moment(ranges.selection.endDate).format(dateFormat),
            },
            () => {
                this.addDebounceToSearch(ranges.selection);
            }
        );
    };
    handleInputSearch = () => {
        const { startDateValue, endDateValue, selectionRange } = this.state;
        const { dateFormat } = this.props;
        const startDateFormatted = startDateValue.replace(/\D+/g, '');
        const endDateFormatted = endDateValue.replace(/\D+/g, '');

        if (
            startDateFormatted &&
            endDateFormatted &&
            endDateFormatted.length === 8 &&
            startDateFormatted.length === 8 &&
            moment(startDateValue, dateFormat)._isValid &&
            moment(endDateValue, dateFormat)._isValid
        ) {
            const newStartDate = new Date(moment(startDateValue, dateFormat));
            const newEndDate = new Date(moment(endDateValue, dateFormat));
            if (newStartDate <= newEndDate) {
                this.handleSelect(
                    {
                        selection: {
                            ...selectionRange,
                            startDate: newStartDate,
                            endDate: newEndDate,
                        },
                    },
                    true
                );
            }
        }
    };

    getYear(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    openCalendar() {
        if (!this.state.dateSelect) {
            this.setState({ dateSelect: true }, () => {
                document.addEventListener('click', this.closeDropdown);
            });
        }
    }

    toggleCalendar() {
        this.setState({ dateSelect: !this.state.dateSelect }, () => {
            if (this.state.dateSelect) {
                document.addEventListener('click', this.closeDropdown);
            } else {
                document.removeEventListener('click', this.closeDropdown);
            }
        });
    }

    closeDropdown = e => {
        if (this.datePickerSelect && !this.datePickerSelect.contains(e.target) && this.state.dateSelect) {
            this.setState(
                {
                    dateSelect: !this.state.dateSelect,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdown);
                }
            );
        }
    };

    render() {
        const {
            isMobile,
            vocabulary,
            currentTeam,
            dateFormat,
            firstDayOfWeek,
            durationTimeFormat,
            timeRange,
        } = this.props;
        const {
            v_summary_report,
            v_total,
            v_export,
            v_today,
            v_yesterday,
            v_thisWeek,
            v_lastWeek,
            v_thisMonth,
            v_lastMonth,
            v_this_year,
            v_last_year,
            v_days_up_to_today,
            v_days_starting_today,
            lang,
        } = vocabulary;

        const { isInitialFetching, isFetchingProjects, isFetchingList, startDateValue, endDateValue } = this.state;

        const customLocale = localeMap[lang.short];
        customLocale.options.weekStartsOn = firstDayOfWeek;
        return (
            <Loading flag={isInitialFetching} mode={'parentSize'} withLogo={false}>
                <div
                    className={classNames('wrapper_reports_page', {
                        'wrapper_reports_page--mobile': isMobile,
                    })}
                >
                    {(isFetchingProjects || isFetchingList) && <Spinner mode={'overlay'} withLogo={false} />}
                    <div className="data_container_reports_page">
                        <PageHeader title={v_summary_report}>
                            <div className="selects_container" ref={div => (this.datePickerSelect = div)}>
                                <div className="select_header">
                                    <span onClick={e => this.openCalendar()}>
                                        <InputMask
                                            className="select_input"
                                            onChange={e =>
                                                this.setState({ startDateValue: e.target.value, focusedRange: [0, 0] })
                                            }
                                            mask={dateFormat.toLowerCase()}
                                            formatChars={{ d: '[0-9]', m: '[0-9]', y: '[0-9]' }}
                                            value={startDateValue}
                                            alwaysShowMask={false}
                                            onKeyUp={e => {
                                                if (e.keyCode === 13) {
                                                    this.handleInputSearch();
                                                } else {
                                                    return;
                                                }
                                            }}
                                        />
                                        {'-'}
                                        <InputMask
                                            className="select_input"
                                            onChange={e =>
                                                this.setState({ endDateValue: e.target.value, focusedRange: [0, 0] })
                                            }
                                            mask={dateFormat.toLowerCase()}
                                            formatChars={{ d: '[0-9]', m: '[0-9]', y: '[0-9]' }}
                                            value={endDateValue}
                                            alwaysShowMask={false}
                                            onKeyUp={e => {
                                                if (e.keyCode === 13) {
                                                    this.handleInputSearch();
                                                } else {
                                                    return;
                                                }
                                            }}
                                        />
                                    </span>
                                    <i
                                        className={`arrow_down ${this.state.dateSelect ? 'arrow_down_up' : ''}`}
                                        onClick={e => this.toggleCalendar()}
                                    />
                                </div>
                                {this.state.dateSelect && (
                                    <div className="select_body">
                                        <DateRangePicker
                                            locale={customLocale}
                                            dateDisplayFormat={dateFormat}
                                            ranges={[
                                                {
                                                    startDate: this.state.selectionRange.startDate,
                                                    endDate: this.state.selectionRange.endDate,
                                                    key: 'selection',
                                                },
                                            ]}
                                            staticRanges={staticRanges(
                                                v_today,
                                                v_yesterday,
                                                v_thisWeek,
                                                v_lastWeek,
                                                v_thisMonth,
                                                v_lastMonth,
                                                v_this_year,
                                                v_last_year,
                                                firstDayOfWeek
                                            )}
                                            inputRanges={inputRanges(
                                                v_days_up_to_today,
                                                v_days_starting_today,
                                                firstDayOfWeek
                                            )}
                                            onChange={this.handleSelect}
                                            // This code was used for detecting first/last date select (click) on calendar, remove it for if this feature will needed
                                            // but its still doesnt work correct (select side ranges)
                                            // focusedRange={this.state.focusedRange}
                                            // onRangeFocusChange={dateRange => this.setState({ focusedRange: dateRange })}
                                        />
                                    </div>
                                )}
                            </div>
                        </PageHeader>
                        <div
                            className="content_wrapper"
                            style={this.props.projectsArr.length > 0 ? { paddingBottom: '150px' } : {}}
                        >
                            {(checkIsAdminByRole(currentTeam.data.role) ||
                                checkIsOwnerByRole(currentTeam.data.role)) && (
                                <ReportsSearchBar
                                    applySearch={e => this.applySearch()}
                                    inputProjectData={this.props.inputProjectData}
                                    inputUserData={this.props.inputUserData}
                                    reportsPageAction={this.props.reportsPageAction}
                                    inputClientData={this.props.clientsList}
                                />
                            )}
                            {this.props.projectsArr.length > 0 ? (
                                <UnitedReportsComponents
                                    toggleBar={this.state.toggleBar}
                                    toggleChar={this.state.toggleChar}
                                    v_total={v_total}
                                    totalUpChartTime={this.state.totalUpChartTime}
                                    getTimeDurationByGivenTimestamp={getTimeDurationByGivenTimestamp}
                                    durationTimeFormat={durationTimeFormat}
                                    export={this.export.bind(this)}
                                    v_export={v_export}
                                    data={this.props.dataBarChat}
                                    height={isMobile ? 150 : 50}
                                    lineChartOption={this.lineChartOption}
                                    selectionRange={timeRange}
                                    usersArr={this.props.inputUserData}
                                    projectsArr={this.props.projectsArr}
                                    userProjectsArr={this.props.userProjectsArr}
                                    dataDoughnutChat={this.props.dataDoughnutChat}
                                />
                            ) : (
                                BlankListComponent(this.props.vocabulary.v_no_report, null, { bottom: '-70px' })
                            )}
                        </div>
                    </div>
                </div>
            </Loading>
        );
    }

    checkYearPeriod = () => {
        const { selectionRange } = this.state;
        const { startDate, endDate } = selectionRange;
        const range = moment.range(startDate, endDate);
        const months = Array.from(range.by('month'));
        return months.length >= 12;
    };

    getLablesAndTime(labels, time) {
        const { dateFormat } = this.props;
        const deletedYearFromString = str => (str[0] === 'Y' ? str.slice(5, 10) : str.slice(0, 5));

        let finishData = {
            labels: [],
            timeArr: [],
        };
        if (this.checkYearPeriod()) {
            const toUpperCaseFirstLetter = str => str[0].toUpperCase() + str.slice(1);
            const { selectionRange } = this.state;
            const { startDate, endDate } = selectionRange;
            const range = moment.range(startDate, endDate);
            const months = Array.from(range.by('month')).map(m => toUpperCaseFirstLetter(m.format('MMMM')));
            finishData.labels = months;
        } else {
            for (let i = 0; i < labels.length; i++) {
                finishData.labels.push(moment(labels[i]).format(`ddd ${deletedYearFromString(dateFormat)}`));
            }
        }

        if (time.length) {
            this.setState({
                totalUpChartTime: time.reduce((a, b) => {
                    return a + b;
                }),
            });
        } else {
            this.setState({ totalUpChartTime: '00:00:00' });
        }

        finishData.timeArr = time;

        return finishData;
    }

    changeDoughnutChat(chartObject, dataFromServer) {
        let newObjectChart = Object.assign({}, chartObject);
        let labels = [];
        let dataTime = [];
        for (let i = 0; i < dataFromServer.length; i++) {
            labels.push(dataFromServer[i].name);
            dataTime.push(dataFromServer[i].duration);
        }
        newObjectChart.labels = labels;
        newObjectChart.datasets[0].data = dataTime;

        return newObjectChart;
    }

    getArrOfProjectsData(data) {
        const statsByProjects = [];
        const statsByDates = this.getDatesListBetweenStartEndDates(
            this.state.selectionRange.startDate,
            this.state.selectionRange.endDate
        );
        for (var i = 0; i < data.project_v2.length; i++) {
            const project = data.project_v2[i];
            let diff = 0;
            let newProjectsTimer = project.timer;
            for (var j = 0; j < newProjectsTimer.length; j++) {
                const timer = newProjectsTimer[j];
                const timerDiff = getDateTimestamp(timer.end_datetime) - getDateTimestamp(timer.start_datetime);
                diff += timerDiff;

                const date = timer.start_datetime.split('T')[0];
                statsByDates[date] += timerDiff;
            }

            if (diff) {
                statsByProjects.push({
                    name: project.name,
                    duration: diff,
                });
            }
        }

        return { statsByProjects, statsByDates };
    }

    getArrOfUserProjectsData(data) {
        const statsByUserProjects = [];
        data.project_v2.forEach(project => {
            let diff = [];
            project.timer.forEach(timer => {
                const timerDiff = getDateTimestamp(timer.end_datetime) - getDateTimestamp(timer.start_datetime);
                let diffIndex = diff.findIndex(item => item.email === timer.user.email);
                if (diffIndex === -1) {
                    diff.push({
                        username: timer.user.username,
                        email: timer.user.email,
                        value: 0,
                    });
                    diffIndex = diff.length - 1;
                }
                diff[diffIndex].value += timerDiff;
            });
            if (diff.length) {
                diff.forEach(user => {
                    let index = statsByUserProjects.findIndex(item => item.email === user.email);
                    if (index === -1) {
                        statsByUserProjects.push({
                            username: user.username,
                            email: user.email,
                            total: 0,
                            projects: [],
                        });
                        index = statsByUserProjects.length - 1;
                    }
                    statsByUserProjects[index].total += user.value;
                    statsByUserProjects[index].projects.push({
                        name: project.name,
                        duration: user.value,
                    });
                });
            }
        });
        return statsByUserProjects;
    }

    getDatesListBetweenStartEndDates(startDate, stopDate) {
        let dateObj = {};
        let currentDate = moment(startDate);
        stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
            dateObj[`${moment(currentDate).format('YYYY-MM-DD')}`] = 0;
            currentDate = moment(currentDate).add(1, 'days');
        }

        return dateObj;
    }

    getSumTimeEntriesByDay(datePeriod, timeEntries) {
        const sumTimeEntriesByDay = {};
        if (this.checkYearPeriod()) {
            const sumTimeEntriesByMonth = {};
            const copyTimeEntries = _.cloneDeep(timeEntries);
            const { selectionRange } = this.state;
            const { startDate, endDate } = selectionRange;
            const range = moment.range(startDate, endDate);
            const months = Array.from(range.by('month'));

            for (let i = 0; i < months.length; i++) {
                const date = months[i].format('YYYY-MM');
                sumTimeEntriesByMonth[date] = [];
            }

            copyTimeEntries.forEach(item => {
                sumTimeEntriesByMonth[moment(item.start_datetime).format('YYYY-MM')] &&
                    sumTimeEntriesByMonth[moment(item.start_datetime).format('YYYY-MM')].push(item);
            });
            const entries = Object.keys(sumTimeEntriesByMonth).map(item => {
                const taskArr = sumTimeEntriesByMonth[item];
                if (taskArr.length) {
                    return taskArr.reduce((acc, curr) => {
                        const { start_datetime: startDatetime, end_datetime: endDatetime } = curr;
                        const startDatetimeLocalISO = convertUTCDateToLocalISOString(startDatetime);
                        const endDatetimeLocalISO = convertUTCDateToLocalISOString(endDatetime);

                        const diff = getDateTimestamp(endDatetimeLocalISO) - getDateTimestamp(startDatetimeLocalISO);
                        return (acc += diff);
                    }, 0);
                } else {
                    return 0;
                }
            });
            return entries;
        } else {
            for (let i = 0; i < datePeriod.length; i++) {
                const date = datePeriod[i];
                sumTimeEntriesByDay[date] = 0;
            }

            if (!timeEntries) {
                return Object.keys(sumTimeEntriesByDay).map(date => sumTimeEntriesByDay[date]);
            }

            for (let i = 0; i < timeEntries.length; i++) {
                const { start_datetime: startDatetime, end_datetime: endDatetime } = timeEntries[i];
                const startDatetimeLocalISO = convertUTCDateToLocalISOString(startDatetime);
                const endDatetimeLocalISO = convertUTCDateToLocalISOString(endDatetime);

                const diff = getDateTimestamp(endDatetimeLocalISO) - getDateTimestamp(startDatetimeLocalISO);
                if (diff) {
                    sumTimeEntriesByDay[startDatetimeLocalISO.split('T')[0]] += diff;
                }
            }

            return Object.keys(sumTimeEntriesByDay).map(date => sumTimeEntriesByDay[date]);
        }
    }

    export() {
        const { user } = this.props;
        const { timezoneOffset } = user;

        let dateFrom = this.getYear(this.state.selectionRange.startDate),
            dateTo = this.getYear(this.state.selectionRange.endDate);
        let inputUserData =
            !!this.props.inputUserData && !!this.props.inputUserData.length
                ? getParametersString('userEmails', this.props.inputUserData)
                : '';
        let setProjectNames =
            !!this.props.inputProjectData && !!this.props.inputProjectData.length
                ? getParametersString('projectNames', this.props.inputProjectData)
                : '';
        apiCall(
            AppConfig.apiURL +
                `report/export?timezoneOffset=${timezoneOffset}&startDate=${convertDateToISOString(
                    dateFrom
                )}&endDate=${convertDateToShiftedISOString(dateTo, 24 * 60 * 60 * 1000)}${
                    inputUserData ? `&${inputUserData}` : ''
                }${setProjectNames ? `&${setProjectNames}` : ''}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then(
            result => this.saveFile(`${AppConfig.apiURL}${result.path}`),
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
    }

    saveFile(url) {
        const a = document.createElement('a');
        a.setAttribute('id', 'file-report-button');

        document.body.appendChild(a);
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);

        setTimeout(() => {
            a.remove();
        }, 200);
    }

    applySearch(
        dateFrom = this.getYear(this.state.selectionRange.startDate),
        dateTo = this.getYear(this.state.selectionRange.endDate)
    ) {
        this.setState({ isFetchingProjects: true, isFetchingList: true });
        let inputUserData =
            !!this.props.inputUserData && !!this.props.inputUserData.length
                ? getParametersString('userEmails', this.props.inputUserData)
                : '';
        let setProjectNames =
            !!this.props.inputProjectData && !!this.props.inputProjectData.length
                ? getParametersString('projectNames', this.props.inputProjectData)
                : '';
        apiCall(
            AppConfig.apiURL +
                `project/reports-projects?startDate=${convertDateToISOString(
                    dateFrom
                )}&endDate=${convertDateToShiftedISOString(dateTo, 24 * 60 * 60 * 1000)}${
                    inputUserData ? `&${inputUserData}` : ''
                }${setProjectNames ? `&${setProjectNames}` : ''}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then(
            result => {
                let data = result.data;
                const { project_v2: projectV2 } = data;
                this.setState({ projectsData: projectV2 });

                let dataToGraph = this.getArrOfProjectsData(data);
                this.props.reportsPageAction('SET_PROJECTS', { data: dataToGraph.statsByProjects });
                let statsByUserProjects = this.getArrOfUserProjectsData(data);
                this.props.reportsPageAction('SET_USER_PROJECTS', { data: statsByUserProjects });
                let obj = this.changeDoughnutChat(this.props.dataDoughnutChat, dataToGraph.statsByProjects);
                this.props.reportsPageAction('SET_DOUGHNUT_GRAPH', { data: obj });
                this.setState({ toggleChar: true, isInitialFetching: false, isFetchingProjects: false });
            },
            err => {
                this.setState({ isInitialFetching: false, isFetchingProjects: false });
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
        apiCall(
            AppConfig.apiURL +
                `timer/reports-list?startDate=${convertDateToISOString(
                    dateFrom
                )}&endDate=${convertDateToShiftedISOString(dateTo, 24 * 60 * 60 * 1000)}${
                    inputUserData ? `&${inputUserData}` : ''
                }${setProjectNames ? `&${setProjectNames}` : ''}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then(
            result => {
                let { timer_v2: timerV2 } = result.data;
                const datePeriod = Object.keys(
                    this.getDatesListBetweenStartEndDates(
                        this.state.selectionRange.startDate,
                        this.state.selectionRange.endDate
                    )
                );

                const sumTimeEntriesByDay = this.getSumTimeEntriesByDay(datePeriod, timerV2);

                this.props.reportsPageAction(
                    'SET_LINE_GRAPH',
                    this.setDataToGraph(this.props.dataBarChat, this.getLablesAndTime(datePeriod, sumTimeEntriesByDay))
                );
                this.setState({ toggleBar: true, isFetchingList: false });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
                this.setState({ isFetchingList: false });
            }
        );
    }

    componentDidMount() {
        const { timeRange, vocabulary, getClientsAction, dateFormat } = this.props;
        const { lang } = vocabulary;
        const { startDate, endDate } = timeRange;
        moment.locale(lang.short);
        this.setState({
            selectionRange: timeRange,
            startDateValue: moment(startDate).format(dateFormat),
            endDateValue: moment(endDate).format(dateFormat),
        });
        getClientsAction({
            order_by: 'company_name',
            sort: 'asc',
        });
        setTimeout(() => {
            this.applySearch(
                this.getYear(this.state.selectionRange.startDate),
                this.getYear(this.state.selectionRange.endDate)
            );
        }, 500);
    }
}

const mapStateToProps = store => ({
    dataBarChat: store.reportsPageReducer.dataBarChat,
    lineChartOption: store.reportsPageReducer.lineChartOption,
    projectsArr: store.reportsPageReducer.projectsArr,
    userProjectsArr: store.reportsPageReducer.userProjectsArr,
    dataDoughnutChat: store.reportsPageReducer.dataDoughnutChat,
    dataFromServer: store.reportsPageReducer.dataFromServer,
    timeRange: store.reportsPageReducer.timeRange,
    inputUserData: store.reportsPageReducer.inputUserData,
    inputProjectData: store.reportsPageReducer.inputProjectData,
    isMobile: store.responsiveReducer.isMobile,
    vocabulary: store.languageReducer.vocabulary,
    user: store.userReducer.user,
    currentTeam: store.teamReducer.currentTeam,
    dateFormat: store.userReducer.dateFormat,
    firstDayOfWeek: store.userReducer.firstDayOfWeek,
    durationTimeFormat: store.userReducer.durationTimeFormat,
    clientsList: store.clientsReducer.clientsList,
});

const mapDispatchToProps = dispatch => {
    return {
        reportsPageAction: (actionType, toggle) => dispatch(reportsPageAction(actionType, toggle))[1],
        getClientsAction: params => dispatch(getClientsAction(params)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportsPage);
