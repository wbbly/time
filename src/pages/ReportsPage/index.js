import React, { Component } from 'react';
import './style.css';
import LeftBar from '../../components/LeftBar';
import { connect } from 'react-redux'
import { Bar } from 'react-chartjs-2';
import ProjectsContainer from '../../components/ProjectsContainer'

class ReportsPage extends Component {

    lineChartOption =  {
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: false,
                        fontColor: "#BDBDBD",
                    }
                }
                ],
            yAxes: [
                {
                    gridLines: {
                        color: '#BDBDBD'
                    },
                    ticks: {
                        beginAtZero: false,
                        fontColor: "#BDBDBD",
                    }
                }
                ]
        },
        legend: {
            display: true,
            labels: {
                fontColor: "#BDBDBD"
            }
        },
    };

    render() {
        return (
            <div className="wrapper_reports_page">
                <LeftBar/>
                <div className="data_container_reports_page">
                    <div className="header">
                        <div className="header_name">
                            Summary report
                        </div>
                        <div className="selects_container">
                        </div>
                    </div>
                    <div className="line_chart_container">
                        <Bar data={this.props.dataBarChat} height={50} options={this.lineChartOption}/>
                    </div>
                    <div className="projects_chart_container">
                        <ProjectsContainer projectsArr={this.props.projectsArr} dataDoughnutChat={this.props.dataDoughnutChat}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        dataBarChat: store.reportsPageReducer.dataBarChat,
        lineChartOption: store.reportsPageReducer.lineChartOption,
        projectsArr: store.reportsPageReducer.projectsArr,
        dataDoughnutChat: store.reportsPageReducer.dataDoughnutChat,
    }
};

export default connect(mapStateToProps)(ReportsPage);
