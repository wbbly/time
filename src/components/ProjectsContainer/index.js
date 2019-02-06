import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './style.css';

class ProjectsContainer extends Component {

    render() {
        let projectsItems = this.props.projectsArr.map((item) =>
            <div className="projects_container_project_data">
                <div className="name">{item.projectName}</div>
                <div className="time">{item.projectTime}</div>
            </div>
        );
        console.log(this.props, 'asd');
        return (
            <div className="projects_container_wrapper">
                <div className="projects_container_projects">
                    <div className="projects_header">
                        <div>Project name</div>
                        <div>Time</div>
                    </div>
                    <div className="projects_container_project_data_container">
                        {projectsItems}
                    </div>
                </div>
                <div className="chart">
                    <Doughnut data={this.props.dataDoughnutChat} width={303} height={303}/>
                </div>
            </div>
        )
    }
}

export default ProjectsContainer