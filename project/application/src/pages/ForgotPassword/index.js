import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Services

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class ForgotPassword extends Component {
    addUser = email => {
        const { history, vocabulary } = this.props;
        const { v_check_email } = vocabulary;
        fetch(AppConfig.apiURL + 'user/reset-password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.toLowerCase(),
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
            })
            .then(
                result => {
                    alert(v_check_email);
                    // this.closeModal();
                    history.push('/login');
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

    // closeModal() {
    //     this.props.toggleRegisterModal('TOGGLE_FORGOT_PASSWORD_MODAL', { forgotPasswordModal: false });
    // }

    render() {
        const { vocabulary } = this.props;
        const { v_send, v_enter_email } = vocabulary;
        return (
            <div className="forgot_password_modal_wrapper">
                <i className="page_title" />
                <div className="add_to_team_modal_data">
                    {/* <i onClick={e => this.closeModal()} /> */}
                    <div className="add_to_team_modal_input_container">
                        <div className="add_to_team_modal_input_title">Email</div>
                        <input
                            type="email"
                            ref={input => {
                                this.email = input;
                            }}
                            placeholder={`${v_enter_email}...`}
                            className="add_to_team_modal_input"
                        />
                    </div>
                    <button onClick={e => this.addUser(this.email.value)}>{v_send}</button>
                </div>
            </div>
        );
    }
}

export default withRouter(ForgotPassword);
