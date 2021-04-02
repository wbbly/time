import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

import ProjectsContainer from '../../../components/ProjectsContainer';

export class UnitedReportsComponents extends Component {
    state = {
        exportModalFlag: false,
    };

    closeOnClickOutside = e => {
        if (!document.getElementById('exportBlock').contains(e.target)) {
            this.setState({ exportModalFlag: false });
        }
    };

    exportHandler = e => {
        e.stopPropagation();
        this.setState({ exportModalFlag: !this.state.exportModalFlag });
        window.addEventListener('click', this.closeOnClickOutside);
    };

    componentDidUpdate() {
        if (!this.state.exportModalFlag) {
            window.removeEventListener('click', this.closeOnClickOutside);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.closeOnClickOutside);
    }

    render() {
        const { exportModalFlag } = this.state;
        const {
            v_export,
            v_detailed_export,
            v_simple_export,
            v_total,
            durationTimeFormat,
            toggleBar,
            toggleChar,
            totalUpChartTime,
            getTimeDurationByGivenTimestamp,
            projectsArr,
            data,
            height,
            lineChartOption,
            selectionRange,
            usersArr,
            userProjectsArr,
            dataDoughnutChat,
        } = this.props;
        return (
            <>
                {toggleBar &&
                    toggleChar && (
                        <div className="total_time_container">
                            <span className="total_time_name">{v_total}</span>
                            <span className="total_time_time">
                                {typeof totalUpChartTime === 'number'
                                    ? getTimeDurationByGivenTimestamp(
                                          projectsArr.reduce((acc, project) => {
                                              return acc + project.duration;
                                          }, 0),
                                          durationTimeFormat
                                      )
                                    : getTimeDurationByGivenTimestamp(0, durationTimeFormat)}
                            </span>
                            <div className="export_button" id="exportBlock" onClick={e => this.exportHandler(e)}>
                                {v_export}
                                <i className={`arrow_down ${exportModalFlag ? 'arrow_down_up' : ''}`} />
                                {exportModalFlag && (
                                    <div className="export_dropdown">
                                        <div onClick={() => this.props.export(true)}>{v_detailed_export}</div>
                                        <div onClick={() => this.props.export(false)}>{v_simple_export}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                {toggleBar &&
                    toggleChar && (
                        <div className="line_chart_container">
                            <Bar
                                ref={Bar => (this.barChart = Bar)}
                                data={data}
                                height={height}
                                options={lineChartOption(durationTimeFormat)}
                            />
                        </div>
                    )}
                {toggleBar &&
                    toggleChar && (
                        <div className="projects_chart_container">
                            <ProjectsContainer
                                selectionRange={selectionRange}
                                usersArr={usersArr}
                                projectsArr={projectsArr}
                                userProjectsArr={userProjectsArr}
                                dataDoughnutChat={dataDoughnutChat}
                            />
                        </div>
                    )}
            </>
        );
    }
}
