import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { apiCall } from '../../services/apiService';
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';

// Components
import Input from '../../components/BaseComponents/Input';

// Actions

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class ChangePasswordModal extends Component {
    addUser = (password, newPassword, newPasswordRepeat) => {
        const { vocabulary } = this.props;
        const { v_a_password_same_error, v_a_change_password_ok } = vocabulary;

        if (newPassword !== newPasswordRepeat) {
            alert(v_a_password_same_error);

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
                alert(v_a_change_password_ok);
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

    render() {
        const { vocabulary } = this.props;
        const {
            v_change_password,
            v_current_password,
            v_new_password,
            v_cofirm_new_password,
            v_save_changes,
        } = vocabulary;
        return (
            <div className="wrapper_change_password_modal">
                <div className="change_password_modal_background" />
                <div className="change_password_modal_container">
                    <div className="change_password_modal_header">
                        <div className="change_password_modal_header_title">{v_change_password}</div>
                        <i className="change_password_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <Input
                                type="password"
                                ref={input => {
                                    this.currentPassword = input;
                                }}
                                maxLength="30"
                                placeholder={`${v_current_password}...`}
                            />
                        </div>
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <Input
                                type="password"
                                ref={input => {
                                    this.newPassword = input;
                                }}
                                maxLength="30"
                                placeholder={`${v_new_password}...`}
                            />
                        </div>
                    </div>
                    <div className="change_password_modal_data">
                        <div className="change_password_modal_data_input_container">
                            <Input
                                type="password"
                                ref={input => {
                                    this.newPasswoerdCopy = input;
                                }}
                                maxLength="30"
                                placeholder={`${v_cofirm_new_password}...`}
                            />
                        </div>
                    </div>
                    <div className="change_password_modal_button_container">
                        <button
                            className="change_password_modal_button_container_button"
                            onClick={e =>
                                this.addUser(
                                    this.currentPassword.state.value,
                                    this.newPassword.state.value,
                                    this.newPasswoerdCopy.state.value
                                )
                            }
                        >
                            {v_save_changes}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(ChangePasswordModal);
