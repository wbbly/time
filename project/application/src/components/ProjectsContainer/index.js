import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { Doughnut } from 'react-chartjs-2';

import './style.css';
import { getTimInStringSeconds } from '../../pages/MainPage/timeInSecondsFunction';

class ProjectsContainer extends Component {
    getIdOfProject(projectName) {
        for (let i = 0; i < this.props.allProjects.length; i++) {
            if (projectName === this.props.allProjects[i].name) {
                return this.props.allProjects[i].id;
            }
        }
    }

    getDateToLink(momentDate) {
        return moment(momentDate).format('YYYY-MM-DD');
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
        let projectsItems = this.props.projectsArr.map(item => (
            <Link
                to={`/project-report/${item.name}/${this.getDateToLink(
                    this.props.selectionRange.startDate
                )}/${this.getDateToLink(this.props.selectionRange.endDate)}`}
                style={{ textDecoration: 'none' }}
            >
                <div className="projects_container_project_data">
                    <div className="name">{item.name}</div>
                    <div className="time">{this.convertMS(item.duration)}</div>
                </div>
            </Link>
        ));

        return (
            <div className="projects_container_wrapper">
                <div className="projects_container_projects">
                    <div className="projects_header">
                        <div>Project name</div>
                        <div>Time</div>
                    </div>
                    <div className="projects_container_project_data_container">{projectsItems}</div>
                </div>
                <div className="chart">
                    <Doughnut data={this.props.dataDoughnutChat} width={303} height={303} />
                </div>
            </div>
        );
    }
}

export default ProjectsContainer;
