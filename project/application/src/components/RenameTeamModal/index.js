import React, { Component } from 'react';
import './style.css';

import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { AppConfig } from '../../config';
import { removeAvailableTeamsFromLocalStorage } from '../../services/teamStorageService';

export default class RenameTeamModal extends Component {
    state = {
        isOpen: true,
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
        fetch(AppConfig.apiURL + `team/rename`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamId: this.props.teamId,
                newName: this.teamNameRef.current.value,
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
                    this.props.refreshTeamName();
                    removeAvailableTeamsFromLocalStorage();
                    this.props.closeCallback();
                    this.closeModal();
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(error => {
                            console.error(err);
                            // if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                            //     alert('Project is already existed');
                            // } else {
                            //     alert(`Project can't be created`);
                            // }
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
    }

    closeModal = () => {
        this.setState({
            isOpen: false,
        });
    };

    render() {
        if (!this.state.isOpen) return null;
        return (
            <div className="edit_project_modal_wrapper">
                <div className="edit_project_modal_background">
                    <div className="edit_project_modal_container">
                        <div className="create_projects_modal_header">
                            <div className="create_projects_modal_header_title">Edit Team Name</div>
                            <i className="create_projects_modal_header_close" onClick={e => this.closeModal()} />
                        </div>
                        <div className="create_projects_modal_data">
                            <div className="create_projects_modal_data_input_container">
                                <input type="text" ref={this.teamNameRef} placeholder={'Team Name'} />
                            </div>
                        </div>
                        <div className="create_projects_modal_button_container">
                            <button
                                className="create_projects_modal_button_container_button"
                                onClick={e => this.renameTeam()}
                            >
                                Rename Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
