import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as moment from 'moment';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import * as rdrLocales from 'react-date-range/dist/locale';
import { DateRangePicker } from 'react-date-range';
import { format, addDays } from 'date-fns';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';

import './style.css';
import LeftBar from '../../components/LeftBar';
import ProjectsContainer from '../../components/ProjectsContainer';
import reportsPageAction from '../../actions/ReportsPageAction';
import { userLoggedIn, getUserAdminRight } from '../../services/authentication';
import ReportsSearchBar from '../../components/reportsSearchBar';
import { convertMS } from '../../services/timeService';
import { AppConfig } from '../../config';

class ReportsPage extends Component {
    state = {
        toggleBar: false,
        projectsArr: [],
        toggleChar: true,
        selectionRange: {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
        dateSelect: false,
        selectUsersHeader: '',
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
                    return convertMS(tooltipItem.yLabel);
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
                                                startDate: new Date(),
                                                endDate: new Date(),
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
                    {getUserAdminRight() === 'ROLE_ADMIN' && (
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
                    <div className="total_time_container">
                        <span className="total_time_name">Total</span>
                        <span className="total_time_time">
                            {typeof this.state.totalUpChartTime === 'number'
                                ? convertMS(this.state.totalUpChartTime)
                                : typeof this.state.totalUpChartTime}
                        </span>
                    </div>
                    <div className="line_chart_container">
                        {this.state.toggleBar && (
                            <Bar
                                ref={Bar => (this.barChart = Bar)}
                                data={this.props.dataBarChat}
                                height={50}
                                options={this.lineChartOption}
                            />
                        )}
                    </div>
                    <div className="projects_chart_container">
                        {this.state.toggleChar && (
                            <ProjectsContainer
                                selectionRange={this.props.timeRange}
                                activeEmail={this.state.selectUsersHeader}
                                allProjects={this.state.projectsArr}
                                projectsArr={this.props.projectsArr}
                                dataDoughnutChat={this.props.dataDoughnutChat}
                            />
                        )}
                    </div>
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
        this.setState({ toggleChar: false });
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
        this.setState({ toggleBar: false });
        const statsByProjects = [];
        const statsByDates = this.getDates(this.state.selectionRange.startDate, this.state.selectionRange.endDate);
        for (var i = 0; i < data.project_v2.length; i++) {
            const project = data.project_v2[i];
            let diff = 0;
            let newProjectsTimer = project.timer;
            for (var j = 0; j < newProjectsTimer.length; j++) {
                const timer = newProjectsTimer[j];
                const timerDiff = +new Date(timer.end_datetime) - +new Date(timer.start_datetime);
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

    getDates(startDate, stopDate) {
        let dateObj = {};
        let currentDate = moment(startDate);
        stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
            dateObj[`${moment(currentDate).format('YYYY-MM-DD')}`] = 0;
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateObj;
    }

    /**
     *
     * @param {*} date
     */
    convertLocalTimeToISODate(date) {
        return moment(date)
            .utc()
            .toISOString()
            .slice(0, -1);
    }

    /**
     *
     * @param {*} date
     * @param {*} shiftTimestamp
     */
    convertLocalTimeToShiftedISODate(date, shiftTimestamp) {
        return moment(date)
            .add(shiftTimestamp, 'ms')
            .utc()
            .toISOString()
            .slice(0, -1);
    }

    /**
     *
     * @param {*} date
     */
    convertISODateToLocalISOTime(date) {
        return moment(date)
            .subtract(new Date(date).getTimezoneOffset() * 60 * 1000)
            .utc()
            .toISOString()
            .slice(0, -1);
    }

    /**
     *
     * @param {*} date
     * @param {*} shiftTimestamp
     */
    convertISODateToShiftedLocalISOTime(date, shiftTimestamp) {
        return moment(date)
            .subtract(new Date(date).getTimezoneOffset() * 60 * 1000)
            .add(shiftTimestamp, 'ms')
            .utc()
            .toISOString()
            .slice(0, -1);
    }

    /**
     *
     * @param {*} date
     */
    getTimestamp(date) {
        return new Date(date).getTime();
    }

    getSumTimeEntriesByDay(period, data) {
        const sumTimeEntriesByDay = {};
        for (let i = 0; i < period.length; i++) {
            sumTimeEntriesByDay[period[i]] = 0;
        }

        if (!data) {
            return Object.keys(sumTimeEntriesByDay).map(date => sumTimeEntriesByDay[date]);
        }

        for (let i = 0; i < data.length; i++) {
            const startDatetimeTimestamp = this.getTimestamp(this.convertISODateToLocalISOTime(data[i].start_datetime));
            const endDatetimeTimestamp = this.getTimestamp(this.convertISODateToLocalISOTime(data[i].end_datetime));
            const diff = endDatetimeTimestamp - startDatetimeTimestamp;
            if (diff) {
                sumTimeEntriesByDay[this.convertISODateToLocalISOTime(data[i].start_datetime).split('T')[0]] += diff;
            }
        }

        return Object.keys(sumTimeEntriesByDay).map(date => sumTimeEntriesByDay[date]);
    }

    getDataUsers(
        dateFrom = this.getYear(this.state.selectionRange.startDate),
        dateTo = this.getYear(this.state.selectionRange.endDate)
    ) {
        function getPharametrs(name, arr) {
            let pharam = [];
            for (let i = 0; i < arr.length; i++) {
                pharam.push(`${name}[]=${arr[i]}`);
            }
            return pharam.join('&');
        }

        let setUser =
            !!this.props.setUser && !!this.props.setUser.length ? getPharametrs('userEmails', this.props.setUser) : '';
        let setProjectNames =
            !!this.props.selectedProjects && !!this.props.selectedProjects.length
                ? getPharametrs('projectNames', this.props.selectedProjects)
                : '';
        fetch(
            AppConfig.apiURL +
                `project/reports-projects?startDate=${this.convertLocalTimeToISODate(
                    dateFrom
                )}&endDate=${this.convertLocalTimeToShiftedISODate(dateTo, 24 * 60 * 60 * 1000 - 1)}${
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
                    this.setState({ projectsData: data.project_v2 });
                    let dataToGraph = this.getArrOfProjectsData(data);
                    this.props.reportsPageAction('SET_PROJECTS', { data: dataToGraph.statsByProjects });
                    this.setState({ toggleBar: true });
                    let obj = this.changeDoughnutChat(this.props.dataDoughnutChat, dataToGraph.statsByProjects);
                    this.props.reportsPageAction('SET_DOUGHNUT_GRAPH', { data: obj });
                    this.setState({ toggleChar: true });
                },
                err => err.text().then(errorMessage => {})
            );

        fetch(
            AppConfig.apiURL +
                `timer/reports-list?startDate=${this.convertLocalTimeToISODate(
                    dateFrom
                )}&endDate=${this.convertLocalTimeToShiftedISODate(dateTo, 24 * 60 * 60 * 1000 - 1)}${
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
                    let { timer_v2 } = result.data;
                    const period = Object.keys(
                        this.getDates(this.state.selectionRange.startDate, this.state.selectionRange.endDate)
                    );

                    const allSum = this.getSumTimeEntriesByDay(period, timer_v2);

                    this.props.reportsPageAction(
                        'SET_LINE_GRAPH',
                        this.setDataToGraph(this.props.dataBarChat, this.getLablesAndTime(period, allSum))
                    );
                },
                err => err.text().then(errorMessage => {})
            );
    }

    componentDidMount() {
        this.setState({ selectionRange: this.props.timeRange });
        this.setState({ selectUsersHeader: atob(localStorage.getItem('active_email')) });
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
                err => err.text().then(errorMessage => {})
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
