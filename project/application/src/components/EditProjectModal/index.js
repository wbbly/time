import React, { Component } from 'react';
import './style.css';

import { client } from "../../requestSettings";
import { getProjectColor, returnMutationLinkAddProject, changeProject, getSelectedProject } from "../../queries";

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
        let object = {
            id: this.state.projectId,
            name: this.createProjectInput.value,
            projectStatus: '21',
            team: 'Hr',
            colorProject: this.state.selectedValue.id,
        };
        client.request(changeProject(object)).then(data => {
            this.props.getProjects();
            this.closeModal()
        });
    }

    closeModal = () => {
        this.props.projectsPageAction('TOGGLE_EDIT_PROJECT_MODAL', {tableData: false})
    };


    render() {
        let selectItems = this.state.selectValue.map(value => (
            <div className={`item`} onClick={e => this.setItem(value)}>
                <div className={`circle ${value.name}`}/>
            </div>
        ));

        return (
            <div className="edit_project_modal_wrapper">
                <div className="edit_project_modal_background">
                    <div className="edit_project_modal_container">
                        <div className="create_projects_modal_header">
                            <div className="create_projects_modal_header_title">Create project</div>
                            <i
                                className="create_projects_modal_header_close"
                                onClick={e => this.closeModal()}
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
                                        <div className={`circle ${this.state.selectedValue.name}`}/>
                                    </div>
                                    <i className="vector"/>
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
        )
    }

    componentDidMount() {
        // console.log(this.props.editedProject, 'this.props.editedProject');
        client.request(getProjectColor()).then(data => {
            this.setState({selectValue: data.project_color});
        });

        client.request(getSelectedProject(this.props.editedProject.id)).then(data => {
            this.setState({projectId: data.project_v2[0].id});
            this.setItem(
                {
                    id: data.project_v2[0].project_color.id,
                    name: data.project_v2[0].project_color.name
                }
            );
            this.createProjectInput.value = data.project_v2[0].name;

            console.log(data.project_v2[0], 'this.props.editedProjectthis.props.editedProjectthis.props.editedProject');
        });
    }
}
