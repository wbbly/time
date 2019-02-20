import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { client } from '../../requestSettings';
import { returnMutationLinkAddProject } from '../../queries';

export default class CreateProjectModal extends Component {
    state = {
        selectedValue: 'green',
        listOpen: false,
    };
    selectValue = ['green', 'red', 'blue', 'pink'];

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

    addProject(arr) {
        let object = {
            id: +new Date(),
            name: this.createProjectInput.value,
            projectStatus: '21',
            team: 'Hr',
            colorProject: this.state.selectedValue,
        };
        arr.push(object);
        this.props.projectsPageAction('CREATE_PROJECT', { toggle: false, tableData: arr });
        client.request(returnMutationLinkAddProject(object)).then(data => {});
    }

    render() {
        let selectItems = this.selectValue.map(value => (
            <div className={`item`} onClick={e => this.setItem(value)}>
                <div className={`circle ${value}`} />
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
                                    <div className={`circle ${this.state.selectedValue}`} />
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
}

CreateProjectModal.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
