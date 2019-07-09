import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { apiCall } from '../../services/apiService';
import { ROLES } from '../../services/authentication';

// Components

// Actions

// Queries
import { AppConfig } from '../../config';

// Config

// Styles
import './style.css';

class AddToTeamModal extends Component {
    addUser = email => {
        const { vocabulary } = this.props;
        const { v_a_invite_sent, v_a_invite_sent_error } = vocabulary;
        apiCall(AppConfig.apiURL + 'user/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            }),
        }).then(
            result => {
                if (result.invitedUserId) {
                    this.props.programersArr.unshift({
                        role_collaboration: {
                            title: ROLES.ROLE_MEMBER,
                        },
                        user: [
                            {
                                id: result.invitedUserId[0].user_id,
                                username: this.email.value,
                                role: ROLES.ROLE_MEMBER,
                                email: this.email.value,
                                is_active: true,
                            },
                        ],
                    });
                    alert(v_a_invite_sent);
                } else {
                    alert(v_a_invite_sent_error);
                }

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
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: false });
    }

    render() {
        const { vocabulary } = this.props;
        const { v_invite_to_team, v_add_user } = vocabulary;
        return (
            <div className="wrapper_add_user_modal">
                <div className="add_user_modal_background" />
                <div className="add_user_modal_container">
                    <div className="add_user_modal_header">
                        <div className="add_user_modal_header_title">{v_invite_to_team}</div>
                        <i className="add_user_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="add_user_modal_data">
                        <div className="add_user_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.email = input;
                                }}
                                placeholder={'Email...'}
                            />
                        </div>
                    </div>
                    <div className="add_user_modal_button_container">
                        <button
                            className="add_user_modal_button_container_button"
                            onClick={e => this.addUser(this.email.value)}
                        >
                            {v_add_user}
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

export default connect(mapStateToProps)(AddToTeamModal);
