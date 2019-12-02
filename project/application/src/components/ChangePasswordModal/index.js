import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { userChangePassword } from '../../configAPI';

// Components
import ChangePasswordForm from '../ChangePasswordForm';

// Actions
import { toggleModal } from '../../actions/UserActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// Config

// Styles
import './style.scss';

class ChangePasswordModal extends Component {
    closeModal() {
        this.props.toggleModal(false);
    }

    submitForm = async ({ newPassword, password }) => {
        const { vocabulary, showNotificationAction } = this.props;
        const { v_a_change_password_ok } = vocabulary;

        try {
            await userChangePassword({
                password,
                newPassword,
            });
            showNotificationAction({ text: v_a_change_password_ok, type: 'success' });
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

    render() {
        const { vocabulary } = this.props;
        const { v_change_password } = vocabulary;

        return (
            <div className="wrapper_change_password_modal">
                <div className="change_password_modal_background" />
                <div className="change_password_modal_container">
                    <div className="change_password_modal_header">
                        <div className="change_password_modal_header_title">{v_change_password}</div>
                        <i className="change_password_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <ChangePasswordForm withOldPassword submitForm={this.submitForm} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

const mapDispatchToProps = {
    toggleModal,
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePasswordModal);
