import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

// Services
import { userLoggedIn, logoutByUnauthorized } from '../../services/authentication';
import { setTokenToLocalStorage, getLoggedUserEmail } from '../../services/tokenStorageService';
import { setCurrentTeamDataToLocalStorage } from '../../services/currentTeamDataStorageService';
import { apiCall } from '../../services/apiService';

// Components
import Input from '../../components/BaseComponents/Input';

// Actions
import reportsPageAction from '../../actions/ReportsPageAction';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class AuthPage extends Component {
    state = {
        haveToken: false,
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

    render() {
        const { history, vocabulary } = this.props;
        const {
            v_login,
            v_add_your_login,
            v_add_your_password,
            v_password,
            v_enter,
            v_forgot_your_password,
            v_dont_have_an_account_yet,
            v_sign_up,
        } = vocabulary;
        if (userLoggedIn() || this.state.haveToken) return <Redirect to={'/timer'} />;

        logoutByUnauthorized(false);

        return (
            <div className="wrapper_authorisation_page">
                <i className="page_title" />
                <div className="authorisation_window">
                    <div className="input_container">
                        <input
                            type="email"
                            ref={input => (this.email = input)}
                            placeholder={`${v_add_your_login}...`}
                        />
                        <div className="input_title">{v_login}</div>
                    </div>
                    <div className="input_container">
                        <Input
                            type="password"
                            ref={input => (this.password = input)}
                            placeholder={`${v_add_your_password}...`}
                        />
                        <div className="input_title">{v_password}</div>
                    </div>
                    <button
                        className="login_button"
                        onClick={e => {
                            this.login(this.email.value.toLocaleLowerCase(), this.password.state.value);
                        }}
                    >
                        {v_enter}
                    </button>
                    <button className="forgot_password_button" onClick={e => history.push('/forgot-password')}>
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

const mapDispatchToProps = dispatch => ({
    reportsPageAction: (actionType, toggle) => dispatch(reportsPageAction(actionType, toggle))[1],
});

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(AuthPage)
);
