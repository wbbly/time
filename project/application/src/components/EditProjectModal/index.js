import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { addProjectPreProcessing } from '../../services/mutationProjectsFunction';
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { apiCall } from '../../services/apiService';

// Components
import ClientsDropdown from '../ClientsDropdown';
import ProjectsDropdown from '../ProjectsDropdown';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';
import { getClientsAction } from '../../actions/ClientsActions';
import { getRelationProjectsListAction } from '../../actions/ProjectsActions';

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
        relationProjectsList: null,
    };

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
        const { v_a_project_existed, v_a_project_edit_error } = vocabulary;
        const { selectedClient, selectedProject } = this.state;
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
                    jiraProjectId: selectedProject ? selectedProject.id : null,
                },
            }),
        }).then(
            result => {
                this.props.getProjects();
                this.closeModal();
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(error => {
                        const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(error));
                        if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                            showNotificationAction({ text: v_a_project_existed, type: 'warning' });
                        } else {
                            showNotificationAction({ text: v_a_project_edit_error, type: 'error' });
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
    }

    closeList = e => {
        const { listOpen } = this.state;
        if (listOpen && !e.target.closest('.edit_projects_modal_data_select_container')) {
            this.setState({ listOpen: false });
        }
    };

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeList);
    }

    componentDidUpdate(prevProps, prevState) {
        const { relationProjectsList } = this.props;
        if (prevProps.relationProjectsList !== relationProjectsList) {
            this.setState({ relationProjectsList });
        }
    }

    render() {
        const { vocabulary } = this.props;
        const { selectedClient, relationProjectsList, selectedProject } = this.state;
        const { v_edit_project, v_project_name, v_edit_project_name } = vocabulary;

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
                                <i className="vector" />
                                {this.state.listOpen && <div className="select_list">{selectItems}</div>}
                            </div>
                            <ClientsDropdown
                                clientSelect={this.clientSelect}
                                editedClient={selectedClient}
                                clientsList={this.props.clientsList}
                                vocabulary={vocabulary}
                            />
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
                            {v_edit_project}
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
});

const mapDispatchToProps = {
    showNotificationAction,
    getClientsAction,
    getRelationProjectsListAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProjectModal);
