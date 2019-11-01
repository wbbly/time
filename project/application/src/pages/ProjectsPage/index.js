import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showMobileSupportToastr } from '../../App';

// dependencies
import classNames from 'classnames';

// Services
import { checkIsAdminByRole } from '../../services/authentication';
import { apiCall } from '../../services/apiService';

// Components
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';
import { Loading } from '../../components/Loading';

// Actions
import projectsPageAction from '../../actions/ProjectsActions';

// Queries
import { getProjectsV2ProjectPageUserParseFunction, getProjectsV2ProjectPageAdminParseFunction } from '../../queries';

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

const clientsArray = [
    {
        id: '5db9a5428440dc7c1d228564',
        name: 'Delaney Boone',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54276d0f1be45431716',
        name: 'Melisa William',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542cc897674fa839936',
        name: 'Hahn Mckay',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542005bac0f8e7d77a5',
        name: 'Adams Morales',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542bd740361e9cc5e45',
        name: 'Wilkerson Hines',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a5428f32cba395d4815e',
        name: 'Gamble Woods',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a5423496d67ef5c56095',
        name: 'Bowen Lee',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54273fa8808564aa70a',
        name: 'Sanders Rosa',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a5423d37571203973f49',
        name: 'Lawanda Delgado',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54224241402e57e11c6',
        name: 'Mcclure Landry',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542cd6295ab5afdeb38',
        name: 'Cline Curtis',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542e970061626254421',
        name: 'Judy Williams',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54209670125c7a0dea4',
        name: 'Aileen Silva',
        totalTime: '00:00:00',
    },
];

class ProjectsPage extends Component {
    state = {
        isInitialFetching: true,
        etalonArr: [],
    };

    getProjects = () =>
        apiCall(AppConfig.apiURL + `project/list?withTimerList=true`, {
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

    render() {
        const {
            tableData,
            addNewProjectModalToggle,
            projectsPageAction,
            isMobile,
            vocabulary,
            currentTeam,
        } = this.props;
        const { v_create_new_project, v_projects } = vocabulary;

        const { isInitialFetching } = this.state;

        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
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
                            clientsList={clientsArray}
                        />
                    )}
                    <div className="data_container_projects_page">
                        <div className="projects_page_header">
                            <div className="projects_page_title">{v_projects}</div>
                            {checkIsAdminByRole(currentTeam.data.role) && (
                                <button
                                    className="create_project_button"
                                    onClick={e => projectsPageAction('TOGGLE_MODAL', { toggle: true })}
                                >
                                    {v_create_new_project}
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
                                clientsList={clientsArray}
                            />
                        </div>
                    </div>
                </div>
            </Loading>
        );
    }

    async componentDidMount() {
        // showMobileSupportToastr();
        await this.getProjects();
        this.setState({ isInitialFetching: false });
    }
}

const mapStateToProps = store => {
    return {
        tableData: store.projectReducer.tableData,
        addNewProjectModalToggle: store.projectReducer.addNewProjectModalToggle,
        editedProject: store.projectReducer.editedProject,
        editProjectModal: store.projectReducer.editProjectModal,
        isMobile: store.responsiveReducer.isMobile,
        vocabulary: store.languageReducer.vocabulary,
        currentTeam: store.teamReducer.currentTeam,
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
