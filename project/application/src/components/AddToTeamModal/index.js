import React, { Component } from 'react';
import './style.css';

import { getTimestamp } from '../../services/timeService';
import { AppConfig } from '../../config';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import { getCurrentTeamDataFromLocalStorage } from '../../services/teamStorageService';

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
                            title: 'ROLE_MEMBER',
                        },
                        user: [
                            {
                                id: result.invitedUserId,
                                username: this.email.value,
                                role: 'ROLE_MEMBER',
                                email: this.email.value,
                                is_active: true,
                            },
                        ],
                    });

                    console.log(this.props.programersArr);
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
            <div className="add_to_team_modal_wrapper">
                <div className="add_to_team_modal_data">
                    <i onClick={e => this.closeModal()} />
                    {/*<div className="add_to_team_modal_input_container">*/}
                    {/*<div className="add_to_team_modal_input_title">Username</div>*/}
                    {/*<input*/}
                    {/*type="text"*/}
                    {/*ref={input => {*/}
                    {/*this.userName = input;*/}
                    {/*}}*/}
                    {/*className="add_to_team_modal_input"*/}
                    {/*/>*/}
                    {/*</div>*/}
                    <div className="add_to_team_modal_input_container">
                        <div className="add_to_team_modal_input_title">Email</div>
                        <input
                            type="text"
                            ref={input => {
                                this.email = input;
                            }}
                            className="add_to_team_modal_input"
                        />
                    </div>
                    <button onClick={e => this.addUser(this.email.value)}>Add user</button>
                </div>
            </div>
        );
    }
}

export default AddToTeamModal;
