import React, { Component } from 'react';
import { connect } from 'react-redux';

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
import PageHeader from '../../components/PageHeader/index';

// Actions
import projectsPageAction from '../../actions/ProjectsActions';

// Queries
import { getProjectsV2ProjectPageUserParseFunction } from '../../queries';

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

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
                        />
                    )}
                    <div className="data_container_projects_page">
                        <PageHeader title={v_projects}>
                            <button
                                className="header-wrapper__child-button"
                                onClick={() => projectsPageAction('TOGGLE_MODAL', { toggle: true })}
                            >
                                {v_create_new_project}
                            </button>
                        </PageHeader>
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
            </Loading>
        );
    }

    async componentDidMount() {
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
