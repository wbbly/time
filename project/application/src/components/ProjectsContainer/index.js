import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { Doughnut } from 'react-chartjs-2';
import { convertMS } from '../../services/timeService';

import './style.css';

class ProjectsContainer extends Component {
    doughnutOptions = {
        title: {
            display: false,
        },
        legend: {
            display: false,
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    let label = data.labels[tooltipItem.index];
                    let duration = convertMS(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);

                    return `${label}: ${duration}`;
                },
            },
        },
    };

    getDateToLink(momentDate) {
        return moment(momentDate).format('YYYY-MM-DD');
    }

    render() {
        let datesValue = '00:00:00';
        if (!!this.props.dataDoughnutChat.datasets[0].data.length) {
            datesValue = JSON.parse(
                JSON.stringify(
                    this.props.dataDoughnutChat.datasets[0].data.reduce((a, b) => {
                        return a + b;
                    })
                )
            );
        }
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
                    <div className="total_time_tasks">
                        {typeof datesValue === 'number' ? convertMS(datesValue) : datesValue}
                    </div>
                    <Doughnut
                        data={this.props.dataDoughnutChat}
                        options={this.doughnutOptions}
                        width={303}
                        height={303}
                    />
                </div>
            </div>
        );
    }
}

export default ProjectsContainer;
