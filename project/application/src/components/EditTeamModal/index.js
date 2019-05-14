import React, { Component } from 'react';
import './style.css';
import { AppConfig } from '../../config';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ROLES, checkIsAdminByRole } from '../../services/authentication';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';

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
        fetch(AppConfig.apiURL + `user/${this.state.id}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'x-admin-id': getUserIdFromLocalStorage(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.email.value,
                username: this.name.value,
                role: checkIsAdminByRole(this.state.value) ? ROLES.ROLE_ADMIN : ROLES.ROLE_MEMBER,
                isActive: this.state.valueStatus === USER_STATUS.ACTIVE,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
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
                        <div className="edit_team_modal_input_title">Email</div>
                        <input
                            type="text"
                            ref={input => {
                                this.email = input;
                            }}
                            className="edit_team_modal_input"
                        />
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">Name</div>
                        <input
                            type="text"
                            ref={input => {
                                this.name = input;
                            }}
                            className="edit_team_modal_input"
                        />
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">Role</div>
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
                        <div className="edit_team_modal_input_title">Status</div>
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
                    <button onClick={e => this.addUser(this.props.teamPage)}>Edit user</button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.setState({ value: this.props.editedUser.role.title });
        this.setState({ id: this.props.editedUser.id });
        this.setState({ valueStatus: this.props.editedUser.is_active ? USER_STATUS.ACTIVE : USER_STATUS.NOT_ACTIVE });
        this.email.value = this.props.editedUser.email;
        this.name.value = this.props.editedUser.username;
    }
}

export default EditTeamModal;
