import React, { Component } from 'react';

import './style.css';

export default class CreateTeamModal extends Component {
    addTeam() {
        const projectName = this.createTeamInput.value || '';
        if (projectName.length) {
            this.props.createTeamRequest(this.createTeamInput.value);
            this.props.teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: false });
        } else {
            alert("Project name can't be empty!");
        }
    }

    render() {
        return (
            <div className="wrapper_create_team_modal">
                <div className="create_team_modal_background" />
                <div className="create_team_modal_container">
                    <div className="create_team_modal_header">
                        <div className="create_team_modal_header_title">Create team</div>
                        <i
                            className="create_team_modal_header_close"
                            onClick={e => this.props.teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: false })}
                        />
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
