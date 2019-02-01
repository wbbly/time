import React, {Component} from 'react';
import './index.css';
import {connect} from 'react-redux'
import LeftBar from '../../components/LeftBar';
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';
import toggleModalAddProject from '../../actions/projectsActions';

class ProjectsPage extends Component {

    toggleModal(item) {
        item(true);
    }

    render() {
        const {tableData, addNewProjectModalToggle, toggleModalAddProject } = this.props;

        return (
            <div className="wrapper_projects_page">
                {addNewProjectModalToggle && <CreateProjectModal toggleModal={toggleModalAddProject} />}
                <LeftBar/>
                <div className="data_container_projects_page">
                    <div className="projects_page_header">
                        <div className="projects_page_title">
                            Projects
                        </div>
                        <button className="create_project_button" onClick={e => this.toggleModal(toggleModalAddProject)}>
                            Create new project
                        </button>
                    </div>
                    <div className="project_page_filters">
                        <ProjectSearchBar/>
                    </div>
                    <div className="project_data_wrapper">
                        <ProjectData tableInfo={tableData} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        tableData: store.projectReducer.tableData,
        addNewProjectModalToggle: store.projectReducer.addNewProjectModalToggle,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleModalAddProject: year => dispatch(toggleModalAddProject(year))[1]
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsPage)

