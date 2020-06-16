import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import ProjectsContainer from '../../../components/ProjectsContainer';

export class UnitedReportsComponents extends Component {
   
    
        render(){
            return (
                <>
                {this.props.toggleBar &&
                    this.props.toggleChar && (
                        <div className="total_time_container">
                            <span className="total_time_name">{this.props.v_total}</span>
                            <span className="total_time_time">
                                {typeof this.props.totalUpChartTime === 'number'
                                    ? this.props.getTimeDurationByGivenTimestamp(
                                        this.props.totalUpChartTime,
                                        this.props.durationTimeFormat
                                    )
                                    : this.props.getTimeDurationByGivenTimestamp(0, this.props.durationTimeFormat)}
                            </span>
                            <span className="export_button" onClick={e => this.props.export()}>
                                {this.props.v_export}
                            </span>
                        </div>
                    )}
                    {this.props.toggleBar &&
                                this.props.toggleChar && (
                                    <div className="line_chart_container">
                                        <Bar
                                            ref={Bar => (this.barChart = Bar)}
                                            data={this.props.data}
                                            height={this.props.height}
                                            options={this.props.lineChartOption(this.props.durationTimeFormat)}
                                        />
                                    </div>
                    )}
                    {this.props.toggleBar &&
                            this.props.toggleChar && (
                                <div className="projects_chart_container">
                                    <ProjectsContainer
                                        selectionRange={this.props.selectionRange}
                                        usersArr={this.props.usersArr}
                                        projectsArr={this.props.projectsArr}
                                        dataDoughnutChat={this.props.dataDoughnutChat}
                                    />
                                </div>
                    )}
                </>
            )
        }
}