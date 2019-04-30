import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './style.css';
import LeftBar from '../../components/LeftBar';
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';
import projectsPageAction from '../../actions/ProjectsActions';
import { getProjectsV2ProjectPageUserParseFunction, getProjectsV2ProjectPageAdminParseFunction } from '../../queries';
import { userLoggedIn, checkIsAdmin } from '../../services/authentication';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import { AppConfig } from '../../config';

class ProjectsPage extends Component {
    state = {
        etalonArr: [],
    };

    getProjects = () => {
        if (checkIsAdmin()) {
            fetch(AppConfig.apiURL + 'project/admin-list', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then(
                    result => {
                        let data = getProjectsV2ProjectPageAdminParseFunction(result.data);
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
        } else {
            fetch(AppConfig.apiURL + `project/admin-list?userId=${getUserIdFromLocalStorage()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then(
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
