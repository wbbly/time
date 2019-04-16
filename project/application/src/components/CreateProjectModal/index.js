import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import { client } from '../../requestSettings';
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { returnMutationLinkAddProject, getProjectColor } from '../../queries';

export default class CreateProjectModal extends Component {
    state = {
        selectedValue: {
            id: 'a642f337-9082-4f64-8ace-1d0e99fa7258',
            name: 'blue',
        },
        listOpen: false,
        selectValue: [],
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

    addProjectPreProcessing() {
        let ok = true;
        const projectName = this.createProjectInput.value.toLowerCase().trim();
        if (!projectName.length) {
            ok = false;
            alert(`Project name can't be empty`);
        } else if (projectName !== this.createProjectInput.value) {
            const r = window.confirm(`Project name will be changed to "${projectName}". Are you agree?`);
            ok = r === true;
        }

        if (ok) {
            return {
                id: +new Date(),
                name: projectName,
                colorProject: this.state.selectedValue,
            };
        }

        return null;
    }

    addProject(projects) {
        const project = this.addProjectPreProcessing();
        if (!project) {
            return null;
        }

        client.request(returnMutationLinkAddProject(project)).then(
            _ => {
                projects.push(project);
                this.props.projectsPageAction('CREATE_PROJECT', { toggle: false, tableData: projects });
            },
            err => {
                const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(err));

                if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                    alert('Project is already existed');
                } else {
                    alert(`Project can't be created`);
                }
            }
        );
    }

    render() {
        let selectItems = this.state.selectValue.map(value => (
            <div className={`item`} onClick={e => this.setItem(value)}>
                <div className={`circle ${value.name}`} />
            </div>
        ));

        return (
            <div className="wrapper_create_projects_modal">
                <div className="create_projects_modal_background" />
                <div className="create_projects_modal_container">
                    <div className="create_projects_modal_header">
                        <div className="create_projects_modal_header_title">Create project</div>
                        <i
                            className="create_projects_modal_header_close"
                            onClick={e => this.props.projectsPageAction('TOGGLE_MODAL', { toggle: false })}
                        />
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
                            onClick={e => this.addProject(this.props.tableInfo)}
                        >
                            Create project
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        client.request(getProjectColor()).then(data => {
            this.setState({ selectValue: data.project_color });
        });
    }
}

CreateProjectModal.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
