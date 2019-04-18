import React, { Component } from 'react';
import './style.css';

import { addProjectPreProcessing } from '../../services/mutationProjectsFunction';
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { AppConfig } from '../../config';

export default class EditProjectModal extends Component {
    state = {
        selectedValue: {
            id: 'a642f337-9082-4f64-8ace-1d0e99fa7258',
            name: 'blue',
        },
        listOpen: false,
        selectValue: [],
        projectId: '',
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
        const project = addProjectPreProcessing(this.createProjectInput.value, this.state.selectedValue.id);
        if (!project) {
            return null;
        }

        let object = {
            id: this.state.projectId,
            name: this.createProjectInput.value,
            colorProject: this.state.selectedValue.id,
        };

        fetch(AppConfig.apiURL + `project/${object.id}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.createProjectInput.value,
                projectColorId: this.state.selectedValue.id,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                result => {
                    this.props.getProjects();
                    this.closeModal();
                },
                err =>
                    err.text().then(errorMessage => {
                        const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(err));

                        if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                            alert('Project is already existed');
                        } else {
                            alert(`Project can't be created`);
                        }
                    })
            );
    }

    closeModal = () => {
        this.props.projectsPageAction('TOGGLE_EDIT_PROJECT_MODAL', { tableData: false });
    };

    render() {
        let selectItems = this.state.selectValue.map(value => (
            <div className={`item`} onClick={e => this.setItem(value)}>
                <div className={`circle ${value.name}`} />
            </div>
        ));

        return (
            <div className="edit_project_modal_wrapper">
                <div className="edit_project_modal_background">
                    <div className="edit_project_modal_container">
                        <div className="create_projects_modal_header">
                            <div className="create_projects_modal_header_title">Create project</div>
                            <i className="create_projects_modal_header_close" onClick={e => this.closeModal()} />
                        </div>
                        <div className="create_projects_modal_data">
                            <div className="create_projects_modal_data_input_container">
                                <input
                                    type="text"
                                    ref={input => {
                                        this.createProjectInput = input;
                                    }}
                                    placeholder={'Project name...'}
                                />
                                <div
                                    className="create_projects_modal_data_select_container"
                                    onClick={e => this.toggleSelect()}
                                >
                                    <div className="select_main">
                                        <div className={`circle ${this.state.selectedValue.name}`} />
                                    </div>
                                    <i className="vector" />
                                    {this.state.listOpen && <div className="select_list">{selectItems}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="create_projects_modal_button_container">
                            <button
                                className="create_projects_modal_button_container_button"
                                onClick={e => this.changeProject()}
                            >
                                Create project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        fetch(AppConfig.apiURL + `project-color/list`, {
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
                    let data = result.data;
                    this.setState({ selectValue: data.project_color });
                },
                err => err.text().then(errorMessage => {})
            );

        fetch(AppConfig.apiURL + `project/${this.props.editedProject.id}`, {
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
                    let data = result.data;
                    this.setState({ projectId: data.project_v2[0].id });
                    this.setItem({
                        id: data.project_v2[0].project_color.id,
                        name: data.project_v2[0].project_color.name,
                    });
                    this.createProjectInput.value = data.project_v2[0].name;
                },
                err => err.text().then(errorMessage => {})
            );
    }
}
