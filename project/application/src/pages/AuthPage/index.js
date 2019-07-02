import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Services
import { userLoggedIn, logoutByUnauthorized } from '../../services/authentication';
import { setTokenToLocalStorage, getLoggedUserEmail } from '../../services/tokenStorageService';
import { setCurrentTeamDataToLocalStorage } from '../../services/currentTeamDataStorageService';
import { apiCall } from '../../services/apiService';
import { Trans } from 'react-i18next';
import { setLangToStorage, getLangFromStorage} from '../../services/localesService';
import i18n from './../../i18n';

// Components
import RegisterModal from '../../components/RegisterModal';

// Actions
import toggleRegisterModal from '../../actions/AuthPageAction';
import reportsPageAction from '../../actions/ReportsPageAction';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './index.css';


class AuthPage extends Component {
    state = {
        haveToken: false,
        authorisationModal: true,
    };

    changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    login = (email, password) => {
        apiCall(
            AppConfig.apiURL + 'user/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            },
            false
        ).then(
            result => {
                setTokenToLocalStorage(result.token);
                this.props.reportsPageAction('SET_ACTIVE_USER', {
                    data: [getLoggedUserEmail()],
                });
                this.setState({ haveToken: true });
                apiCall(AppConfig.apiURL + `team/current`).then(response => {
                    const currentTeam = response.data.user_team[0] || {};
                    const currentTeamInfo = currentTeam.team || {};
                    const currentTeamRoleCollaboration = currentTeam.role_collaboration || {};
                    setCurrentTeamDataToLocalStorage({
                        id: currentTeamInfo.id,
                        name: currentTeamInfo.name,
                        role: currentTeamRoleCollaboration.title,
                    });
                });
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

    componentWillMount() {}

    componentDidMount() {
        this.changeLanguage(getLangFromStorage());
        console.log(i18n.t('login'));
    }

    render() {
        console.log(this.props, 'withTranslation(\'translations\')');
        const { history, viewport} = this.props;
        if (userLoggedIn() || this.state.haveToken) return <Redirect to={'/timer'} />;

        logoutByUnauthorized(false);

        return (
            <div className="wrapper_authorisation_page" style={{ height: viewport.height - 1 }}>
                {this.props.authPageReducer && <RegisterModal toggleRegisterModal={this.props.toggleRegisterModal} />}
                <i className="page_title" />
                <div className="authorisation_window">
                    <div className="input_container">
                        <input type="text" ref={input => (this.email = input)} placeholder={i18n.t('add_your_login')} />
                        <div className="input_title">
                            <Trans i18nKey="login">Login</Trans>
                        </div>
                    </div>
                    <div className="input_container">
                        <input
                            type="password"
                            ref={input => (this.password = input)}
                            placeholder={i18n.t('add_your_password')}
                        />
                        <div className="input_title">
                            <Trans i18nKey="password">Password</Trans>
                        </div>
                    </div>
                    <button
                        className="login_button"
                        onClick={e => {
                            this.login(this.email.value.toLocaleLowerCase(), this.password.value);
                        }}
                    >
                        <Trans i18nKey="enter">Login</Trans>
                    </button>
                    <button className="forgot_password_button">
                        <Trans i18nKey="forgot_your_password">Forgot your password</Trans>?
                    </button>
                </div>
                <button
                    onClick={e => history.push('/register')}
                    className="register-block__button register-block__button--to-login"
                    type="button"
                >
                    <Trans i18nKey="don't_have_an_account_yet">Don't have an account yet</Trans>? <Trans i18nKey="sign_up">Sign up</Trans>
                </button>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        authPageReducer: store.authPageReducer.registerModal,
        viewport: store.responsiveReducer.viewport,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleRegisterModal: (actionType, action) => dispatch(toggleRegisterModal(actionType, action))[1],
        reportsPageAction: (actionType, toggle) => dispatch(reportsPageAction(actionType, toggle))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthPage);
