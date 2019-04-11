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
            text: 'Custom Chart Title',
        },
        legend: {
            display: false,
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    return moment(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).utc().format('HH:mm:ss');
                    // return moment(tooltipItem.yLabel)
                    //     .utc()
                    //     .format('HH:mm:ss');
                },
            },
        },
    };

    getDateToLink(momentDate) {
        return moment(momentDate).format('YYYY-MM-DD');
    }

    render() {
        let datesValue = JSON.parse(
            JSON.stringify(
                this.props.dataDoughnutChat.datasets[0].data.reduce(function(a, b) {
                    return a + b;
                })
            )
        );
        console.log(datesValue, 'datesArr');
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
                    <div className="total_time_tasks">{convertMS(datesValue)}</div>
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
