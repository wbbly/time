import React, {Component} from 'react';

// Services
import {apiCall} from '../../services/apiService';
import { getTokenFromLocalStorage } from '../../services/tokenStorageService'

// Components

// Actions

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class ChangePasswordModal extends Component {
    addUser = (current, newP, newCopy) => {
        if (newP !== newCopy) {
            alert('new password not same');
            return
        }
        apiCall(AppConfig.apiURL + 'user/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `'Bearer ${getTokenFromLocalStorage()}'`,

            },
            body: JSON.stringify({
                password: current,
                newPassword: newP
            }),
        }).then(
            result => {
                alert("You've been successfully changed the password!");
                this.closeModal()
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

    render() {
        return (
            <div className="wrapper_change_password_modal">
                <div className="change_password_modal_background"/>
                <div className="change_password_modal_container">
                    <div className="change_password_modal_header">
                        <div className="change_password_modal_header_title">Change password</div>
                        <i className="change_password_modal_header_close" onClick={e => this.closeModal()}/>
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.currentPassword = input;
                                }}
                                placeholder={'Current password'}
                            />
                        </div>
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.newPassword = input;
                                }}
                                placeholder={'New password'}
                            />
                        </div>
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.newPasswoerdCopy = input;
                                }}
                                placeholder={'New password again'}
                            />
                        </div>
                    </div>
                    <div className="change_password_modal_button_container">
                        <button
                            className="change_password_modal_button_container_button"
                            onClick={e => this.addUser(this.currentPassword.value, this.newPassword.value, this.newPasswoerdCopy.value)}
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
