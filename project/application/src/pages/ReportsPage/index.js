import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as moment from 'moment';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import * as rdrLocales from 'react-date-range/dist/locale';
import { DateRangePicker, defaultStaticRanges, createStaticRanges } from 'react-date-range';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';

import { showMobileSupportToastr } from '../../App';

// dependencies
import classNames from 'classnames';

// Services
import { userLoggedIn, checkIsAdmin } from '../../services/authentication';
import { getParametersString } from '../../services/apiService';
import {
    getTimeDurationByGivenTimestamp,
    convertDateToISOString,
    convertDateToShiftedISOString,
    convertUTCDateToLocalISOString,
    getCurrentDate,
    getDateTimestamp,
} from '../../services/timeService';
import { getLoggedUserTimezoneOffset } from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';
import { changeDisplayingDateFormat, getFirstDayOfWeek } from '../../services/formatService';

// Components
import ProjectsContainer from '../../components/ProjectsContainer';
import ReportsSearchBar from '../../components/reportsSearchBar';

// Actions
import reportsPageAction from '../../actions/ReportsPageAction';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';



import {
    addDays,
    endOfDay,
    startOfDay,
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfWeek,
    endOfWeek,
    isSameDay,
    differenceInCalendarDays,
} from 'date-fns';

class ReportsPage extends Component {
    state = {
        toggleBar: false,
        toggleChar: false,
        projectsArr: [],
        selectionRange: {
            startDate: getCurrentDate(),
            endDate: getCurrentDate(),
            key: 'selection',
        },
        dateSelect: false,
        dateSelectUsers: false,
        selectUersData: [],
        selectUersDataEtalon: [],
        projectsData: [],
        totalUpChartTime: '',
    };
    lineChartOption = {
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
                    return getTimeDurationByGivenTimestamp(tooltipItem.yLabel);
                },
            },
        },
    };

    setDataToGraph(object, objectData) {
        let newObject = object;
        newObject.labels = objectData.labels;
        newObject.datasets[0].data = objectData.timeArr;

        return newObject;
    }

    handleSelect = ranges => {
        this.setState({ selectionRange: ranges.selection });
        this.props.reportsPageAction('SET_TIME', { data: ranges.selection });
        this.applySearch(this.getYear(ranges.selection.startDate), this.getYear(ranges.selection.endDate));
    };

    getYear(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    openCalendar() {
        this.setState({ dateSelect: !this.state.dateSelect });
        document.addEventListener('click', this.closeDropdown);
    }

    closeDropdown = e => {
        if (this.datePickerSelect && !this.datePickerSelect.contains(e.target)) {
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
        const { isMobile, vocabulary } = this.props;
        const { v_summary_report, v_total, v_export } = vocabulary;
        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        const defineds = {
            startOfWeek: startOfWeek(new Date(), {weekStartsOn: getFirstDayOfWeek(this.props.format.startOfWeek)}),
            endOfWeek: endOfWeek(new Date(), {weekStartsOn: getFirstDayOfWeek(this.props.format.startOfWeek)}),
            startOfLastWeek: startOfWeek(addDays(new Date(), -7), {weekStartsOn: getFirstDayOfWeek(this.props.format.startOfWeek)}),
            endOfLastWeek: endOfWeek(addDays(new Date(), -7),{weekStartsOn: getFirstDayOfWeek(this.props.format.startOfWeek)}),
            startOfToday: startOfDay(new Date()),
            endOfToday: endOfDay(new Date()),
            startOfYesterday: startOfDay(addDays(new Date(), -1)),
            endOfYesterday: endOfDay(addDays(new Date(), -1)),
            startOfMonth: startOfMonth(new Date()),
            endOfMonth: endOfMonth(new Date()),
            startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
            endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
        };

        const staticRanges = [
            ...createStaticRanges([
                {
                    label: 'Today',
                    range: () => ({
                        startDate: defineds.startOfToday,
                        endDate: defineds.endOfToday,
                    }),
                },
                {
                    label: 'Yesterday',
                    range: () => ({
                        startDate: defineds.startOfYesterday,
                        endDate: defineds.endOfYesterday,
                    }),
                },

                {
                    label: 'This Week',
                    range: () => ({
                        startDate: defineds.startOfWeek,
                        endDate: defineds.endOfWeek,
                    }),
                },
                {
                    label: 'Last Week',
                    range: () => ({
                        startDate: defineds.startOfLastWeek,
                        endDate: defineds.endOfLastWeek,
                    }),
                },
                {
                    label: 'This Month',
                    range: () => ({
                        startDate: defineds.startOfMonth,
                        endDate: defineds.endOfMonth,
                    }),
                },
                {
                    label: 'Last Month',
                    range: () => ({
                        startDate: defineds.startOfLastMonth,
                        endDate: defineds.endOfLastMonth,
                    }),
                },
            ])
        ];

        return (
            <div
                className={classNames('wrapper_reports_page', {
                    'wrapper_reports_page--mobile': isMobile,
                })}
            >
                <div className="data_container_reports_page">
                    <div className="header">
                        <div className="header_name">{v_summary_report}</div>
                        <div className="selects_container">
                            <div className="select_header" onClick={e => this.openCalendar()}>
                                <span>
                                    {changeDisplayingDateFormat(
                                        this.props.timeRange.startDate,
                                        this.props.format.dateFormat
                                    )}{' '}
                                    {' - '}
                                    {changeDisplayingDateFormat(
                                        this.props.timeRange.endDate,
                                        this.props.format.dateFormat
                                    )}
                                </span>
                                <i className="arrow_down" />
                            </div>
                            {this.state.dateSelect && (
                                <div className="select_body" ref={div => (this.datePickerSelect = div)}>
                                    <DateRangePicker
                                        dateDisplayFormat={this.props.format.dateFormat}
                                        locale={rdrLocales[getFirstDayOfWeek(this.props.format.startOfWeek) === 0 ? 'enUS' : 'enGB']}
                                        firstDayOfWeek={'1'}
                                        // enUS enGB
                                        ranges={[
                                            {
                                                startDate: this.state.selectionRange.startDate,
                                                endDate: this.state.selectionRange.endDate,
                                                key: 'selection',
                                            },
                                        ]}
                                        staticRanges = { staticRanges }
                                        onChange={this.handleSelect}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {checkIsAdmin() && (
                        <ReportsSearchBar
                            applySearch={e => this.applySearch()}
                            inputProjectData={this.props.inputProjectData}
                            inputUserData={this.props.inputUserData}
                            reportsPageAction={this.props.reportsPageAction}
                        />
                    )}
                    {this.state.toggleBar &&
                        this.state.toggleChar && (
                            <div className="total_time_container">
                                <span className="total_time_name">{v_total}</span>
                                <span className="total_time_time">
                                    {typeof this.state.totalUpChartTime === 'number'
                                        ? getTimeDurationByGivenTimestamp(
                                              this.state.totalUpChartTime,
                                              this.props.format.timeFormat
                                          )
                                        : '00:00:00'}

                                </span>
                                <span className="export_button" onClick={e => this.export()}>
                                    {v_export}
                                </span>
                            </div>
                        )}
                    {this.state.toggleBar &&
                        this.state.toggleChar && (
                            <div className="line_chart_container">
                                <Bar
                                    ref={Bar => (this.barChart = Bar)}
                                    data={this.props.dataBarChat}
                                    height={50}
                                    options={this.lineChartOption}
                                />
                            </div>
                        )}
                    {this.state.toggleBar &&
                        this.state.toggleChar && (
                            <div className="projects_chart_container">
                                <ProjectsContainer
                                    selectionRange={this.props.timeRange}
                                    usersArr={this.props.inputUserData}
                                    projectsArr={this.props.projectsArr}
                                    dataDoughnutChat={this.props.dataDoughnutChat}
                                />
                            </div>
                        )}
                </div>
            </div>
        );
    }

    getLablesAndTime(labels, time) {
        let finishData = {
            labels: [],
            timeArr: [],
        };
        for (let i = 0; i < labels.length; i++) {
            finishData.labels.push(moment(labels[i]).format('ddd DD.MM'));
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
        let newObjectChart = chartObject;
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

    export() {
        const timezoneOffset = getLoggedUserTimezoneOffset();
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

                let obj = this.changeDoughnutChat(this.props.dataDoughnutChat, dataToGraph.statsByProjects);
                this.props.reportsPageAction('SET_DOUGHNUT_GRAPH', { data: obj });
                this.setState({ toggleChar: true });
            },
            err => {
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
                this.setState({ toggleBar: true });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
    }

    componentDidMount() {
        showMobileSupportToastr();
        this.setState({ selectionRange: this.props.timeRange });
        apiCall(AppConfig.apiURL + `user/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let data = result.data;
                this.setState({ selectUersData: data.user });
                this.setState({ selectUersDataEtalon: data.user });
                setTimeout(() => {
                    this.applySearch(
                        this.getYear(this.state.selectionRange.startDate),
                        this.getYear(this.state.selectionRange.endDate)
                    );
                }, 500);
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
    }
}

const mapStateToProps = store => ({
    dataBarChat: store.reportsPageReducer.dataBarChat,
    lineChartOption: store.reportsPageReducer.lineChartOption,
    projectsArr: store.reportsPageReducer.projectsArr,
    dataDoughnutChat: store.reportsPageReducer.dataDoughnutChat,
    dataFromServer: store.reportsPageReducer.dataFromServer,
    timeRange: store.reportsPageReducer.timeRange,
    inputUserData: store.reportsPageReducer.inputUserData,
    inputProjectData: store.reportsPageReducer.inputProjectData,
    isMobile: store.responsiveReducer.isMobile,
    vocabulary: store.languageReducer.vocabulary,
    format: store.formatDateTimeReducer,
});

const mapDispatchToProps = dispatch => {
    return {
        reportsPageAction: (actionType, toggle) => dispatch(reportsPageAction(actionType, toggle))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportsPage);
