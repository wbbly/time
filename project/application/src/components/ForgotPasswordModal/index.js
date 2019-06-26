import React, { Component } from 'react';

// Services

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class ForgotPasswordModal extends Component {
    addUser = email => {
        fetch(AppConfig.apiURL + 'user/reset-password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
            })
            .then(
                result => {
                    alert('Check the email address for a password reset email');
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
        this.props.toggleRegisterModal('TOGGLE_FORGOT_PASSWORD_MODAL', { forgotPasswordModal: false });
    }

    render() {
        return (
            <div className="forgot_password_modal_wrapper">
                <div className="add_to_team_modal_data">
                    <i onClick={e => this.closeModal()} />
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
                    <button onClick={e => this.addUser(this.email.value)}>Send</button>
                </div>
            </div>
        );
    }
}

export default ForgotPasswordModal;
