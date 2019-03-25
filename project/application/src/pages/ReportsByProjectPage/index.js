import React, { Component } from 'react';

import './style.css';
import LeftBar from '../../components/LeftBar';
import { getProjectReport } from '../../queries';
import { client } from '../../requestSettings';
import { timeInSeconds, getTimInStringSeconds } from '../MainPage/timeInSecondsFunction';

class ReportsByProjectsPage extends Component {
    state = {
        dataOfProject: [],
        sumTime: '',
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

    getSumTime = arr => {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += timeInSeconds(arr[i].timePassed);
        }
        this.setState({ sumTime: getTimInStringSeconds(sum) });
    };

    render() {
        let projectsItems = this.state.dataOfProject.map(item => (
            <div className="projects_container_project_data">
                <div className="name">{this.getSlash(item.name)}</div>
                <div className="time">
                    {this.getDateInPointsFormat(item.date)} | {item.timePassed}
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
                    <div className="header_name">Sum time: {this.state.sumTime}</div>
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
                getProjectReport({
                    projectId: this.props.match.params.id,
                    activeEmail: this.props.match.params.activeEmail,
                    from: this.props.match.params.dateStart,
                    to: this.props.match.params.endDate,
                })
            )
            .then(data => {
                this.getSumTime(data.timeTracker);
                this.setState({ dataOfProject: data.timeTracker });
            });
    }
}

export default ReportsByProjectsPage;
