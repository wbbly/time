import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Services
import { ROLES } from '../../services/authentication';
import { apiCall } from '../../services/apiService';
import { Trans } from 'react-i18next';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    NOT_ACTIVE: 'NOT_ACTIVE',
};

class EditTeamModal extends Component {
    state = {
        id: null,
        value: ROLES.ROLE_MEMBER,
        valueStatus: USER_STATUS.NOT_ACTIVE,
    };

    closeModal() {
        this.props.teamPageAction('TOGGLE_EDIT_USER_MODAL', { editUserModal: false });
    }

    addUser = teamPage => {
        apiCall(AppConfig.apiURL + `user/${this.state.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.email.value,
                username: this.name.value,
                isActive: this.state.valueStatus === USER_STATUS.ACTIVE,
                roleName: this.state.value,
            }),
        }).then(
            result => {
                this.closeModal();
                this.props.getDataFromServer(teamPage);
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

    handleChange = event => {
        this.setState({ value: event.target.value });
    };

    handleChangeStatus = event => {
        this.setState({ valueStatus: event.target.value });
    };

    render() {
        return (
            <div className="edit_team_modal_wrapper">
                <div className="edit_team_modal_data">
                    <i onClick={e => this.closeModal()} />
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">
                            E-mail
                        </div>
                        <input
                            type="text"
                            ref={input => {
                                this.email = input;
                            }}
                            className="edit_team_modal_input"
                        />
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">
                            <Trans i18nKey="name">Name</Trans>

                        </div>
                        <input
                            type="text"
                            ref={input => {
                                this.name = input;
                            }}
                            className="edit_team_modal_input"
                        />
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">
                            <Trans i18nKey="team_roles">Team Role</Trans>

                        </div>
                        <RadioGroup onChange={this.handleChange} value={this.state.value}>
                            <FormControlLabel
                                value={ROLES.ROLE_ADMIN}
                                control={<Radio color="primary" />}
                                label="Admin"
                            />
                            <FormControlLabel
                                value={ROLES.ROLE_MEMBER}
                                control={<Radio color="primary" />}
                                label="User"
                            />
                        </RadioGroup>
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">
                           <Trans i18nKey="team_access">Team Access</Trans>
                        </div>
                        <RadioGroup onChange={this.handleChangeStatus} value={this.state.valueStatus}>
                            <FormControlLabel
                                value={USER_STATUS.ACTIVE}
                                control={<Radio color="primary" />}
                                label="Active"
                            />
                            <FormControlLabel
                                value={USER_STATUS.NOT_ACTIVE}
                                control={<Radio color="primary" />}
                                label="Not active"
                            />
                        </RadioGroup>
                    </div>
                    <button onClick={e => this.addUser(this.props.teamPage)}>
                        <Trans i18nKey="edit_user">Edit user</Trans>
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const currentUser = this.props.editedUser.user[0] || {};
        const { id, username, email } = currentUser;
        const role = this.props.editedUser.role_collaboration.title;
        const isActive = this.props.editedUser.is_active;

        this.setState({
            id,
            value: role,
            valueStatus: isActive ? USER_STATUS.ACTIVE : USER_STATUS.NOT_ACTIVE,
        });
        this.email.value = email;
        this.name.value = username;
    }
}

export default EditTeamModal;
