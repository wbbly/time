import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// dependencies
import classNames from 'classnames';

// Services
import { checkIsAdminByRole, checkIsOwnerByRole } from '../../services/authentication';
// import { apiCall } from '../../services/apiService';

// Components
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';
import { Loading } from '../../components/Loading';
import PageHeader from '../../components/PageHeader/index';
import FilterByStatus from '../../components/FilterByStatus';

// Actions
import projectsPageAction, {
    getProjectsListActions,
    changeProjectActiveStatusAction,
    resetProjectsParamsAction,
} from '../../actions/ProjectsActions';

// Queries
import { addUserRoleToProjects } from '../../queries';

// Config
// import { AppConfig } from '../../config';

// Styles
import './style.scss';
import { BlankListComponent } from '../../components/CommonComponents/BlankListcomponent/BlankListComponent';

class ProjectsPage extends Component {
    state = {
        isInitialFetching: true,
        stateSearchValue: '',
    };

    componentDidMount() {
        this.props.getProjectsListActions({
            page: 1,
            withPagination: true,
            withTimerList: false,
        });
    }

    componentWillUnmount() {
        this.props.resetProjectsParamsAction();
    }

    componentDidUpdate(prevProps) {
        const { projectsList, projectsPageAction } = this.props;
        if (projectsList && !_.isEqual(prevProps.projectsList, projectsList)) {
            this.setState({
                isInitialFetching: false,
            });
            projectsPageAction('CREATE_PROJECT', {
                tableData: addUserRoleToProjects(projectsList),
            });
        }
    }

    searchProject = () => {
        this.props.getProjectsListActions({
            page: 1,
            withPagination: true,
            withTimerList: false,
            searchValue: this.state.stateSearchValue,
        });
    };

    resetFilters = () => {
        this.setState({ stateSearchValue: '' });
        this.props.getProjectsListActions({
            page: 1,
            withPagination: true,
            withTimerList: false,
            searchValue: '',
            filterStatus: 'all',
        });
    };

    setFilterStatus = status => {
        this.props.getProjectsListActions({
            page: 1,
            withPagination: true,
            withTimerList: false,
            filterStatus: status,
        });
    };

    changeProjectActiveStatus = async (projectId, isActive) => {
        await this.props.changeProjectActiveStatusAction(projectId, isActive);
        this.props.getProjectsListActions({
            page: 1,
            withPagination: true,
            withTimerList: false,
        });
    };

    render() {
        const {
            tableData,
            addNewProjectModalToggle,
            projectsPageAction,
            isMobile,
            vocabulary,
            currentTeam,
            filterStatus,
            projectsList,
            isPaginationFetching,
        } = this.props;
        const {
            v_create_new_project,
            v_projects,
            v_no_projects,
            v_no_projects_sub,
            v_filter_all_projects,
            v_filter_active,
            v_filter_archived,
            v_clear_filters,
        } = vocabulary;

        const { isInitialFetching, stateSearchValue } = this.state;

        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <div
                    className={classNames('wrapper_projects_page', {
                        'wrapper_projects_page--mobile': isMobile,
                    })}
                >
                    {addNewProjectModalToggle && (
                        <CreateProjectModal tableInfo={tableData} projectsPageAction={projectsPageAction} />
                    )}
                    <div className="data_container_projects_page">
                        <div className="data_container_projects_page_top">
                            <PageHeader title={v_projects}>
                                {(checkIsAdminByRole(currentTeam.data.role) ||
                                    checkIsOwnerByRole(currentTeam.data.role)) && (
                                    <button
                                        className="header-wrapper__child-button"
                                        onClick={() => projectsPageAction('TOGGLE_MODAL', { toggle: true })}
                                    >
                                        {v_create_new_project}
                                    </button>
                                )}
                            </PageHeader>

                            <div className="project-page-filters">
                                <ProjectSearchBar
                                    searchValue={stateSearchValue}
                                    searchValueHandler={e => this.setState({ stateSearchValue: e.target.value })}
                                    filterProjects={this.searchProject}
                                />
                                <div className="project-page-filters__clear">
                                    <div className="project-page-filters__button" onClick={this.resetFilters}>
                                        {v_clear_filters}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FilterByStatus
                            status={filterStatus}
                            onClick={this.setFilterStatus}
                            items={[
                                {
                                    id: 'all',
                                    text: v_filter_all_projects,
                                },
                                {
                                    id: 'active',
                                    text: v_filter_active,
                                },
                                {
                                    id: 'archived',
                                    text: v_filter_archived,
                                },
                            ]}
                        />
                        <ProjectData
                            tableInfo={tableData}
                            projectsPageAction={projectsPageAction}
                            editedProject={this.props.editedProject}
                            editProjectModal={this.props.editProjectModal}
                            changeProjectActiveStatus={this.changeProjectActiveStatus}
                            getProjects={this.getProjects}
                        />
                    </div>
                </div>
            </Loading>
        );
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
        projectsList: store.projectReducer.projectsList,
        isPaginationFetching: store.projectReducer.pagination.listFetching,
        filterStatus: store.projectReducer.filterStatus,
        searchValue: store.projectReducer.searchValue,
    };
};

const mapDispatchToProps = {
    projectsPageAction,
    getProjectsListActions,
    changeProjectActiveStatusAction,
    resetProjectsParamsAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsPage);
