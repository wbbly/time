import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Services
import { userLoggedIn, logoutByUnauthorized } from '../../services/authentication';
import { setTokenToLocalStorage, getLoggedUserEmail } from '../../services/tokenStorageService';
import { setCurrentTeamDataToLocalStorage } from '../../services/currentTeamDataStorageService';
import { apiCall } from '../../services/apiService';

// Components
import RegisterModal from '../../components/RegisterModal';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';

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
        authorizationModal: true,
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

    render() {
        if (userLoggedIn() || this.state.haveToken) return <Redirect to={'/timer'} />;

        logoutByUnauthorized(false);

        return (
            <div className="wrapper_authorization_page">
                {this.props.authPageReducer.registerModal && (
                    <RegisterModal toggleRegisterModal={this.props.toggleRegisterModal} />
                )}
                {this.props.authPageReducer.forgotPasswordModal && (
                    <ForgotPasswordModal toggleRegisterModal={this.props.toggleRegisterModal} />
                )}
                <i className="page_title" />
                <div className="authorization_window">
                    <div className="input_container">
                        <input type="text" ref={input => (this.email = input)} placeholder="Add your login..." />
                        <div className="input_title">Login</div>
                    </div>
                    <div className="input_container">
                        <input
                            type="password"
                            ref={input => (this.password = input)}
                            placeholder="Add your password..."
                        />
                        <div className="input_title">Password</div>
                    </div>
                    <button
                        className="login_button"
                        onClick={e => {
                            this.login(this.email.value, this.password.value);
                        }}
                    >
                        Login
                    </button>
                    <div className="passwords_buttons_container">
                        <button
                            className="registration_button"
                            onClick={e => {
                                this.props.toggleRegisterModal('TOGGLE_REGISTER_MODAL', { registerModal: true });
                            }}
                        >
                            Registration
                        </button>
                        <button
                            className="registration_button"
                            onClick={e => {
                                this.props.toggleRegisterModal('TOGGLE_FORGOT_PASSWORD_MODAL', {
                                    forgotPasswordModal: true,
                                });
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        authPageReducer: store.authPageReducer,
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
