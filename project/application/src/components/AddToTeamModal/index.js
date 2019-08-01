import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { apiCall } from '../../services/apiService';
import { ROLES } from '../../services/authentication';
import { authValidation } from '../../services/validateService';

// Components
import Input from '../../components/BaseComponents/Input';

// Actions
import { addInvitedUserToCurrentTeamDetailedDataAction } from '../../actions/TeamActions';

// Queries
import { AppConfig } from '../../config';

// Config

// Styles
import './style.css';

class AddToTeamModal extends Component {
    state = {
        validEmail: true,
        inputs: {
            email: {
                value: '',
                type: 'email',
                name: 'email',
            },
        },
    };

    addUser = ({ email }) => {
        const { vocabulary, addInvitedUserToCurrentTeamDetailedDataAction } = this.props;
        const { v_a_invite_sent, v_a_invite_sent_error } = vocabulary;
        const { inputs } = this.state;

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
                    alert(v_a_invite_sent);
                    addInvitedUserToCurrentTeamDetailedDataAction({
                        is_active: false,
                        role_collaboration: {
                            title: ROLES.ROLE_MEMBER,
                        },
                        user: [
                            {
                                email: inputs.email.value,
                                id: result.invitedUserId[0].user_id,
                                username: inputs.email.value,
                            },
                        ],
                    });
                } else {
                    alert(v_a_invite_sent_error);
                }

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
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: false });
    }

    onSubmitHandler = event => {
        event.preventDefault();
        const { inputs } = this.state;
        const userData = Object.keys(inputs).reduce((acc, curr) => ({ ...acc, [curr]: inputs[curr].value }), {});
        if (authValidation('email', userData.email)) {
            this.setState({ validEmail: false });
            return;
        }
        this.setState({ validEmail: true });
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
        const { v_invite_to_team, v_add_user } = vocabulary;
        const { validEmail, inputs } = this.state;
        const { email } = inputs;
        return (
            <div className="wrapper_add_user_modal">
                <div className="add_user_modal_background" />
                <div className="add_user_modal_container">
                    <div className="add_user_modal_header">
                        <div className="add_user_modal_header_title">{v_invite_to_team}</div>
                        <i className="add_user_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <form className="add_user_modal_data" onSubmit={this.onSubmitHandler} noValidate>
                        <label className="add_user_modal_data_input_container">
                            <Input
                                config={{
                                    valid: validEmail,
                                    type: email.type,
                                    name: email.name,
                                    value: email.value,
                                    placeholder: 'Email...',
                                    onChange: this.onChangeHandler,
                                }}
                            />
                        </label>
                        <button type="submit" className="add_user_modal_button_container_button">
                            {v_add_user}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

const mapDispatchToProps = {
    addInvitedUserToCurrentTeamDetailedDataAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddToTeamModal);
