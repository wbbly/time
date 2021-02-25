import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { Doughnut } from 'react-chartjs-2';
import classNames from 'classnames';

// Services
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';

// Components

// Actions

// Queries

// Config

// Styles
import './style.scss';

class ProjectsContainer extends Component {
    state = {
        isProjects: true,
    };

    toogleProjects = () => {
        this.setState({ isProjects: !this.state.isProjects });
    };

    doughnutOptions = durationTimeFormat => ({
        title: {
            display: false,
        },
        legend: {
            display: false,
        },
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    let label = data.labels[tooltipItem.index];
                    let duration = getTimeDurationByGivenTimestamp(
                        data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index],
                        durationTimeFormat
                    );

                    return `${label}: ${duration}`;
                },
            },
        },
    });

    getDateToLink(momentDate) {
        return moment(momentDate).format('YYYY-MM-DD');
    }

    getUsers(projectName) {
        let currentUserArr = [];
        this.props.userProjectsArr.forEach(item => {
            if (item.projects.find(project => project.name === projectName)) {
                currentUserArr.push(item.email);
            }
        });
        return currentUserArr.join(',');
    }

    render() {
        const { isProjects } = this.state;
        const { vocabulary, durationTimeFormat } = this.props;
        const { v_people, v_projects } = vocabulary;
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

        return (
            <div className="projects_container_wrapper">
                <div className="projects_container_projects">
                    <div className="projects_container_buttons">
                        <div
                            className={classNames('projects_container_button', {
                                'projects_container_button--active': isProjects,
                            })}
                            onClick={this.toogleProjects}
                        >
                            {v_projects}
                        </div>
                        <div
                            className={classNames('projects_container_button', {
                                'projects_container_button--active': !isProjects,
                            })}
                            onClick={this.toogleProjects}
                        >
                            {v_people}
                        </div>
                    </div>
                    {isProjects && (
                        <div className="projects_data">
                            {this.props.projectsArr.map((project, index) => (
                                <div className="projects_user" key={project.name + index}>
                                    <Link
                                        to={`/reports/detailed/projects/${project.name}/team/${this.getUsers(
                                            project.name
                                        ) || 'all'}/from/${this.getDateToLink(
                                            this.props.selectionRange.startDate
                                        )}/to/${this.getDateToLink(this.props.selectionRange.endDate)}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="projects_user_data">
                                            <div className="project-name">{project.name}</div>
                                            <div className="time">
                                                {getTimeDurationByGivenTimestamp(project.duration, durationTimeFormat)}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    {!isProjects && (
                        <div className="projects_data">
                            {this.props.userProjectsArr.map(user => (
                                <div className="projects_user" key={user.username}>
                                    <div className="projects_user_data">
                                        <div className="user-name">{user.username}</div>
                                        <div className="project-name" />
                                        <div className="time">
                                            {getTimeDurationByGivenTimestamp(user.total, durationTimeFormat)}
                                        </div>
                                    </div>
                                    {user.projects.map((project, index) => (
                                        <Link
                                            to={`/reports/detailed/projects/${project.name}/team/${this.getUsers(
                                                project.name
                                            ) || 'all'}/from/${this.getDateToLink(
                                                this.props.selectionRange.startDate
                                            )}/to/${this.getDateToLink(this.props.selectionRange.endDate)}`}
                                            style={{ textDecoration: 'none' }}
                                            key={user.username + index}
                                        >
                                            <div className="projects_user_data">
                                                <div className="user-name" />
                                                <div className="project-name">{project.name}</div>
                                                <div className="time">
                                                    {getTimeDurationByGivenTimestamp(
                                                        project.duration,
                                                        durationTimeFormat
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="chart">
                    <div className="total_time_tasks">
                        {typeof datesValue === 'number'
                            ? getTimeDurationByGivenTimestamp(datesValue, durationTimeFormat)
                            : ''}
                    </div>
                    <Doughnut
                        data={this.props.dataDoughnutChat}
                        options={this.doughnutOptions(durationTimeFormat)}
                        width={303}
                        height={303}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    durationTimeFormat: state.userReducer.durationTimeFormat,
});

export default connect(mapStateToProps)(ProjectsContainer);
