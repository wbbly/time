import React, { Component } from 'react';

// Services
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import { getCurrentTeamDataFromLocalStorage } from '../../services/currentTeamDataStorageService';
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
        fetch(AppConfig.apiURL + 'user/invite', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: getUserIdFromLocalStorage(),
                teamId: getCurrentTeamDataFromLocalStorage().id,
                teamName: getCurrentTeamDataFromLocalStorage().name,
                email: email,
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
                    this.props.programersArr.unshift({
                        role_collaboration: {
                            title: ROLES.ROLE_MEMBER,
                        },
                        user: [
                            {
                                id: result.invitedUserId,
                                username: this.email.value,
                                role: ROLES.ROLE_MEMBER,
                                email: this.email.value,
                                is_active: true,
                            },
                        ],
                    });

                    if (result.invitedUserId) alert('Invite has been sent!');

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
