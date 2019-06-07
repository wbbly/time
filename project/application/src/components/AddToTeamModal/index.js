import React, { Component } from 'react';

// Services
import { getCurrentTeamDataFromLocalStorage } from '../../services/currentTeamDataStorageService';
import { apiCall } from '../../services/apiService';
import { ROLES } from '../../services/authentication';

// Components

// Actions

// Queries
import { AppConfig } from '../../config';

// Config

// Styles
import './style.css';

class AddToTeamModal extends Component {
    addUser = email => {
        apiCall(AppConfig.apiURL + 'user/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamId: getCurrentTeamDataFromLocalStorage().id,
                teamName: getCurrentTeamDataFromLocalStorage().name,
                email: email,
            }),
        }).then(
            result => {
                if (result.invitedUserId) {
                    this.props.programersArr.unshift({
                        role_collaboration: {
                            title: ROLES.ROLE_MEMBER,
                        },
                        user: [
                            {
                                id: result.invitedUserId[0].user_id,
                                username: this.email.value,
                                role: ROLES.ROLE_MEMBER,
                                email: this.email.value,
                                is_active: true,
                            },
                        ],
                    });
                    alert('Invite has been sent!');
                } else {
                    alert('An error occured while sending an invite to the user!');
                }

                this.closeModal();
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => {
                        alert(JSON.parse(errorMessage).message);
                    });
                } else {
                    console.log(err);
                }
            }
        );
    };

    closeModal() {
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: false });
    }

    render() {
        return (
            <div className="wrapper_add_user_modal">
                <div className="add_user_modal_background" />
                <div className="add_user_modal_container">
                    <div className="add_user_modal_header">
                        <div className="add_user_modal_header_title">Invite to team</div>
                        <i className="add_user_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="add_user_modal_data">
                        <div className="add_user_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.email = input;
                                }}
                                placeholder={'Email...'}
                            />
                        </div>
                    </div>
                    <div className="add_user_modal_button_container">
                        <button
                            className="add_user_modal_button_container_button"
                            onClick={e => this.addUser(this.email.value)}
                        >
                            Add user
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddToTeamModal;
