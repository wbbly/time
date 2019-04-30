import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as moment from 'moment';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import * as rdrLocales from 'react-date-range/dist/locale';
import { DateRangePicker } from 'react-date-range';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';

import './style.css';
import LeftBar from '../../components/LeftBar';
import ProjectsContainer from '../../components/ProjectsContainer';
import reportsPageAction from '../../actions/ReportsPageAction';
import { userLoggedIn, checkIsAdmin } from '../../services/authentication';
import ReportsSearchBar from '../../components/reportsSearchBar';
import { getParametersString } from '../../services/apiService';
import {
    getTimeDurationByGivenTimestamp,
    convertDateToISOString,
    convertDateToShiftedISOString,
    convertUTCDateToLocalISOString,
    getCurrentDate,
    getDateTimestamp,
} from '../../services/timeService';
import { getUserTimezoneOffsetFromLocalStorage } from '../../services/userStorageService';
import { AppConfig } from '../../config';

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
        this.getDataUsers(this.getYear(ranges.selection.startDate), this.getYear(ranges.selection.endDate));
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
        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        return (
            <div className="wrapper_reports_page">
                <LeftBar />
                <div className="data_container_reports_page">
                    <div className="header">
                        <div className="header_name">Summary report</div>
                        <div className="selects_container">
                            <div className="select_header" onClick={e => this.openCalendar()}>
                                <span>
                                    {moment(this.props.timeRange.startDate).format('DD.MM.YYYY')} {' - '}
                                    {moment(this.props.timeRange.endDate).format('DD.MM.YYYY')}
                                </span>
                                <i className="arrow_down" />
                            </div>
                            {this.state.dateSelect && (
                                <div className="select_body" ref={div => (this.datePickerSelect = div)}>
                                    <DateRangePicker
                                        locale={rdrLocales['enGB']}
                                        ranges={[
                                            {
                                                startDate: getCurrentDate(),
                                                endDate: getCurrentDate(),
                                                key: 'selection',
                                                firstDayOfWeek: 1,
                                            },
                                        ]}
                                        onChange={this.handleSelect}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {checkIsAdmin() && (
                        <ReportsSearchBar
                            settedDate={{
                                startDate: this.state.selectionRange.startDate,
                                endDate: this.state.selectionRange.endDate,
                            }}
                            projectsData={this.state.projectsData}
                            getDataUsers={e => this.getDataUsers()}
                            selectedProjects={this.props.selectedProjects}
                            setUser={this.props.setUser}
                            reportsPageAction={this.props.reportsPageAction}
                        />
                    )}
                    {this.state.toggleBar && this.state.toggleChar && (
                        <div className="total_time_container">
                            <span className="total_time_name">Total</span>
                            <span className="total_time_time">
                                {typeof this.state.totalUpChartTime === 'number'
                                    ? getTimeDurationByGivenTimestamp(this.state.totalUpChartTime)
                                    : '00:00:00'}
                            </span>
                            <span className="export_button" onClick={e => this.export()}>
                                Export
                            </span>
                        </div>
                    )}
                    {this.state.toggleBar && this.state.toggleChar && (
                        <div className="line_chart_container">
                            <Bar
                                ref={Bar => (this.barChart = Bar)}
                                data={this.props.dataBarChat}
                                height={50}
                                options={this.lineChartOption}
                            />
                        </div>
                    )}
                    {this.state.toggleBar && this.state.toggleChar && (
                        <div className="projects_chart_container">
                            <ProjectsContainer
                                selectionRange={this.props.timeRange}
                                usersArr={this.props.setUser}
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
        const timezoneOffset = getUserTimezoneOffsetFromLocalStorage();
        let dateFrom = this.getYear(this.state.selectionRange.startDate),
            dateTo = this.getYear(this.state.selectionRange.endDate);
        let setUser =
            !!this.props.setUser && !!this.props.setUser.length
                ? getParametersString('userEmails', this.props.setUser)
                : '';
        let setProjectNames =
            !!this.props.selectedProjects && !!this.props.selectedProjects.length
                ? getParametersString('projectNames', this.props.selectedProjects)
                : '';
        fetch(
            AppConfig.apiURL +
                `report/export?timezoneOffset=${timezoneOffset}&startDate=${convertDateToISOString(
                    dateFrom
                )}&endDate=${convertDateToShiftedISOString(dateTo, 24 * 60 * 60 * 1000)}${
                    setUser ? `&${setUser}` : ''
                }${setProjectNames ? `&${setProjectNames}` : ''}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
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

    getDataUsers(
        dateFrom = this.getYear(this.state.selectionRange.startDate),
        dateTo = this.getYear(this.state.selectionRange.endDate)
    ) {
        let setUser =
            !!this.props.setUser && !!this.props.setUser.length
                ? getParametersString('userEmails', this.props.setUser)
                : '';
        let setProjectNames =
            !!this.props.selectedProjects && !!this.props.selectedProjects.length
                ? getParametersString('projectNames', this.props.selectedProjects)
                : '';
        fetch(
            AppConfig.apiURL +
                `project/reports-projects?startDate=${convertDateToISOString(
                    dateFrom
                )}&endDate=${convertDateToShiftedISOString(dateTo, 24 * 60 * 60 * 1000)}${
                    setUser ? `&${setUser}` : ''
                }${setProjectNames ? `&${setProjectNames}` : ''}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
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

        fetch(
            AppConfig.apiURL +
                `timer/reports-list?startDate=${convertDateToISOString(
                    dateFrom
                )}&endDate=${convertDateToShiftedISOString(dateTo, 24 * 60 * 60 * 1000)}${
                    setUser ? `&${setUser}` : ''
                }${setProjectNames ? `&${setProjectNames}` : ''}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
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
                        this.setDataToGraph(
                            this.props.dataBarChat,
                            this.getLablesAndTime(datePeriod, sumTimeEntriesByDay)
                        )
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
        this.setState({ selectionRange: this.props.timeRange });
        fetch(AppConfig.apiURL + `user/list`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                result => {
                    let data = result.data;
                    this.setState({ selectUersData: data.user });
                    this.setState({ selectUersDataEtalon: data.user });
                    setTimeout(() => {
                        this.getDataUsers(
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

const mapStateToProps = store => {
    return {
        dataBarChat: store.reportsPageReducer.dataBarChat,
        lineChartOption: store.reportsPageReducer.lineChartOption,
        projectsArr: store.reportsPageReducer.projectsArr,
        dataDoughnutChat: store.reportsPageReducer.dataDoughnutChat,
        dataFromServer: store.reportsPageReducer.dataFromServer,
        timeRange: store.reportsPageReducer.timeRange,
        setUser: store.reportsPageReducer.setUser,
        selectedProjects: store.reportsPageReducer.selectedProjects,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reportsPageAction: (actionType, toggle) => dispatch(reportsPageAction(actionType, toggle))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportsPage);
