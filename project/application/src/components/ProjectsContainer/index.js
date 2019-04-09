import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { Doughnut } from 'react-chartjs-2';
import { convertMS } from '../../services/timeService';

import './style.css';

class ProjectsContainer extends Component {
    getDateToLink(momentDate) {
        return moment(momentDate).format('YYYY-MM-DD');
    }

    getZero(item) {
        if (!item) {
            return '00';
        }
        if ((item + '').length === 1) {
            return '0' + item;
        } else {
            return item;
        }
    }

    render() {
        let projectsItems = this.props.projectsArr.map((item, index) => (
            <Link
                to={`/project-report/${item.name}/${this.getDateToLink(
                    this.props.selectionRange.startDate
                )}/${this.getDateToLink(this.props.selectionRange.endDate)}`}
                style={{ textDecoration: 'none' }}
                key={'projects_item' + index}
            >
                <div className="projects_container_project_data">
                    <div className="name">{item.name}</div>
                    <div className="time">{convertMS(item.duration)}</div>
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
