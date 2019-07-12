import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

// Services
import { userLoggedIn, logoutByUnauthorized } from '../../services/authentication';
import { setTokenToLocalStorage, getLoggedUserEmail, getLoggedUserLanguage } from '../../services/tokenStorageService';
import { setCurrentTeamDataToLocalStorage } from '../../services/currentTeamDataStorageService';
import { apiCall } from '../../services/apiService';
import { authValidation } from '../../services/validateService';

// Components
import Input from '../../components/BaseComponents/Input';
import SwitchLanguage from '../../components/SwitchLanguage';

// Actions
import reportsPageAction from '../../actions/ReportsPageAction';
import { setLanguage } from '../../actions/LanguageActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class AuthPage extends Component {
    state = {
        haveToken: false,
        validEmail: true,
        inputs: {
            email: {
                value: '',
                type: 'email',
                name: 'email',
            },
            password: {
                value: '',
                type: 'password',
                name: 'password',
                required: true
            },
        },
    };

    login = ({ email, password }) => {
        const { setLanguage, vocabulary } = this.props;

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
                setLanguage(getLoggedUserLanguage());
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
                        const textError = JSON.parse(errorMessage).message;
                        alert(vocabulary[textError]);
                    });
                } else {
                    console.log(err);
                }
            }
        );
    };

    onSubmitHandler = event => {
        event.preventDefault();
        const { inputs } = this.state;
        const userData = Object.keys(inputs).reduce((acc, curr) => {
            if (curr === 'email') {
                return { ...acc, [curr]: inputs[curr].value.toLowerCase() };
            }
            return { ...acc, [curr]: inputs[curr].value };
        }, {});
        if (authValidation('email', userData.email)) {
            this.setState({ validEmail: false });
            return;
        }
        this.setState({ validEmail: true });
        this.login(userData);
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
        const { validEmail, inputs } = this.state;
        const { email, password } = inputs;
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
                <SwitchLanguage />
                <i className="page_title" />
                <form className="authorisation_window" onSubmit={this.onSubmitHandler}>
                    <label className="input_container">
                        <span className="input_title">{v_login}</span>
                        <Input
                            config={{
                                valid: validEmail,
                                type: email.type,
                                name: email.name,
                                value: email.value,
                                onChange: this.onChangeHandler,
                                placeholder: `${v_add_your_login}...`,
                            }}
                        />
                    </label>
                    <label className="input_container">
                        <span className="input_title">{v_password}</span>
                        <Input
                            config={{
                                type: password.type,
                                name: password.name,
                                required: password.required,
                                value: password.value,
                                onChange: this.onChangeHandler,
                                placeholder: `${v_add_your_password}...`,
                            }}
                        />
                    </label>
                    <button type="submit" className="login_button">
                        {v_enter}
                    </button>
                    <button
                        type="button"
                        className="forgot_password_button"
                        onClick={e => history.push('/forgot-password')}
                    >
                        {v_forgot_your_password}?
                    </button>
                </form>
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
    setLanguage: lang => dispatch(setLanguage(lang)),
});

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(AuthPage)
);
