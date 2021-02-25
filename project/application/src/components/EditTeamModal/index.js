import React, { Component } from 'react';
import { connect } from 'react-redux';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createMuiTheme, Checkbox } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

// Services
import { ROLES } from '../../services/authentication';
import { apiCall } from '../../services/apiService';

// Components
import TechnologyComponent from '../TechnologyComponent';

// Actions
import { changeUserData } from '../../actions/UserActions';
import { getCurrentTeamDetailedDataAction } from '../../actions/TeamActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

const materialTheme = createMuiTheme({
    overrides: {
        MuiSvgIcon: {
            root: {
                fontSize: '24px',
            },
        },
    },
});

const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    NOT_ACTIVE: 'NOT_ACTIVE',
};

class EditTeamModal extends Component {
    state = {
        id: null,
        value: ROLES.ROLE_MEMBER,
        isOwner: false,
        valueStatus: USER_STATUS.NOT_ACTIVE,
        valueDeleteMember: false,
        userTechnologies: [],
    };

    closeModal() {
        this.props.teamPageAction('TOGGLE_EDIT_USER_MODAL', { editUserModal: false });
    }

    addUser = () => {
        const { vocabulary, changeUserData, getCurrentTeamDetailedDataAction, showNotificationAction } = this.props;

        if (this.state.valueDeleteMember) {
            apiCall(AppConfig.apiURL + `user/${this.state.id}/team/remove-from-team`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            }).then(
                result => {
                    if (result.message) {
                        showNotificationAction({ text: vocabulary[result.message], type: 'success' });
                    }
                    this.closeModal();
                    getCurrentTeamDetailedDataAction();
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => {
                            const textError = JSON.parse(errorMessage).message;
                            showNotificationAction({ text: vocabulary[textError], type: 'error' });
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
        } else {
            apiCall(AppConfig.apiURL + `user/${this.state.id}/team`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.email.value,
                    username: this.name.value,
                    isActive: this.state.valueStatus === USER_STATUS.ACTIVE,
                    roleName: this.state.isOwner ? this.props.editedUser.role_collaboration.title : this.state.value,
                    technologies: this.state.userTechnologies.map(item => item.id),
                }),
            }).then(
                result => {
                    if (result.message) {
                        showNotificationAction({ text: vocabulary[result.message], type: 'success' });
                    } else {
                        changeUserData(result);
                    }
                    this.closeModal();
                    getCurrentTeamDetailedDataAction();
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => {
                            const textError = JSON.parse(errorMessage).message;
                            showNotificationAction({ text: vocabulary[textError], type: 'error' });
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
        }
    };

    handleChange = event => {
        this.setState({ value: event.target.value });
    };

    handleChangeStatus = event => {
        this.setState({ valueStatus: event.target.value });
    };

    handleChangeDeleteMember = event => {
        this.setState({ valueDeleteMember: event.target.checked });
    };

    componentDidMount() {
        const currentUser = this.props.editedUser.user[0] || {};
        const { id, username, email, userTechnologies } = currentUser;
        const isOwner = id === this.props.owner_id;
        const role = isOwner ? ROLES.ROLE_OWNER : this.props.editedUser.role_collaboration.title;
        const isActive = this.props.editedUser.is_active;

        this.setState({
            id,
            value: role,
            isOwner: isOwner,
            valueStatus: isActive ? USER_STATUS.ACTIVE : USER_STATUS.NOT_ACTIVE,
            userTechnologies: userTechnologies ? userTechnologies.map(item => item.technology) : [],
        });
        this.email.value = email;
        this.name.value = username;
    }

    render() {
        const { vocabulary } = this.props;

        const {
            v_name,
            v_team_role,
            v_team_access,
            v_save,
            v_active,
            v_not_active,
            v_delete_member,
            v_tags,
        } = vocabulary;

        return (
            <div className="edit_team_modal_wrapper">
                <div className="edit_team_modal_data">
                    <i onClick={e => this.closeModal()} />
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">E-mail</div>
                        <input
                            type="text"
                            ref={input => {
                                this.email = input;
                            }}
                            className="edit_team_modal_input"
                        />
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">{v_name}</div>
                        <input
                            type="text"
                            ref={input => {
                                this.name = input;
                            }}
                            className="edit_team_modal_input"
                        />
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">{v_team_role}</div>
                        <ThemeProvider theme={materialTheme}>
                            <RadioGroup onChange={this.handleChange} value={this.state.value}>
                                <FormControlLabel
                                    value={ROLES.ROLE_ADMIN}
                                    control={<Radio color="primary" />}
                                    label="Admin"
                                    disabled={this.state.isOwner}
                                />
                                <FormControlLabel
                                    value={ROLES.ROLE_MEMBER}
                                    control={<Radio color="primary" />}
                                    label="User"
                                    disabled={this.state.isOwner}
                                />
                                {this.state.isOwner && (
                                    <FormControlLabel
                                        value={ROLES.ROLE_OWNER}
                                        control={<Radio color="primary" />}
                                        label="Owner"
                                    />
                                )}
                            </RadioGroup>
                        </ThemeProvider>
                    </div>
                    <div className="edit_team_modal_input_container">
                        <div className="edit_team_modal_input_title">{v_team_access}</div>
                        <ThemeProvider theme={materialTheme}>
                            <RadioGroup onChange={this.handleChangeStatus} value={this.state.valueStatus}>
                                <FormControlLabel
                                    value={USER_STATUS.ACTIVE}
                                    control={<Radio color="primary" />}
                                    label={v_active}
                                />
                                <FormControlLabel
                                    value={USER_STATUS.NOT_ACTIVE}
                                    control={<Radio color="primary" />}
                                    label={v_not_active}
                                />
                            </RadioGroup>
                        </ThemeProvider>
                        <div className="edit-team-modal__technology">
                            <div className="edit-team-modal__technology-title">{v_tags}</div>
                            <TechnologyComponent
                                userTechnologies={this.state.userTechnologies}
                                setUserTechnologies={techArr => {
                                    this.setState({ userTechnologies: techArr });
                                }}
                                showNotificationAction={this.props.showNotificationAction}
                                vocabulary={vocabulary}
                                themeLight={true}
                            />
                        </div>
                    </div>
                    <div className="delete_team_modal_input_container">
                        {!this.state.isOwner && (
                            <ThemeProvider theme={materialTheme}>
                                <FormControlLabel
                                    value={this.state.valueDeleteMember}
                                    control={<Checkbox color="primary" />}
                                    label={v_delete_member}
                                    onChange={this.handleChangeDeleteMember}
                                />
                            </ThemeProvider>
                        )}
                    </div>
                    <button className="save_button" onClick={e => this.addUser()}>
                        {v_save}
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    vocabulary: store.languageReducer.vocabulary,
    owner_id: store.teamReducer.currentTeam.data.owner_id,
});

const mapDispatchToProps = {
    changeUserData,
    getCurrentTeamDetailedDataAction,
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditTeamModal);
