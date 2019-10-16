import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { Doughnut } from 'react-chartjs-2';

// Services
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';

// Components

// Actions

// Queries

// Config

// Styles
import './style.css';

class ProjectsContainer extends Component {
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

    render() {
        const { vocabulary, durationTimeFormat } = this.props;
        const { v_project_name, v_time } = vocabulary;
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
                to={`/reports/detailed/projects/${item.name}/team/${this.props.usersArr.join(',') ||
                    'all'}/from/${this.getDateToLink(this.props.selectionRange.startDate)}/to/${this.getDateToLink(
                    this.props.selectionRange.endDate
                )}`}
                style={{ textDecoration: 'none' }}
                key={'projects_item' + index}
            >
                <div className="projects_container_project_data">
                    <div className="name">{item.name}</div>
                    <div className="time">{getTimeDurationByGivenTimestamp(item.duration, durationTimeFormat)}</div>
                </div>
            </Link>
        ));

        return (
            <div className="projects_container_wrapper">
                <div className="projects_container_projects">
                    <div className="projects_header">
                        <div>{v_project_name}</div>
                        <div>{v_time}</div>
                    </div>
                    <div className="projects_container_project_data_container">{projectsItems}</div>
                </div>
                <div className="chart">
                    <div className="total_time_tasks">
                        {typeof datesValue === 'number'
                            ? getTimeDurationByGivenTimestamp(datesValue, durationTimeFormat)
                            : getTimeDurationByGivenTimestamp(0, durationTimeFormat)}
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
