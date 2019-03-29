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
import {
    getDateAndTimeToGraphick,
    getProjectANndTimeToGraphick,
    getProjects,
    getUsers,
    getReports,
} from '../../queries';
import reportsPageAction from '../../actions/ReportsPageAction';
import { getTimeInSecondFromString, createArrTimeAndDate, changeDate } from '../../services/timeService';
import { checkAuthentication } from '../../services/authentication';
import { adminOrNot } from '../../services/authentication';
import { getUserId } from '../../services/authentication';
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
    };
    lineChartOption = {
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: false,
                        fontColor: '#BDBDBD',
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        color: '#BDBDBD',
                    },
                    ticks: {
                        beginAtZero: false,
                        fontColor: '#BDBDBD',
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
    };

    changeGraph(object) {
        let newObject = object;
        newObject.labels = changeDate(
            createArrTimeAndDate(this.props.dataFromServer, 'firstArr', 'date', 'timePassed')
        );
        newObject.datasets[0].data = createArrTimeAndDate(this.props.dataFromServer, 'secondArr', 'date', 'timePassed');

        return newObject;
    }

    setDataToGraph(object, objectData) {
        let newObject = object;
        newObject.labels = objectData.labels;
        newObject.datasets.data = objectData.timeArr;
        return newObject;
    }

    creatProJectsSumm(arr) {
        for (let i = 0; i < arr.length; i++) {}
    }

    getProjectsNamesById(data) {
        for (let i = 0; i < data.timeTracker.length; i++) {
            if (data.timeTracker[i].project === 'any') {
                alert('projects name error');
                return;
            }
            let projectId = +data.timeTracker[i].project;
            data.timeTracker[i].project = _.where(this.state.projectsArr, { id: projectId })[0].name;
            data.timeTracker[i].colorProject = _.where(this.state.projectsArr, { id: projectId })[0].colorProject;
            data.timeTracker[i].timePassed = getTimeInSecondFromString(data.timeTracker[i].timePassed);
        }

        return data;
    }

    getItemsFromArr(arr) {
        let finishArr = [];
        let projects = createArrTimeAndDate(arr, 'firstArr', 'project', 'timePassed');
        let time = createArrTimeAndDate(arr, 'secondArr', 'project', 'timePassed');
        for (let i = 0; i < projects.length; i++) {
            finishArr.push({ projects: projects[i], timePassed: time[i] });
        }

        return finishArr;
    }

    handleSelect = ranges => {
        this.setState({ selectionRange: ranges.selection });
        this.props.reportsPageAction('SET_TIME', { data: ranges.selection });
        this.getDataToGraph({
            from: this.getYear(ranges.selection.startDate),
            to: this.getYear(ranges.selection.endDate),
            email: atob(localStorage.getItem('active_email')),
        });
        this.getDataUsers(this.getYear(ranges.selection.startDate), this.getYear(ranges.selection.endDate));
    };

    getYear(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    selectUser(item) {
        this.setState({ selectUsersHeader: item });
        this.getDataToGraph({
            email: item,
            from: moment(this.props.timeRange.startDate).format('YYYY-MM-DD'),
            to: moment(this.props.timeRange.startDate.endDate).format('YYYY-MM-DD'),
        });
        this.openDateSelectUsers();
    }

    openCalendar() {
        this.setState({ dateSelect: !this.state.dateSelect });
    }

    openDateSelectUsers() {
        this.setState({ dateSelectUsers: !this.state.dateSelectUsers });
    }

    render() {
        return (
            <div className="wrapper_reports_page">
                {checkAuthentication()}
                <LeftBar />
                <div className="data_container_reports_page">
                    <div className="header">
                        <div className="header_name">Summary report</div>
                        {adminOrNot(localStorage.getItem('active_email')) && (
                            <div className="selects_container select_users">
                                <div className="select_header users" onClick={e => this.openDateSelectUsers()}>
                                    <span>{this.state.selectUsersHeader}</span>
                                    <i className="arrow_down" />
                                </div>
                                {this.state.dateSelectUsers && (
                                    <div className="select_body">
                                        {this.state.selectUersData.map(item => (
                                            <div className="select_users_item" onClick={e => this.selectUser(item)}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
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
                    <ReportsSearchBar users={this.state.selectUersData} />
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

    getArrOfDataAndArrOfLabels(data, key1, key2) {
        let finishData = {
            labels: [],
            timeArr: [],
        };
        for (let i = 0; i < data.length; i++) {
            let date = moment(data[i][key1]).format('dddd DD.MM.YYYY');
            let time = +moment(data[i][key2]) + moment(data[i][key1]);
            let item = finishData.labels.indexOf(date);
            if (item === -1) {
                finishData.labels.push(date);
                finishData.timeArr.push(time);
            } else {
                finishData.timeArr[item] += time;
            }
        }
        return finishData;
    }

    changeDoughnutChat(chartObject, dataFromServer) {
        this.setState({ toggleChar: false });
        let newObjectChart = chartObject;
        let labels = [];
        let dataTime = [];
        for (let i = 0; i < dataFromServer.length; i++) {
            let project = dataFromServer[i].project_id;
            let time = +moment(dataFromServer[i].end_datetime) - +moment(dataFromServer[i].start_datetime);
            let index = labels.indexOf(project);
            if (index === -1) {
                labels.push(project);
                dataTime.push(time);
            } else {
                dataTime[index] += time;
            }
        }
        newObjectChart.datasets[0].data = dataTime;
        return newObjectChart;
    }

    getDataUsers(dateFrom, dateTo) {
        this.setState({ toggleBar: false });
        client.request(getReports(getUserId(), undefined, dateFrom, dateTo)).then(data => {
            this.props.reportsPageAction(
                'SET_LINE_GRAPH',
                this.setDataToGraph(
                    this.props.dataBarChat,
                    this.getArrOfDataAndArrOfLabels(data.user[0].timer, 'start_datetime', 'end_datetime')
                )
            );
            let obj = this.changeDoughnutChat(this.props.dataDoughnutChat, data.user[0].timer);
            this.props.reportsPageAction('SET_DOUGHNUT_GRAPH', { data: obj });
            this.setState({ toggleBar: true });
            this.setState({ toggleChar: true });
        });
    }

    getDataToGraph(obj) {
        // client.request(getReport()).then(data => {})
        client.request(getProjects).then(data => {
            this.setState({ projectsArr: data.project });
            client.request(getDateAndTimeToGraphick(obj)).then(data => {
                for (let i = 0; i < data.timeTracker.length; i++) {
                    data.timeTracker[i].timePassed = getTimeInSecondFromString(data.timeTracker[i].timePassed);
                }
                this.props.reportsPageAction('SET_DATA_FROM_SERVER', { data: data.timeTracker });
                // this.props.reportsPageAction('SET_LINE_GRAPH', this.changeGraph(this.props.dataBarChat));
                this.setState({ toggleBar: true });
            });
            client.request(getProjectANndTimeToGraphick(obj)).then(data => {
                data = this.getProjectsNamesById(data);
                this.props.reportsPageAction('SET_PROJECTS', { data: this.getItemsFromArr(data.timeTracker) });
            });
        });
    }

    componentDidMount() {
        // this.getDataUsers()
        this.setState({ selectUsersHeader: atob(localStorage.getItem('active_email')) });
        this.getDataToGraph({
            email: atob(localStorage.getItem('active_email')),
            from: moment(this.props.timeRange.startDate).format('YYYY-MM-DD'),
            to: moment(this.props.timeRange.startDate.endDate).format('YYYY-MM-DD'),
        });
        client.request(getUsers()).then(data => {
            let arr = [];
            for (let i = 0; i < data.timeTracker.length; i++) {
                if (arr.indexOf(data.timeTracker[i].email) === -1) {
                    arr.push(data.timeTracker[i].email);
                }
            }
            this.setState({ selectUersData: arr });
        });
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
