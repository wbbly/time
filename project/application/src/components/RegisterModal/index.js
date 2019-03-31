import React, { Component } from 'react';
import './style.css';
import { AppConfig } from '../../config';

const ROLE_USER = 'e1f1f00c-abee-448c-b65d-cdd51bb042f1';
const ROLE_ADMIN = '449bca08-9f3d-4956-a38e-7b5de27bdc73';

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
                roleId: ROLE_USER,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
            })
            .then(
                result => {
                    alert('connect with admin to activate your account');
                    this.props.toggleRegisterModal('TOGGLE_REGISTER_MODAL', { registerModal: false });
                },
                err =>
                    err.text().then(errorMessage => {
                        alert(JSON.parse(errorMessage).message);
                    })
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
