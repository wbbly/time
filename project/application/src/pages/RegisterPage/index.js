import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Services
import { apiCall } from '../../services/apiService';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class RegisterPage extends Component {
    state = {
        inputs: {
            email: {
                value: '',
                type: 'email',
                name: 'email',
                required: true,
            },
            password: {
                value: '',
                type: 'password',
                name: 'password',
                required: true,
            },
            confirmPassword: {
                value: '',
                type: 'password',
                name: 'confirmPassword',
                required: true,
            },
        },
    };

    addUser = ({ email, password }) => {
        const { history, vocabulary } = this.props;
        const { v_a_account_create } = vocabulary;
        apiCall(
            AppConfig.apiURL + 'user/register',
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
                alert(v_a_account_create);
                history.push('/login');
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

    onSubmitHandler = event => {
        const { vocabulary } = this.props;
        const { v_a_confirm_password_error } = vocabulary;
        event.preventDefault();
        const { inputs } = this.state;
        const userData = Object.keys(inputs).reduce((acc, curr) => {
            if (curr === 'email') {
                return { ...acc, [curr]: inputs[curr].value.toLowerCase() };
            }
            return { ...acc, [curr]: inputs[curr].value };
        }, {});
        if (userData.confirmPassword !== userData.password) {
            alert(v_a_confirm_password_error);
            return;
        }
        this.addUser(userData);
    };

    toLoginPage = event => {
        const { history } = this.props;
        history.push('/login');
    };

    render() {
        const { email, password, confirmPassword } = this.state.inputs;
        const { vocabulary } = this.props;
        const {
            v_login,
            v_add_your_login,
            v_add_your_password,
            v_password,
            v_cofirm_password,
            v_add_confirm_password,
            v_register,
            v_already_have_an_account,
            v_log_in,
            v_registration_terms_and_policy,
        } = vocabulary;
        return (
            <div className="register-block">
                <i className="register-block__logo" />
                <form className="register-block__form" onSubmit={this.onSubmitHandler}>
                    <label className="register-block__label">
                        {v_login}
                        <input
                            className="register-block__input"
                            onChange={this.onChangeHandler}
                            name={email.name}
                            value={email.value}
                            type={email.type}
                            placeholder={`${v_add_your_login}...`}
                            required={email.required}
                        />
                    </label>
                    <label className="register-block__label">
                        {v_password}
                        <input
                            className="register-block__input"
                            onChange={this.onChangeHandler}
                            name={password.name}
                            value={password.value}
                            type={password.type}
                            placeholder={`${v_add_your_password}...`}
                            required={password.required}
                        />
                    </label>
                    <label className="register-block__label">
                        {v_cofirm_password}
                        <input
                            className="register-block__input"
                            onChange={this.onChangeHandler}
                            name={confirmPassword.name}
                            value={confirmPassword.value}
                            type={confirmPassword.type}
                            placeholder={`${v_add_confirm_password}...`}
                            required={confirmPassword.required}
                        />
                    </label>
                    <button className="register-block__button register-block__button--submit" type="submit">
                        {v_register}
                    </button>
                </form>
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

export default withRouter(RegisterPage);
