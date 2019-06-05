import React, { Component } from 'react';

// Services
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import { responseErrorsHandling } from '../../services/responseErrorsHandling';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

export default class RenameTeamModal extends Component {
    state = {
        newTeamName: '',
    };

    constructor(props) {
        super(props);
        this.teamNameRef = React.createRef();
    }

    setItem(value) {
        this.setState({
            selectedValue: value,
        });
    }

    renameTeam() {
        const teamName = (this.teamNameRef.current.value || '').trim();
        if (teamName.length) {
            fetch(AppConfig.apiURL + `team/rename`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamId: this.props.teamId,
                    newName: teamName,
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
                        this.props.refreshTeamName(result);
                        this.props.closeCallback();
                    },
                    err => {
                        if (err instanceof Response) {
                            err.text().then(error => {
                                const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(error));
                                if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                                    alert('Team is already existed');
                                } else {
                                    alert(`Team can't be renamed`);
                                }
                            });
                        } else {
                            console.log(err);
                        }
                    }
                );
        } else {
            alert("Project name can't be empty!");
        }
    }

    render() {
        return (
            <div className="wrapper_rename_team_modal">
                <div className="rename_team_modal_background" />
                <div className="rename_team_modal_container">
                    <div className="rename_team_modal_header">
                        <div className="rename_team_modal_header_title">Edit Team Name</div>
                        <i className="rename_team_modal_header_close" onClick={e => this.props.closeCallback()} />
                    </div>
                    <div className="rename_team_modal_data">
                        <div className="rename_team_modal_data_input_container">
                            <input type="text" ref={this.teamNameRef} placeholder={'Team name...'} />
                        </div>
                    </div>
                    <div className="rename_team_modal_button_container">
                        <button className="rename_team_modal_button_container_button" onClick={e => this.renameTeam()}>
                            Rename Team
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
