import React, { Component } from 'react';

// Services
import { apiCall } from '../../services/apiService';
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';

// Components

// Actions

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class ChangePasswordModal extends Component {
    state = {
        currentPassword: true,
        newPassword: true,
        repeat: true,
    };

    addUser = (password, newPassword, newPasswordRepeat) => {
        if (newPassword !== newPasswordRepeat) {
            alert('The passwords are not the same!');

            return false;
        }

        apiCall(AppConfig.apiURL + 'user/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
            },
            body: JSON.stringify({
                password,
                newPassword,
            }),
        }).then(
            result => {
                alert("You've been successfully changed the password!");
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
        this.props.userSettingAction('TOGGLE_MODAL', false);
    }

    changeVisiblePassword = (value) => {
        this.setState({[value]: !this.state[value]})
    };

    render() {
        return (
            <div className="wrapper_change_password_modal">
                <div className="change_password_modal_background" />
                <div className="change_password_modal_container">
                    <div className="change_password_modal_header">
                        <div className="change_password_modal_header_title">Change password</div>
                        <i className="change_password_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <input
                                type={this.state.currentPassword ? 'password' : 'text'}
                                ref={input => {
                                    this.currentPassword = input;
                                }}
                                maxLength="30"
                                placeholder={'Current password'}
                            />
                            <i className="visible_password_eye" onClick={e =>this.changeVisiblePassword('currentPassword')}></i>
                        </div>
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <input
                                type={this.state.newPassword ? 'password' : 'text'}
                                ref={input => {
                                    this.newPassword = input;
                                }}
                                maxLength="30"
                                placeholder={'New password'}
                            />
                            <i className="visible_password_eye" onClick={e =>this.changeVisiblePassword('newPassword')}></i>
                        </div>
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <input
                                type={this.state.repeat ? 'password' : 'text'}
                                ref={input => {
                                    this.newPasswoerdCopy = input;
                                }}
                                maxLength="30"
                                placeholder={'Repeat new password'}
                            />
                            <i className="visible_password_eye" onClick={e =>this.changeVisiblePassword('repeat')}></i>
                        </div>
                    </div>
                    <div className="change_password_modal_button_container">
                        <button
                            className="change_password_modal_button_container_button"
                            onClick={e =>
                                this.addUser(
                                    this.currentPassword.value,
                                    this.newPassword.value,
                                    this.newPasswoerdCopy.value
                                )
                            }
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChangePasswordModal;
