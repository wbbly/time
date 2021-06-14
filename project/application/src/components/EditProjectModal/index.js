import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { addProjectPreProcessing } from '../../services/mutationProjectsFunction';
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
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

class EditProjectModal extends Component {
    state = {
        selectedValue: {
            id: 'a642f337-9082-4f64-8ace-1d0e99fa7258',
            name: 'green',
        },
        listOpen: false,
        selectValue: [],
        projectId: '',
        selectedClient: null,
        selectedProject: null,
        selectedUsers: [],
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

        apiCall(AppConfig.apiURL + `project/${this.props.editedProject.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let data = result.data;
                const { id, client, jira_project_id, project_color, name } = data.project_v2[0];
                this.setState({
                    projectId: id,
                    selectedClient: client,
                    selectedProject: jira_project_id,
                });
                this.setItem({
                    id: project_color.id,
                    name: project_color.name,
                });
                this.editProjectInput.value = name;
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
        this.props.getClientsAction();
        document.addEventListener('mousedown', this.closeList);
        this.props.userReducer.user.tokenJira && this.props.getRelationProjectsListAction();
        this.setState({ selectedUsers: this.filterUsersByRole(this.props.editedProject.userProjects) });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeList);
    }

    componentDidUpdate(prevProps, prevState) {
        const { relationProjectsList } = this.props;
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

    changeProject() {
        const { vocabulary, showNotificationAction } = this.props;
        const {
            v_a_project_updated,
            v_a_project_existed,
            v_a_project_edit_error,
            v_sync_with_jira_project_exist,
        } = vocabulary;
        const { selectedClient, selectedProject, selectedUsers } = this.state;
        const project = addProjectPreProcessing(
            this.editProjectInput.value,
            this.state.selectedValue.id,
            vocabulary,
            showNotificationAction
        );
        if (!project) {
            return null;
        }

        let object = {
            id: this.state.projectId,
            name: this.editProjectInput.value,
            colorProject: this.state.selectedValue.id,
        };

        apiCall(AppConfig.apiURL + `project/${object.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project: {
                    name: this.editProjectInput.value,
                    projectColorId: this.state.selectedValue.id,
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
                this.closeModal();
                showNotificationAction({ text: v_a_project_updated, type: 'success' });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(error => {
                        const errorParsed = JSON.parse(error);
                        if (Array.isArray(error)) {
                            const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(errorParsed));
                            if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                                showNotificationAction({ text: v_a_project_existed, type: 'warning' });
                            } else {
                                showNotificationAction({ text: v_a_project_edit_error, type: 'error' });
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

    closeModal = () => {
        this.props.projectsPageAction('TOGGLE_EDIT_PROJECT_MODAL', { tableData: false });
    };

    clientSelect = data => {
        this.setState({ selectedClient: data ? data : null });
    };

    projectSelect = data => {
        this.setState({ selectedProject: data ? data : null });
    };

    filterUsersByRole = users => {
        return users.filter(item => !checkIsAdminByRole(item.role) && !checkIsOwnerByRole(item.role));
    };

    closeList = e => {
        const { listOpen } = this.state;
        if (listOpen && !e.target.closest('.edit_projects_modal_data_select_container')) {
            this.setState({ listOpen: false });
        }
    };

    parseTeamUsers = teamData => {
        return teamData
            .filter(
                item =>
                    !checkIsOwnerByRole(item.role_collaboration.title) &&
                    !checkIsAdminByRole(item.role_collaboration.title) &&
                    item.is_active
            )
            .map(teamUser => teamUser.user[0]);
    };

    render() {
        const { vocabulary, teamUsers } = this.props;
        const { selectedClient, relationProjectsList, selectedProject, selectedUsers, showUsersSelect } = this.state;
        const { v_edit_project, v_project_name, v_edit_project_name, v_save, v_add_member, v_member } = vocabulary;

        let selectItems = this.state.selectValue.map(value => {
            const { id, name } = value;
            return (
                <div key={id} className={`item`} onClick={e => this.setItem(value)}>
                    <div className={`circle ${name}`} />
                </div>
            );
        });

        return (
            <div className="wrapper_edit_projects_modal">
                <div className="edit_projects_modal_background" />
                <div className="edit_projects_modal_container">
                    <div className="edit_projects_modal_header">
                        <div className="edit_projects_modal_header_title">{v_edit_project}</div>
                        <i className="edit_projects_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="edit_projects_modal_data">
                        <div className="edit_projects_modal_data_input_container" data-label={v_edit_project_name}>
                            <input
                                type="text"
                                className="edit_project_input"
                                ref={input => {
                                    this.editProjectInput = input;
                                }}
                                placeholder={`${v_project_name}...`}
                            />
                            <div
                                className="edit_projects_modal_data_select_container"
                                onClick={e => this.toggleSelect()}
                            >
                                <div className="select_main">
                                    <div className={`circle ${this.state.selectedValue.name}`} />
                                </div>
                                <i className={`vector ${this.state.listOpen ? 'vector_up' : ''}`} />
                                {this.state.listOpen && <div className="select_list">{selectItems}</div>}
                            </div>
                            <ClientsDropdown
                                clientSelect={this.clientSelect}
                                editedClient={selectedClient}
                                clientsList={this.props.clientsList?.filter(item => item.is_active)}
                                vocabulary={vocabulary}
                            />
                            <div className="edit-project__users-select-wrapper" data-label={v_add_member}>
                                <div
                                    className="edit-project__users-selected"
                                    onClick={() => this.setState(prev => ({ showUsersSelect: !prev.showUsersSelect }))}
                                >
                                    {!!selectedUsers.length ? (
                                        <span className="edit-project__users-selected-text">
                                            {selectedUsers.map(item => item.username).join(', ')}
                                        </span>
                                    ) : (
                                        <span className="edit-project__placeholder">{v_member}</span>
                                    )}
                                    <i
                                        className={`edit-project__vector ${
                                            showUsersSelect ? 'edit-project__vector--up' : ''
                                        }`}
                                    />
                                </div>
                                {showUsersSelect && (
                                    <div className="edit-project__dropdown-container">
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
                                    selectedProject={selectedProject}
                                />
                            )}
                        </div>
                    </div>
                    <div className="edit_projects_modal_button_container">
                        <button
                            className="edit_projects_modal_button_container_button"
                            onClick={e => this.changeProject()}
                        >
                            {v_save}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

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
)(EditProjectModal);
