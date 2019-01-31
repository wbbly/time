import React, {Component} from 'react';
import './index.css';
import LeftBar from '../../components/LeftBar';
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal'

class ProjectsPage extends Component {
    state = {
        toggleProjectDataModal: false,
    }
    render() {
        return (
            <div className="wrapper_projects_page">
                {/*<CreateProjectModal/>*/}
                <LeftBar/>
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
                        <ProjectSearchBar />
                    </div>
                    <div className="project_data_wrapper">
                        <ProjectData toggle={this.state.toggleProjectDataModal}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectsPage;
