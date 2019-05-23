import React, { Component } from 'react';

// Services

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class RegisterModal extends Component {
    addUser = (email, password, userName) => {
        fetch(AppConfig.apiURL + 'user/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
            })
            .then(
                result => {
                    alert('Account has been created.');
                    this.props.toggleRegisterModal('TOGGLE_REGISTER_MODAL', { registerModal: false });
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

    render() {
        return (
            <div className="register_modal_wrapper">
                <div className="add_to_team_modal_data">
                    <i
                        onClick={e => this.props.toggleRegisterModal('TOGGLE_REGISTER_MODAL', { registerModal: false })}
                    />
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
                    <button onClick={e => this.addUser(this.email.value, this.password.value)}>Add user</button>
                </div>
            </div>
        );
    }
}

export default RegisterModal;
