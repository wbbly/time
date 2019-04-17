import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './style.css';
import LeftBar from '../../components/LeftBar';
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';
import projectsPageAction from '../../actions/ProjectsActions';
import { client } from '../../requestSettings';
import { getProjectsV2ProjectPageAdmin, getProjectsV2ProjectPageUser } from '../../queries';
import { userLoggedIn, getUserAdminRight, getUserId } from '../../services/authentication';

class ProjectsPage extends Component {
    state = {
        etalonArr: [],
        activeEmail: '',
        projectsTime: {},
    };

    getProjects = () => {
        if (getUserAdminRight() === 'ROLE_ADMIN') {
            client.request(getProjectsV2ProjectPageAdmin).then(data => {
                this.setState({ etalonArr: data.projectV2 });
                this.props.projectsPageAction('CREATE_PROJECT', { tableData: data.projectV2 });
            });
        } else {
            client.request(getProjectsV2ProjectPageUser(getUserId())).then(data => {
                this.setState({ etalonArr: data.projectV2 });
                this.props.projectsPageAction('CREATE_PROJECT', { tableData: data.projectV2 });
            });
        }
    };

    render() {
        const { tableData, addNewProjectModalToggle, projectsPageAction } = this.props;

        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        return (
            <div className="wrapper_projects_page">
                {addNewProjectModalToggle && (
                    <CreateProjectModal
                        tableInfo={tableData}
                        projectsPageAction={projectsPageAction}
                        getProjects={this.getProjects}
                    />
                )}
                <LeftBar />
                <div className="data_container_projects_page">
                    <div className="projects_page_header">
                        <div className="projects_page_title">Projects</div>
                        {getUserAdminRight() === 'ROLE_ADMIN' && (
                            <button
                                className="create_project_button"
                                onClick={e => projectsPageAction('TOGGLE_MODAL', { toggle: true })}
                            >
                                Create new project
                            </button>
                        )}
                    </div>
                    <div className="project_page_filters">
                        <ProjectSearchBar
                            tableInfo={this.props.tableData}
                            etalonArr={this.state.etalonArr}
                            projectsPageAction={projectsPageAction}
                        />
                    </div>
                    <div className="project_data_wrapper">
                        <ProjectData
                            activeEmail={this.state.activeEmail}
                            tableInfo={tableData}
                            projectsPageAction={projectsPageAction}
                            projectsTime={this.state.projectsTime}
                            editedProject={this.props.editedProject}
                            editProjectModal={this.props.editProjectModal}
                            getProjects={this.getProjects}
                        />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getProjects();
        this.setState({ activeEmail: localStorage.getItem('active_email') });
    }
}

const mapStateToProps = store => {
    return {
        tableData: store.projectReducer.tableData,
        addNewProjectModalToggle: store.projectReducer.addNewProjectModalToggle,
        editedProject: store.projectReducer.editedProject,
        editProjectModal: store.projectReducer.editProjectModal,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        projectsPageAction: (actionType, toggle) => dispatch(projectsPageAction(actionType, toggle))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsPage);
