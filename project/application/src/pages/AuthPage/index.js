import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

// Services
import { setTokenToLocalStorage, getTokenFromLocalStorage } from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';
import { authValidation } from '../../services/validateService';

// Components
import Input from '../../components/BaseComponents/Input';
import SwitchLanguageLogin from '../../components/SwitchLanguageLogin';
import FacebookButton from '../../components/FacebookButton';

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
                required: true,
            },
        },
    };

    setHaveToken = () =>
        this.setState({
            haveToken: true,
        });

    login = ({ email, password }) => {
        const { vocabulary, showNotificationAction } = this.props;

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
                document.cookie = 'isAuthWobbly=true; path=/; domain=.wobbly.me;';
                this.setState({ haveToken: true });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => {
                        const textError = JSON.parse(errorMessage).message;
                        showNotificationAction({ text: vocabulary[textError], type: 'error' });
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
        const { validEmail, inputs, haveToken } = this.state;
        const { email, password } = inputs;
        const { history, vocabulary } = this.props;
        const {
            v_email,
            v_add_your_email,
            v_add_your_password,
            v_password,
            v_enter,
            v_forgot_your_password,
            v_dont_have_an_account_yet,
            v_sign_up,
            v_or,
        } = vocabulary;

        if (haveToken || getTokenFromLocalStorage()) return <Redirect to={'/timer'} />;

        return (
            <div className="wrapper_authorisation_page">
                <div className="fixed_right_corner">
                    <SwitchLanguageLogin dropdown />
                </div>
                <i className="page_title" />
                <form className="authorisation_window" onSubmit={this.onSubmitHandler}>
                    <label className="input_container">
                        <span className="input_title">{v_email}</span>
                        <Input
                            config={{
                                valid: validEmail,
                                type: email.type,
                                name: email.name,
                                value: email.value,
                                onChange: this.onChangeHandler,
                                placeholder: `${v_add_your_email}...`,
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
                    <div className={'or'} style={{ visibility: 'hidden' }}>
                        {v_or}
                    </div>
                    {/* <FacebookButton setHaveToken={this.setHaveToken} login={this.login} /> */}
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
    showNotificationAction: payload => dispatch(showNotificationAction(payload)),
});

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(AuthPage)
);
