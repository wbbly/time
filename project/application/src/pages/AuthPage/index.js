import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

// Services
import { setTokenToLocalStorage, getTokenFromLocalStorage } from '../../services/tokenStorageService';
import { signIn } from '../../configAPI';

// Components
import SwitchLanguageLogin from '../../components/SwitchLanguageLogin';
import FacebookButton from '../../components/FacebookButton';
import LoginForm from '../../components/LoginForm';

// Actions
import reportsPageAction from '../../actions/ReportsPageAction';
import { showNotificationAction } from '../../actions/NotificationActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class AuthPage extends Component {
    state = {
        haveToken: false,
    };

    setHaveToken = () =>
        this.setState({
            haveToken: true,
        });

    submitForm = async values => {
        const { vocabulary, showNotificationAction } = this.props;
        try {
            const response = await signIn(values);
            setTokenToLocalStorage(response.data.token);
            document.cookie = 'isAuthWobbly=true; path=/; domain=.wobbly.me;';
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

    render() {
        const { haveToken } = this.state;
        const { history, vocabulary, isMobile } = this.props;
        const { v_forgot_your_password, v_dont_have_an_account_yet, v_sign_up, v_or } = vocabulary;

        if (haveToken || getTokenFromLocalStorage()) return <Redirect to={'/timer'} />;

        return (
            <div className="wrapper_authorisation_page">
                <div className="fixed_right_corner">
                    <SwitchLanguageLogin dropdown />
                </div>
                <i className="page_title" />
                <div className="authorisation_container">
                    <LoginForm submitForm={this.submitForm} />
                    {AppConfig.socialAuth.active &&
                        !isMobile && (
                            <>
                                <div className={'or'}>{v_or}</div>
                                <FacebookButton setHaveToken={this.setHaveToken} login={this.login} />
                            </>
                        )}
                    <button
                        type="button"
                        className="forgot_password_button"
                        onClick={e => history.push('/forgot-password')}
                    >
                        {v_forgot_your_password}?
                    </button>
                </div>
                <button
                    onClick={e => history.push('/register')}
                    className="register-block__button register-block__button--to-login"
                    type="button"
                >
                    {v_dont_have_an_account_yet}? {v_sign_up}
                </button>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = dispatch => ({
    reportsPageAction: (actionType, toggle) => dispatch(reportsPageAction(actionType, toggle))[1],
    showNotificationAction: payload => dispatch(showNotificationAction(payload)),
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AuthPage)
);
