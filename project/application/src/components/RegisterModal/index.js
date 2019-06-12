import React, { Component } from 'react';

// Services
import { apiCall } from '../../services/apiService';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class RegisterModal extends Component {
    state = {
        passwordVisible: true,
    };

    addUser = (email, password, userName) => {
        apiCall(
            AppConfig.apiURL + 'user/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            },
            false
        ).then(
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
    changeVisible = () => {
        this.setState({ passwordVisible: !this.state.passwordVisible });
    };

    render() {
        return (
            <div className="register_modal_wrapper">
                <div className="add_to_team_modal_data">
                    <i
                        className="close"
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
                            type={this.state.passwordVisible ? 'password' : 'text'}
                            ref={input => {
                                this.password = input;
                            }}
                            className="add_to_team_modal_input"
                        />
                        <i className="visible_password_eye" onClick={e => this.changeVisible()} />
                    </div>
                    <button onClick={e => this.addUser(this.email.value, this.password.value)}>Add user</button>
                </div>
            </div>
        );
    }
}

export default RegisterModal;
