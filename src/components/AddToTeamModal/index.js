import React, { Component } from 'react';
import './style.css';
import * as firebase from 'firebase';
import { returnMutationLinkAddUser } from '../../queries';
import { client } from '../../requestSettings';

class AddToTeamModal extends Component {
    addUser = (email, password, userName) => {
        this.props.programersArr.unshift({
            id: +new Date(),
            name: userName.value,
            email: email.value,
            status: 0,
        });

        client
            .request(
                returnMutationLinkAddUser({
                    name: userName.value,
                    email: email.value,
                    status: 0,
                })
            )
            .then(data => {});

        firebase
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value)
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
            });
        this.closeModal();
    };

    closeModal() {
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: false });
    }

    render() {
        return (
            <div className="add_to_team_modal_wrapper">
                <div className="add_to_team_modal_data">
                    <i onClick={e => this.closeModal()} />
                    <div className="add_to_team_modal_input_container">
                        <div className="add_to_team_modal_input_title">Username</div>
                        <input
                            type="text"
                            ref={input => {
                                this.userName = input;
                            }}
                            className="add_to_team_modal_input"
                        />
                    </div>
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
                    <div className="add_to_team_modal_input_container">
                        <div className="add_to_team_modal_input_title">Password</div>
                        <input
                            type="text"
                            ref={input => {
                                this.password = input;
                            }}
                            className="add_to_team_modal_input"
                        />
                    </div>
                    <button onClick={e => this.addUser(this.email, this.password, this.userName)}>Add user</button>
                </div>
            </div>
        );
    }
}
export default AddToTeamModal;
