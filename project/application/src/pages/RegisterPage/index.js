import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Services
import { setTokenToLocalStorage, getTokenFromLocalStorage } from '../../services/tokenStorageService';
import { signUp } from '../../configAPI';

// Components
import SwitchLanguageLogin from '../../components/SwitchLanguageLogin';
import RegisterForm from '../../components/RegisterForm';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

// Queries

// Config

// Styles
import './style.scss';

class RegisterPage extends Component {
    state = {
        emailFromRedirect: null,
        haveToken: false,
    };

    toLoginPage = event => {
        const { history } = this.props;
        history.push('/login');
    };

    submitForm = async values => {
        const { vocabulary, showNotificationAction } = this.props;
        const { v_a_account_create, lang } = vocabulary;

        try {
            const response = await signUp({ ...values, language: lang.short });
            setTokenToLocalStorage(response.data.token);
            showNotificationAction({ text: v_a_account_create, type: 'success' });
            this.setState({ haveToken: true });
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
        if (window.location.href.indexOf('email') > 0) {
            let emailInput = window.location.href.split('=');
            this.setState({ emailFromRedirect: emailInput[emailInput.length - 1] });
        }
    }

    render() {
        const { emailFromRedirect, haveToken } = this.state;
        const { vocabulary } = this.props;
        const { v_already_have_an_account, v_log_in, v_registration_terms_and_policy } = vocabulary;

        if (haveToken || getTokenFromLocalStorage()) return <Redirect to={'/timer'} />;

        return (
            <div className={classNames('register-block', { 'register-block--mobile': true })}>
                <div className="fixed_right_corner">
                    <SwitchLanguageLogin dropdown />
                </div>
                <i className="register-block__logo" />
                <RegisterForm submitForm={this.submitForm} emailFromRedirect={emailFromRedirect} />
                <button
                    onClick={this.toLoginPage}
                    className="register-block__button register-block__button--to-login"
                    type="button"
                >
                    {v_already_have_an_account}? {v_log_in}
                </button>
                <a
                    href="https://wobbly.me/terms.html"
                    className="register-block__link register-block__link--to-conditions"
                >
                    {v_registration_terms_and_policy}
                </a>
            </div>
        );
    }
}

const mapDispatchToProps = {
    showNotificationAction,
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(RegisterPage)
);
