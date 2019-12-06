import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Services
import { ROLES } from '../../services/authentication';
import { showNotificationAction } from '../../actions/NotificationActions';
import { userInvite } from '../../configAPI';

// Components
import Input from '../../components/BaseComponents/Input';

// Actions
import { addInvitedUserToCurrentTeamDetailedDataAction } from '../../actions/TeamActions';

// Queries

// Config

// Styles
import './style.css';

class AddToTeamModal extends Component {
    addUser = async email => {
        const { vocabulary, addInvitedUserToCurrentTeamDetailedDataAction, showNotificationAction } = this.props;
        const { v_a_invite_sent, v_a_invite_sent_error } = vocabulary;

        try {
            const response = await userInvite({ email });
            if (response.data.invitedUserId) {
                showNotificationAction({ text: v_a_invite_sent, type: 'success' });
                addInvitedUserToCurrentTeamDetailedDataAction({
                    is_active: false,
                    role_collaboration: {
                        title: ROLES.ROLE_MEMBER,
                    },
                    user: [
                        {
                            email: email,
                            id: response.data.invitedUserId[0].user_id,
                            username: email,
                        },
                    ],
                });
            } else {
                showNotificationAction({ text: v_a_invite_sent_error, type: 'error' });
            }
            this.closeModal();
        } catch (error) {
            if (error.response && error.response.data.message) {
                const errorMsg = error.response.data.message;
                showNotificationAction({ text: vocabulary[errorMsg], type: 'error' });
            } else {
                console.log(error);
            }
        }
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
                    <Formik
                        validateOnChange={false}
                        validateOnBlur={false}
                        initialValues={{ email: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('v_a_incorect_email')
                                .required('v_empty_email'),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            this.addUser(values.email);
                            setSubmitting(false);
                        }}
                    >
                        {formik => (
                            <form className="add_user_modal_data" onSubmit={formik.handleSubmit} noValidate>
                                <Input
                                    config={{
                                        id: 'email',
                                        name: 'email',
                                        type: 'email',
                                        onChange: formik.handleChange,
                                        onBlur: formik.handleBlur,
                                        value: formik.values.email,
                                        placeholder: 'Email...',
                                    }}
                                    errorMsg={formik.errors.email}
                                    withValidation
                                />
                                <button type="submit" className="add_user_modal_button_container_button">
                                    {v_add_user}
                                </button>
                            </form>
                        )}
                    </Formik>
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
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddToTeamModal);
