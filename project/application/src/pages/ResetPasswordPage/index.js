import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Services
import { logoutByUnauthorized } from '../../services/authentication';
import { setPassword } from '../../configAPI';

// Components
import SwitchLanguageLogin from '../../components/SwitchLanguageLogin';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

// Queries

// Config

// Styles
import './style.scss';
import ChangePasswordForm from '../../components/ChangePasswordForm';

class ResetPasswordPage extends Component {
    submitForm = async password => {
        const { vocabulary, showNotificationAction, history, location } = this.props;
        const { v_a_change_password_great_ok } = vocabulary;

        try {
            await setPassword({
                password,
                token: location.search.substring(7),
            });
            showNotificationAction({ text: v_a_change_password_great_ok, type: 'success' });
            history.push('/login');
        } catch (error) {
            if (error.response && error.response.data.message) {
                const errorMsg = error.response.data.message;
                showNotificationAction({ text: vocabulary[errorMsg], type: 'error' });
            } else {
                console.log(error);
            }
        }
    };

    componentDidMount() {
        logoutByUnauthorized();
    }

    render() {
        return (
            <div className="wrapper_authorization_page">
                <div className="fixed_right_corner">
                    <SwitchLanguageLogin dropdown />
                </div>
                <i className="page_title" />
                <ChangePasswordForm submitForm={this.submitForm} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    authPageReducer: state.authPageReducer,
});

const mapDispatchToProps = {
    showNotificationAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ResetPasswordPage)
);
