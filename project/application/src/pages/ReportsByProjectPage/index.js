import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import './style.css';
import LeftBar from '../../components/LeftBar';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { convertMS, convertDateToISOString, convertDateToShiftedISOString } from '../../services/timeService';
import { encodeTimeEntryIssue, decodeTimeEntryIssue } from '../../services/timeEntryService';
import { userLoggedIn } from '../../services/authentication';
import { getParametersString } from '../../services/apiService';
import { AppConfig } from '../../config';

class ReportsByProjectsPage extends Component {
    state = {
        dataOfProject: [],
        sumTime: '',
        countTasks: '',
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

    getSumtime(arr) {
        let sumDate = 0;
        for (let i = 0; i < arr.length; i++) {
            sumDate += +moment(arr[i].end_datetime) - +moment(arr[i].start_datetime);
        }
        return sumDate;
    }

    render() {
        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        let projectsItems = this.state.dataOfProject.map((item, index) => (
            <div className="projects_container_project_data" key={'projects_container_project_data' + index}>
                <div className="name">{this.getSlash(item.issue)}</div>
                <div className="username">{item.user.username}</div>
                <div className="time">
                    {moment(item.start_datetime).format('DD.MM.YYYY')} |{' '}
                    {moment(+moment(item.end_datetime) - +moment(item.start_datetime))
                        .utc()
                        .format('HH:mm:ss')}
                </div>
            </div>
        ));

        return (
            <div className="reports_by_projects_wrapper">
                <LeftBar />
                <div className="header">
                    <div className="header_name">
                        {this.props.match.params.projectName}:{' '}
                        {this.getDateInPointsFormat(this.props.match.params.dateStart)}
                        {' - '} {this.getDateInPointsFormat(this.props.match.params.endDate)}
                    </div>
                    <div className="header_name">Sum tasks: {this.state.countTasks}</div>
                    <div className="header_name">Sum time: {convertMS(this.state.sumTime)}</div>
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
        const { projectName, userEmails, dateStart, endDate } = this.props.match.params;

        fetch(
            AppConfig.apiURL +
                `project/reports-project?projectName=${projectName || ''}&startDate=${convertDateToISOString(
                    dateStart
                ).slice(0, -1)}&endDate=${convertDateToShiftedISOString(endDate, 24 * 60 * 60 * 1000 - 1).slice(
                    0,
                    -1
                )}&${getParametersString('userEmails', (userEmails || []).split(','))}`,
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
                    for (let i = 0; i < data.project_v2.length; i++) {
                        const project = data.project_v2[i];
                        for (let j = 0; j < project.timer.length; j++) {
                            const timeEntry = project.timer[j];
                            timeEntry.issue = decodeTimeEntryIssue(timeEntry.issue);
                        }
                    }

                    this.setState({ dataOfProject: data.project_v2[0].timer });
                    this.setState({ sumTime: this.getSumtime(data.project_v2[0].timer) });
                    this.setState({ countTasks: data.project_v2[0].timer.length });
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
        setUser: store.reportsPageReducer.setUser,
    };
};

export default connect(mapStateToProps)(ReportsByProjectsPage);
