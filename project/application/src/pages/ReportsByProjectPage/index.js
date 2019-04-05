import React, { Component } from 'react';

import './style.css';
import LeftBar from '../../components/LeftBar';
import { getDataByProjectName } from '../../queries';
import { client } from '../../requestSettings';
import { timeInSeconds, getTimInStringSeconds } from '../MainPage/timeInSecondsFunction';
import { connect } from 'react-redux';
import * as moment from 'moment';

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

    convertMS(milliseconds) {
        var day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return `${day} day | ${hour}:${minute}:${seconds}`;
    }

    render() {
        let projectsItems = this.state.dataOfProject.map(item => (
            <div className="projects_container_project_data">
                <div className="name">{this.getSlash(item.issue)}</div>
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
                        {this.props.match.params.name}: {this.getDateInPointsFormat(this.props.match.params.dateStart)}
                        {' - '} {this.getDateInPointsFormat(this.props.match.params.endDate)}
                    </div>
                    <div className="header_name">Sum tasks: {this.state.countTasks}</div>
                    <div className="header_name">
                        Sum time:{' '}
                        {moment(this.state.sumTime)
                            .utc()
                            .format('HH:mm:ss')}
                    </div>
                </div>
                <div className="projects_container_wrapper">
                    <div className="projects_container_projects">
                        <div className="projects_header">
                            <div>Project name</div>
                            <div>Time</div>
                        </div>
                        {' - '}
                        <div className="projects_container_project_data_container">{projectsItems}</div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        client
            .request(
                getDataByProjectName(
                    this.props.match.params.name,
                    this.props.setUser.id,
                    new Date(this.props.match.params.dateStart).toISOString().slice(0, -1),
                    new Date(+new Date(this.props.match.params.endDate) + 24 * 60 * 60 * 1000 - 1)
                        .toISOString()
                        .slice(0, -1)
                )
            )
            .then(data => {
                this.setState({ dataOfProject: data.project_v2[0].timer });
                this.setState({ sumTime: this.getSumtime(data.project_v2[0].timer) });
                this.setState({ countTasks: data.project_v2[0].timer.length });
            });
    }
}

const mapStateToProps = store => {
    return {
        setUser: store.reportsPageReducer.setUser,
    };
};

export default connect(mapStateToProps)(ReportsByProjectsPage);
