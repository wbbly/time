import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { showMobileSupportToastr } from '../../App';

// dependencies
import classNames from 'classnames';

// Services
import { userLoggedIn, checkIsAdmin } from '../../services/authentication';
import { apiCall } from '../../services/apiService';

// Components
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';

// Actions
import projectsPageAction from '../../actions/ProjectsActions';

// Queries
import { getProjectsV2ProjectPageUserParseFunction, getProjectsV2ProjectPageAdminParseFunction } from '../../queries';

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class ProjectsPage extends Component {
    state = {
        etalonArr: [],
    };

    getProjects = () => {
        apiCall(AppConfig.apiURL + `project/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let data = getProjectsV2ProjectPageUserParseFunction(result.data);
                this.setState({ etalonArr: data.projectV2 });
                this.props.projectsPageAction('CREATE_PROJECT', { tableData: data.projectV2 });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
    };

    render() {
        const { tableData, addNewProjectModalToggle, projectsPageAction, isMobile } = this.props;

        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        return (
            <div
                className={classNames('wrapper_projects_page', {
                    'wrapper_projects_page--mobile': isMobile,
                })}
            >
                {addNewProjectModalToggle && (
                    <CreateProjectModal
                        tableInfo={tableData}
                        projectsPageAction={projectsPageAction}
                        getProjects={this.getProjects}
                    />
                )}
                <div className="data_container_projects_page">
                    <div className="projects_page_header">
                        <div className="projects_page_title">Projects</div>
                        {checkIsAdmin() && (
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
                            tableInfo={tableData}
                            projectsPageAction={projectsPageAction}
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
        showMobileSupportToastr();
    }
}

const mapStateToProps = store => {
    return {
        tableData: store.projectReducer.tableData,
        addNewProjectModalToggle: store.projectReducer.addNewProjectModalToggle,
        editedProject: store.projectReducer.editedProject,
        editProjectModal: store.projectReducer.editProjectModal,
        isMobile: store.responsiveReducer.isMobile,
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
