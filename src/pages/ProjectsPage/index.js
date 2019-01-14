import React, { Component } from 'react';
import './index.css';
import LeftBar from '../../components/LeftBar';
// import ProjectSearchBar from '../../components/projectSearchBar';
// import ProjectData from '../../components/ProjectsData';

class ProjectsPage extends Component {
  render() {
    return (
      <div className="wrapper_projects_page">
        <LeftBar />
        <div className="data_container_projects_page">
          <div className="projects_page_header">
            <div className="projects_page_title">
              Projects
            </div>
            <button className="create_project_button">
              Create new project
            </button>
          </div>
          <div className="project_page_filters">
            {/*<ProjectSearchBar />*/}
          </div>
          <div className="project_data_wrapper">
            {/*<ProjectData />*/}
          </div>
        </div>
      </div>
    );
  }
}
export default ProjectsPage;
