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
    state = {
        validEmail: true,
        inputs: {
            password: {
                value: '',
                type: 'password',
                name: 'password',
            },
            newPassword: {
                value: '',
                type: 'password',
                name: 'newPassword',
            },
            confirmNewPassword: {
                value: '',
                type: 'password',
                name: 'confirmNewPassword',
            },
        },
    };

    addUser = ({ password, newPassword, confirmNewPassword }) => {
        const { vocabulary } = this.props;
        const { v_a_password_same_error, v_a_change_password_ok } = vocabulary;

        if (newPassword !== confirmNewPassword) {
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
                        const textError = JSON.parse(errorMessage).message;
                        alert(vocabulary[textError]);
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

    onSubmitHandler = event => {
        event.preventDefault();
        const { inputs } = this.state;
        const userData = Object.keys(inputs).reduce((acc, curr) => ({ ...acc, [curr]: inputs[curr].value }), {});
        this.addUser(userData);
    };

    onChangeHandler = event => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            inputs: {
                ...prevState.inputs,
                [name]: {
                    ...prevState.inputs[name],
                    value,
                },
            },
        }));
    };

    render() {
        const { vocabulary } = this.props;
        const {
            v_change_password,
            v_current_password,
            v_new_password,
            v_cofirm_new_password,
            v_save_changes,
        } = vocabulary;

        const { inputs } = this.state;
        const { password, newPassword, confirmNewPassword } = inputs;
        return (
            <div className="wrapper_change_password_modal">
                <div className="change_password_modal_background" />
                <form className="change_password_modal_container" onSubmit={this.onSubmitHandler} noValidate>
                    <div className="change_password_modal_header">
                        <div className="change_password_modal_header_title">{v_change_password}</div>
                        <i className="change_password_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="change_password_modal_data">
                        <label className="change_password_modal_data_input_container">
                            <Input
                                config={{
                                    type: password.type,
                                    name: password.name,
                                    value: password.value,
                                    onChange: this.onChangeHandler,
                                    maxLength: '30',
                                    placeholder: `${v_current_password}...`,
                                }}
                            />
                        </label>
                    </div>
                    <div className="change_password_modal_data">
                        <label className="change_password_modal_data_input_container">
                            <Input
                                config={{
                                    type: newPassword.type,
                                    name: newPassword.name,
                                    value: newPassword.value,
                                    onChange: this.onChangeHandler,
                                    maxLength: '30',
                                    placeholder: `${v_new_password}...`,
                                }}
                            />
                        </label>
                    </div>
                    <div className="change_password_modal_data">
                        <label className="change_password_modal_data_input_container">
                            <Input
                                config={{
                                    type: confirmNewPassword.type,
                                    name: confirmNewPassword.name,
                                    value: confirmNewPassword.value,
                                    onChange: this.onChangeHandler,
                                    maxLength: '30',
                                    placeholder: `${v_cofirm_new_password}...`,
                                }}
                            />
                        </label>
                    </div>
                    <div className="change_password_modal_button_container">
                        <button type="submit" className="change_password_modal_button_container_button">
                            {v_save_changes}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(ChangePasswordModal);
