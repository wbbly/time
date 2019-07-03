import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';

import { showMobileSupportToastr } from '../../App';

// dependencies
import classNames from 'classnames';

// Services
import {
    getTimeDurationByGivenTimestamp,
    convertDateToISOString,
    convertDateToShiftedISOString,
} from '../../services/timeService';
import { decodeTimeEntryIssue } from '../../services/timeEntryService';
import { userLoggedIn } from '../../services/authentication';
import { getParametersString } from '../../services/apiService';
import { apiCall } from '../../services/apiService';
import { changeDisplayingDateFormat } from '../../services/formatService';

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
        const { isMobile } = this.props;
        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        let projectsItems = this.state.dataOfProject.map((item, index) => (
            <div className="projects_container_project_data" key={'projects_container_project_data' + index}>
                <div className="name">{this.getSlash(item.issue)}</div>
                <div className="username">{item.user.username}</div>
                <div className="time">
                    {changeDisplayingDateFormat(item.startDatetime, this.props.format.dateFormat)} |{' '}
                    {getTimeDurationByGivenTimestamp(item.durationTimestamp)}
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
                        {this.props.match.params.projectName}:{' '}
                        {changeDisplayingDateFormat(this.props.match.params.dateStart, this.props.format.dateFormat)}
                        {' - '} {changeDisplayingDateFormat(this.props.match.params.endDate, this.props.format.dateFormat)}
                    </div>
                    <div className="header_name">Sum tasks: {this.state.countTasks}</div>
                    <div className="header_name">Sum time: {getTimeDurationByGivenTimestamp(this.state.totalTime)}</div>
                </div>
                <div className="projects_container_wrapper">
                    <div className="projects_container_projects">
                        <div className="projects_header">
                            <div className="name">Issue</div>
                            <div className="username">Username</div>
                            <div className="time">Time</div>
                        </div>
                        <div className="projects_container_project_data_container">{projectsItems}</div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        showMobileSupportToastr();
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
    format: store.formatReducer
});

export default withRouter(connect(mapStateToProps)(ReportsByProjectsPage));
