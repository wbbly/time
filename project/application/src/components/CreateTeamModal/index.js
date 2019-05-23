import React, { Component } from 'react';

// Services

// Components

// Actions

// Queries

// Config

// Styles
import './style.css';

export default class CreateTeamModal extends Component {
    addTeam() {
        const createTeam = (this.createTeamInput.value || '').trim();
        if (createTeam.length) {
            this.props.createTeamRequest(createTeam);
            this.closeModal();
        } else {
            alert("Project name can't be empty!");
        }
    }

    getWrapper() {
        return document.querySelector('.wrapper');
    }

    addZIndexToWrapper() {
        const wrapper = this.getWrapper();
        if (wrapper) {
            wrapper.classList.add('wrapper_z-index-1');
        }
    }

    removeZIndexFromWrapper() {
        const wrapper = this.getWrapper();
        if (wrapper) {
            wrapper.classList.remove('wrapper_z-index-1');
        }
    }

    closeModal() {
        this.removeZIndexFromWrapper();
        this.props.teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: false });
    }

    render() {
        this.addZIndexToWrapper();

        return (
            <div className="wrapper_create_team_modal">
                <div className="create_team_modal_background" />
                <div className="create_team_modal_container">
                    <div className="create_team_modal_header">
                        <div className="create_team_modal_header_title">Create team</div>
                        <i className="create_team_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="create_team_modal_data">
                        <div className="create_team_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.createTeamInput = input;
                                }}
                                placeholder={'Team name...'}
                            />
                        </div>
                    </div>
                    <div className="create_team_modal_button_container">
                        <button className="create_team_modal_button_container_button" onClick={e => this.addTeam()}>
                            Create team
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
