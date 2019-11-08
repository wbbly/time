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

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class ReportsByProjectsPage extends Component {
    state = {
        dataOfProject: [],
        totalTime: 0,
        countTasks: 0,
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

    render() {
        const { isMobile, dateFormat, durationTimeFormat, vocabulary } = this.props;
        const { v_issue, v_user_name, v_time, v_sum_tasks, v_sum_time } = vocabulary;

        let projectsItems = this.state.dataOfProject.map((item, index) => (
            <div className="projects_container_project_data" key={'projects_container_project_data' + index}>
                <div className="name">{this.getSlash(item.issue)}</div>
                <div className="username">{item.user.username}</div>
                <div className="time">
                    {moment(item.startDatetime).format(dateFormat)} |{' '}
                    {getTimeDurationByGivenTimestamp(item.durationTimestamp, durationTimeFormat)}
                </div>
            </div>
        ));
        let projectsItemsMobile = this.state.dataOfProject.map((item, index) => (
            <div className="projects_container_project_data" key={'projects_container_project_data' + index}>
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
                    <div className="header_name">
                        {v_sum_tasks}: {this.state.countTasks}
                    </div>
                    <div className="header_name">
                        {v_sum_time}: {getTimeDurationByGivenTimestamp(this.state.totalTime, durationTimeFormat)}
                    </div>
                </div>
                {!isMobile ? (
                    <div className="projects_container_wrapper">
                        <div className="projects_container_projects">
                            <div className="projects_header">
                                <div className="name">{v_issue}</div>
                                <div className="username">{v_user_name}</div>
                                <div className="time">{v_time}</div>
                            </div>
                            <div className="projects_container_project_data_container">{projectsItems}</div>
                        </div>
                    </div>
                ) : (
                    <div className="projects_container_project_data_container">{projectsItemsMobile}</div>
                )}
            </div>
        );
    }

    componentDidMount() {
        let { userEmails } = this.props.match.params;
        userEmails = userEmails.indexOf('all') > -1 ? '' : userEmails;
        const userEmailsList = userEmails.length ? userEmails.split(',') : [];
        const { projectName, dateStart, endDate } = this.props.match.params;

        apiCall(
            AppConfig.apiURL +
                `project/reports-project?projectName=${projectName || ''}&startDate=${convertDateToISOString(
                    dateStart
                )}&endDate=${convertDateToShiftedISOString(endDate, 24 * 60 * 60 * 1000)}${
                    userEmailsList.length ? `&${getParametersString('userEmails', userEmailsList)}` : ''
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
                this.setState({ dataOfProject: timer });
                this.setState({ totalTime: this.getTotalTime(timer) });
                this.setState({ countTasks: timer.length });
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
    inputUserData: store.reportsPageReducer.inputUserData,
    isMobile: store.responsiveReducer.isMobile,
    dateFormat: store.userReducer.dateFormat,
    durationTimeFormat: store.userReducer.durationTimeFormat,
    vocabulary: store.languageReducer.vocabulary,
});

export default withRouter(connect(mapStateToProps)(ReportsByProjectsPage));
