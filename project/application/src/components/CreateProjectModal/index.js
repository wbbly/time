import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Services
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { addProjectPreProcessing } from '../../services/mutationProjectsFunction';
import { apiCall } from '../../services/apiService';
import { vocabularyInterpolation } from '../../services/vocabulary';
import { checkIsAdminByRole, checkIsOwnerByRole } from '../../services/authentication';

// Components
import ClientsDropdown from '../ClientsDropdown';
import ProjectsDropdown from '../ProjectsDropdown';
import UsersSelectComponent from '../UsersSelectComponent';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';
import { getClientsAction } from '../../actions/ClientsActions';
import { getRelationProjectsListAction, getProjectsListActions } from '../../actions/ProjectsActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class CreateProjectModal extends Component {
    state = {
        selectedValue: {
            id: 'a642f337-9082-4f64-8ace-1d0e99fa7258',
            name: 'green',
        },
        listOpen: false,
        selectValue: [],
        selectedClient: null,
        clientsList: null,
        selectedUsers: [],
        selectedProject: null,
        relationProjectsList: null,
        showUsersSelect: false,
    };

    componentDidMount() {
        apiCall(AppConfig.apiURL + `project-color/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let data = result.data;
                this.setState({ selectValue: data.project_color });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
        document.addEventListener('mousedown', this.closeList);
        this.props.getClientsAction();
        this.props.userReducer.user.tokenJira && this.props.getRelationProjectsListAction();
    }

    componentDidUpdate(prevProps, prevState) {
        const { clientsList, relationProjectsList } = this.props;
        if (prevProps.clientsList !== clientsList) {
            const filteredClients = clientsList.filter(item => item.is_active);
            this.setState({ clientsList: filteredClients });
        }
        if (prevProps.relationProjectsList !== relationProjectsList) {
            this.setState({ relationProjectsList });
        }
    }

    setItem(value) {
        this.setState({
            selectedValue: value,
        });
    }

    toggleSelect() {
        this.setState({
            listOpen: !this.state.listOpen,
        });
    }

    clientSelect = data => {
        this.setState({ selectedClient: data ? data : null });
    };

    projectSelect = data => {
        this.setState({ selectedProject: data ? data : null });
    };

    addProject() {
        const { vocabulary, showNotificationAction } = this.props;
        const { selectedClient, selectedProject, selectedUsers } = this.state;
        const {
            v_a_project_created,
            v_a_project_existed,
            v_a_project_created_error,
            v_sync_with_jira_project_exist,
        } = vocabulary;
        const project = addProjectPreProcessing(
            this.createProjectInput.value,
            this.state.selectedValue,
            vocabulary,
            showNotificationAction
        );
        if (!project) {
            return null;
        }
        apiCall(AppConfig.apiURL + `project/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project: {
                    name: project.name,
                    projectColorId: project.colorProject.id,
                    clientId: selectedClient ? selectedClient.id : null,
                    jiraProjectId: selectedProject ? selectedProject : null,
                },
                users: selectedUsers.map(item => item.id),
            }),
        }).then(
            result => {
                this.props.getProjectsListActions({
                    page: 1,
                    withPagination: true,
                    withTimerList: false,
                });
                this.props.projectsPageAction('TOGGLE_MODAL', { toggle: false });
                showNotificationAction({ text: v_a_project_created, type: 'success' });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(error => {
                        const errorParsed = JSON.parse(error);
                        if (Array.isArray(errorParsed)) {
                            const errorMessages = responseErrorsHandling.getErrorMessages(errorParsed);
                            if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                                showNotificationAction({ text: v_a_project_existed, type: 'warning' });
                            } else {
                                showNotificationAction({ text: v_a_project_created_error, type: 'error' });
                            }
                        } else if (errorParsed.message && errorParsed.message === 'ERROR.PROJECT.SYNC_FAILED') {
                            showNotificationAction({
                                text: vocabularyInterpolation(v_sync_with_jira_project_exist, {
                                    projectName: errorParsed.project,
                                }),
                                type: 'warning',
                            });
                        }
                    });
                } else {
                    console.log(err);
                }
            }
        );
    }

    closeList = e => {
        const { listOpen } = this.state;
        if (listOpen && !e.target.closest('.create_projects_modal_data_select_container')) {
            this.setState({ listOpen: false });
        }
    };

    parseTeamUsers = teamData => {
        return teamData
            .filter(
                item =>
                    item.is_active &&
                    !checkIsAdminByRole(item.role_collaboration.title) &&
                    !checkIsOwnerByRole(item.role_collaboration.title)
            )
            .map(teamUser => teamUser.user[0]);
    };

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeList);
    }

    render() {
        const { vocabulary, teamUsers } = this.props;
        const { v_create_project, v_project_name, v_add_project_name, v_add_member, v_member } = vocabulary;
        const { clientsList, relationProjectsList, selectedUsers, showUsersSelect } = this.state;
        let selectItems = this.state.selectValue.map(value => {
            const { id, name } = value;
            return (
                <div key={id} className={`item`} onClick={e => this.setItem(value)}>
                    <div className={`circle ${name}`} />
                </div>
            );
        });

        return (
            <div className="wrapper_create_projects_modal">
                <div className="create_projects_modal_background" />
                <div className="create_projects_modal_container">
                    <div className="create_projects_modal_header">
                        <div className="create_projects_modal_header_title">{v_create_project}</div>
                        <i
                            className="create_projects_modal_header_close"
                            onClick={e => this.props.projectsPageAction('TOGGLE_MODAL', { toggle: false })}
                        />
                    </div>
                    <div className="create_projects_modal_data">
                        <div className="create_projects_modal_data_input_container" data-label={v_add_project_name}>
                            <input
                                className="project-input"
                                type="text"
                                ref={input => {
                                    this.createProjectInput = input;
                                }}
                                placeholder={`${v_project_name}...`}
                            />
                            <div
                                className="create_projects_modal_data_select_container"
                                onClick={e => this.toggleSelect()}
                            >
                                <div className="select_main">
                                    <div className={`circle ${this.state.selectedValue.name}`} />
                                </div>
                                <i className={`vector ${this.state.listOpen ? 'vector_up' : ''}`} />
                                {this.state.listOpen && <div className="select_list">{selectItems}</div>}
                            </div>
                            <ClientsDropdown
                                clientsList={clientsList}
                                clientSelect={this.clientSelect}
                                vocabulary={vocabulary}
                            />
                            <div className="create-project__users-select-wrapper" data-label={v_add_member}>
                                <div
                                    className="create-project__users-selected"
                                    onClick={() => this.setState(prev => ({ showUsersSelect: !prev.showUsersSelect }))}
                                >
                                    {!!selectedUsers.length ? (
                                        <span className="create-project__users-selected-text">
                                            {selectedUsers.map(item => item.username).join(', ')}
                                        </span>
                                    ) : (
                                        <span className="create-project__placeholder">{v_member}</span>
                                    )}
                                    <i
                                        className={`create-project__vector ${
                                            showUsersSelect ? 'create-project__vector--up' : ''
                                        }`}
                                    />
                                </div>
                                {showUsersSelect && (
                                    <div className="create-project__dropdown-container">
                                        <UsersSelectComponent
                                            users={this.parseTeamUsers(teamUsers)}
                                            selectedUsers={selectedUsers}
                                            vocabulary={vocabulary}
                                            toggleSelect={selectedItems =>
                                                this.setState({ selectedUsers: selectedItems })
                                            }
                                            closePopup={() => this.setState({ showUsersSelect: false })}
                                        />
                                    </div>
                                )}
                            </div>
                            {this.props.userReducer.user.tokenJira && (
                                <ProjectsDropdown
                                    relationProjectsList={relationProjectsList}
                                    projectSelect={this.projectSelect}
                                    vocabulary={vocabulary}
                                />
                            )}
                        </div>
                    </div>
                    <div className="create_projects_modal_button_container">
                        <button
                            className="create_projects_modal_button_container_button"
                            onClick={e => this.addProject(this.props.tableInfo)}
                        >
                            {v_create_project}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

CreateProjectModal.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    clientsList: state.clientsReducer.clientsList,
    relationProjectsList: state.projectReducer.relationProjectsList,
    userReducer: state.userReducer,
    teamUsers: state.teamReducer.currentTeamDetailedData.data,
});

const mapDispatchToProps = {
    showNotificationAction,
    getClientsAction,
    getRelationProjectsListAction,
    getProjectsListActions,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProjectModal);
