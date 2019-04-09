import React, { Component } from 'react';
import * as _ from 'underscore';
import * as moment from 'moment';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';

import './style.css';
import LeftBar from '../../components/LeftBar';
import ProjectsContainer from '../../components/ProjectsContainer';
import { client } from '../../requestSettings';
import { getUsers, getReports, getDatafromTimerTableToReport } from '../../queries';
import reportsPageAction from '../../actions/ReportsPageAction';
import { checkAuthentication, getUserAdminRight } from '../../services/authentication';
import ReportsSearchBar from '../../components/reportsSearchBar';

class ReportsPage extends Component {
    state = {
        toggleBar: false,
        projectsArr: [],
        toggleChar: false,
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
                    return moment(tooltipItem.yLabel)
                        .utc()
                        .format('HH:mm:ss');
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
    }

    render() {
        return (
            <div className="wrapper_reports_page">
                {checkAuthentication()}
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
                                <div className="select_body">
                                    <DateRangePicker ranges={[this.props.timeRange]} onChange={this.handleSelect} />
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
                            setUser={this.props.setUser}
                            reportsPageAction={this.props.reportsPageAction}
                        />
                    )}
                    <div className="line_chart_container">
                        {this.state.toggleBar && (
                            <Bar data={this.props.dataBarChat} height={50} options={this.lineChartOption} />
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
            finishData.labels.push(moment(labels[i]).format('ddd DD.MM.YYYY'));
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

    getDataUsers(
        dateFrom = this.getYear(this.state.selectionRange.startDate),
        dateTo = this.getYear(this.state.selectionRange.endDate)
    ) {
        this.setState({ toggleBar: false });
        client.request(getReports(this.props.setUser.id, (this.props.selectedProjects.length)?  this.props.selectedProjects : undefined, dateFrom, dateTo)).then(data => {
            this.setState({ projectsData: data.project_v2 });
            let dataToGraph = this.getArrOfProjectsData(data);
            this.props.reportsPageAction('SET_PROJECTS', { data: dataToGraph.statsByProjects });
            let obj = this.changeDoughnutChat(this.props.dataDoughnutChat, dataToGraph.statsByProjects);
            this.props.reportsPageAction('SET_DOUGHNUT_GRAPH', { data: obj });
            this.setState({ toggleBar: true });
            this.setState({ toggleChar: true });
        });
        client.request(getDatafromTimerTableToReport(this.props.setUser.id, dateFrom, dateTo)).then(data => {
            let { timer_v2 } = data;
            const statsByDates = Object.keys(
                this.getDates(this.state.selectionRange.startDate, this.state.selectionRange.endDate)
            );
            const period = [];
            let allSum = [];
            for (let i = 0; i < statsByDates.length; i++) {
                period.push({
                    startTime: new Date(`${statsByDates[i]} 00:00:00`).getTime(),
                    endTime: new Date(`${statsByDates[i]} 23:59:59`).getTime(),
                });
            }
            for (let i = 0; i < period.length; i++) {
                let day = period[i];
                var { sum, dataModified } = dayProcess(day.startTime, day.endTime, timer_v2);
                allSum.push(sum);
                // console.log( dataModified, 'dataModified');
                timer_v2 = dataModified;
            }
            this.props.reportsPageAction(
                'SET_LINE_GRAPH',
                this.setDataToGraph(this.props.dataBarChat, this.getLablesAndTime(statsByDates, allSum))
            );

            function dayProcess(startTime, endTime, data) {
                if (!data) {
                    return { sum: 0, dataModified: data };
                }
                let sum = 0;

                const dataModified = [];
                for (let i = 0; i < data.length; i++) {
                    dataModified.push(data[i]);
                    if (
                        getTimestamp(data[i].start_datetime) >= startTime &&
                        getTimestamp(data[i].end_datetime) <= endTime
                    ) {
                        console.log(
                            getTimestamp(data[i].start_datetime) >= startTime,
                            getTimestamp(data[i].start_datetime) <= endTime,
                            getTimestamp(data[i].end_datetime) > endTime
                        );
                        sum += getTimestamp(data[i].end_datetime) - getTimestamp(data[i].start_datetime);
                    } else if (
                        getTimestamp(data[i].start_datetime) >= startTime &&
                        getTimestamp(data[i].start_datetime) <= endTime &&
                        getTimestamp(data[i].end_datetime) > endTime
                    ) {
                        console.log('111');
                        sum += getTimestamp(endTime) - getTimestamp(data[i].start_datetime);
                        dataModified.splice(
                            i,
                            1,
                            ...[
                                { start_datetime: dataModified[i].start_datetime, end_datetime: endTime },
                                { start_datetime: endTime + 1000, end_datetime: dataModified[i].end_datetime },
                            ]
                        );
                    }
                }

                return { sum, dataModified };
            }
            function getTimestamp(date) {
                return new Date(date).getTime();
            }
        });
    }

    componentDidMount() {
        this.getDataUsers(
            this.getYear(this.state.selectionRange.startDate),
            this.getYear(this.state.selectionRange.endDate)
        );

        this.setState({ selectUsersHeader: atob(localStorage.getItem('active_email')) });
        client.request(getUsers()).then(data => {
            this.setState({ selectUersData: data.user });
            this.setState({ selectUersDataEtalon: data.user });
        });
    }
}

const mapStateToProps = store => {
    console.log(store.reportsPageReducer.selectedProjects, '1212');
    return {
        dataBarChat: store.reportsPageReducer.dataBarChat,
        lineChartOption: store.reportsPageReducer.lineChartOption,
        projectsArr: store.reportsPageReducer.projectsArr,
        dataDoughnutChat: store.reportsPageReducer.dataDoughnutChat,
        dataFromServer: store.reportsPageReducer.dataFromServer,
        timeRange: store.reportsPageReducer.timeRange,
        setUser: store.reportsPageReducer.setUser,
        selectedProjects: store.reportsPageReducer.selectedProjects
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
