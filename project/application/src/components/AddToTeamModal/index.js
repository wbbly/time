import React, { Component } from 'react';
import './style.css';

import { getTimestamp } from '../../services/timeService';
import { ROLES } from '../../services/authentication';
import { AppConfig } from '../../config';

class AddToTeamModal extends Component {
    addUser = email => {
        fetch(AppConfig.apiURL + 'user/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: 'DUMMY_PASSWORD_TO_BE_GENERATED',
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
                        id: getTimestamp(),
                        username: this.email.value,
                        email: this.email.value,
                        role: { title: ROLES.ROLE_USER },
                        is_active: false,
                    });

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
                    <button onClick={e => this.addUser(this.email.value, this.password.value)}>Add user</button>
                </div>
            </div>
        );
    }
}

export default AddToTeamModal;
