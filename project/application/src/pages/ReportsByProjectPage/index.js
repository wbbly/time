import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';

// dependencies
import classNames from 'classnames';

// Services
import {
    getTimeDurationByGivenTimestamp,
    convertDateToISOString,
    convertDateToShiftedISOString,
} from '../../services/timeService';
import { decodeTimeEntryIssue } from '../../services/timeEntryService';
import { getParametersString } from '../../services/apiService';
import { apiCall } from '../../services/apiService';

// Components
import ReportsByProjectSearchBar from '../../components/ReportsByProjectSearchBar';
import { ThemeProvider } from '@material-ui/styles';
import { Checkbox, FormControlLabel, createMuiTheme } from '@material-ui/core';

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';
import CustomScrollbar from '../../components/CustomScrollbar';

const checkboxTheme = createMuiTheme({
    overrides: {
        MuiSvgIcon: {
            root: {
                fontSize: '24px',
                color: '#fff',
            },
        },
        MuiCheckbox: {
            root: {
                padding: '5px',
            },
            checked: {
                color: '#fff',
            },
        },
        MuiIconButton: {
            colorPrimary: {
                color: '#fff',
                '&:hover': {
                    backgroundColor: 'transparent !important',
                },
            },
        },
        MuiFormControlLabel: {
            label: {
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '16px',
            },
        },
    },
});

class ReportsByProjectsPage extends Component {
    state = {
        dataOfProject: [],
        totalTime: 0,
        countTasks: 0,
        userEmailsList: [],
        projectName: '',
        dateStart: '',
        endDate: '',
        reportUsers: [],
        isCombine: false,
    };

    getDateInPointsFormat(momentDate) {
        return momentDate
            .split('-')
            .reverse()
            .join('.');
    }

    getSlash(item) {
        return item || '-';
    }

    getTotalTime(arr) {
        let totalTime = 0;
        for (let i = 0; i < arr.length; i++) {
            totalTime += arr[i].durationTimestamp;
        }

        return totalTime;
    }

    onCombineChange = event => {
        this.setState({ isCombine: event.target.checked });
    };

    render() {
        const { isMobile, dateFormat, durationTimeFormat, vocabulary } = this.props;
        const { v_issue, v_user_name, v_time, v_sum_tasks, v_sum_time, v_combine } = vocabulary;

        let projectsItems = this.state.dataOfProject.map((item, index) => (
            <div className="tasks_data" key={'projects_container_project_data' + index}>
                <div className="name">{this.getSlash(item.issue)}</div>
                <div className="username">{item.user.username}</div>
                <div className="time">
                    {moment(item.startDatetime).format(dateFormat)} |{' '}
                    {getTimeDurationByGivenTimestamp(item.durationTimestamp, durationTimeFormat)}
                </div>
            </div>
        ));
        let projectsItemsMobile = this.state.dataOfProject.map((item, index) => (
            <div className="tasks_data--mobile" key={'projects_container_project_data' + index}>
                <div className="reports-by-project-list">
                    <span className="project-list-title">{v_issue}:</span>
                    <span>{this.getSlash(item.issue)}</span>
                </div>
                <div className="reports-by-project-list">
                    <span className="project-list-title">{v_user_name}:</span>
                    <span>{item.user.username}</span>
                </div>
                <div className="reports-by-project-list">
                    <span className="project-list-title">{v_time}:</span>
                    <span>
                        {moment(item.startDatetime).format(dateFormat)} |{' '}
                        {getTimeDurationByGivenTimestamp(item.durationTimestamp, durationTimeFormat)}
                    </span>
                </div>
            </div>
        ));

        return (
            <div
                className={classNames('reports_by_projects_wrapper', {
                    'reports_by_projects_wrapper--mobile': isMobile,
                })}
            >
                <div className="header">
                    <div className="header_name">
                        <span>
                            {this.props.match.params.projectName}
                            :&nbsp;
                        </span>
                        <span>
                            {moment(this.props.match.params.dateStart).format(dateFormat)}
                            {' - '} {moment(this.props.match.params.endDate).format(dateFormat)}
                        </span>
                    </div>
                    <div className="header_name header_name--task">
                        <div className="tasks_sum">
                            {v_sum_tasks}: {this.state.countTasks}
                        </div>
                        <ThemeProvider theme={checkboxTheme}>
                            <FormControlLabel
                                label={v_combine}
                                control={
                                    <Checkbox
                                        disableRipple
                                        color={'primary'}
                                        checked={this.state.isCombine}
                                        onChange={this.onCombineChange}
                                    />
                                }
                            />
                        </ThemeProvider>
                    </div>
                    <div className="header_name header_name--time">
                        {v_sum_time}: {getTimeDurationByGivenTimestamp(this.state.totalTime, durationTimeFormat)}
                    </div>
                </div>
                <ReportsByProjectSearchBar
                    reportUsers={this.state.reportUsers}
                    applySearch={this.applySearch}
                    userEmailsList={this.state.userEmailsList}
                />
                {!isMobile ? (
                    <div className="tasks_wrapper">
                        <div className="tasks_header">
                            <div className="name">{v_issue}</div>
                            <div className="username">{v_user_name}</div>
                            <div className="time">{v_time}</div>
                        </div>
                        <CustomScrollbar>
                            <div className="tasks_data_container">{projectsItems}</div>
                        </CustomScrollbar>
                    </div>
                ) : (
                    <div className="tasks_data_wrap">
                        <CustomScrollbar>
                            <div className="tasks_data_container--mobile">{projectsItemsMobile}</div>
                        </CustomScrollbar>
                    </div>
                )}
            </div>
        );
    }

    applySearch = (userEmailsList = [], searchValue = '') => {
        let { projectName, dateStart, endDate, isCombine } = this.state;
        apiCall(
            AppConfig.apiURL +
                `project/reports-project?projectName=${projectName || ''}&startDate=${convertDateToISOString(
                    dateStart
                )}&endDate=${convertDateToShiftedISOString(endDate, 24 * 60 * 60 * 1000)}${
                    userEmailsList.length ? `&${getParametersString('userEmails', userEmailsList)}` : ''
                }${searchValue.length ? `&searchValue=${searchValue}` : ''}${
                    isCombine ? `&combined=${isCombine}` : ''
                }`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then(
            result => {
                let data = result.data;
                for (let i = 0; i < data.project_v2.length; i++) {
                    const project = data.project_v2[i];
                    for (let j = 0; j < project.timer.length; j++) {
                        const timeEntry = project.timer[j];
                        timeEntry.issue = decodeTimeEntryIssue(timeEntry.issue);
                    }
                }

                const timer = data.project_v2.length ? data.project_v2[0].timer : [];
                const uniqueUsersArray = timer
                    .filter((item, index) => {
                        const _item = item.user.id;
                        return index === timer.findIndex(obj => obj.user.id === _item);
                    })
                    .map(item => item.user);
                this.setState({
                    dataOfProject: timer,
                    totalTime: this.getTotalTime(timer),
                    countTasks: timer.length,
                    reportUsers: uniqueUsersArray,
                });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
    };

    componentDidMount() {
        let { userEmails, projectName, dateStart, endDate } = this.props.match.params;
        userEmails = userEmails.indexOf('all') > -1 ? '' : userEmails;
        const userEmailsList = userEmails.length ? userEmails.split(',') : [];
        this.setState({ userEmailsList, projectName, dateStart, endDate }, () => {
            this.applySearch(userEmailsList, '');
        });
    }
}

const mapStateToProps = store => ({
    inputUserData: store.reportsPageReducer.inputUserData,
    isMobile: store.responsiveReducer.isMobile,
    dateFormat: store.userReducer.dateFormat,
    durationTimeFormat: store.userReducer.durationTimeFormat,
    vocabulary: store.languageReducer.vocabulary,
});

export default withRouter(connect(mapStateToProps)(ReportsByProjectsPage));
