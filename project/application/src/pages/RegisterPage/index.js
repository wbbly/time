import React, { Component } from 'react';

// Services
import { apiCall } from '../../services/apiService';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class RegisterPage extends Component {
    state = {
        inputs: {
            email: {
                value: '',
                label: 'E-mail',
                type: 'email',
                placeholder: 'Add your login...',
                name: 'email',
                required: true,
            },
            password: {
                value: '',
                label: 'Password',
                type: 'password',
                placeholder: 'Add your password...',
                name: 'password',
                required: true,
            },
            confirmPassword: {
                value: '',
                label: 'Confirm password',
                type: 'password',
                placeholder: 'Add your password...',
                name: 'confirmPassword',
                required: true,
            },
        },
    };

    addUser = ({ email, password }) => {
        const { history } = this.props;
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
                alert('Account has been created.');
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
            ...prevState,
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
        event.preventDefault();
        const { inputs } = this.state;
        const userData = Object.keys(inputs).reduce((acc, curr) => ({ ...acc, [curr]: inputs[curr].value }), {});
        if (userData.confirmPassword !== userData.password) return;
        this.addUser(userData);
    };

    toLoginPage = event => {
        const { history } = this.props;
        history.push('/login');
    };

    render() {
        const { inputs } = this.state;
        return (
            <div className="register-block">
                <i className="register-block__logo" />
                <form className="register-block__form" onSubmit={this.onSubmitHandler}>
                    {Object.keys(inputs).map(elem => {
                        const { value, label, type, placeholder, name, required } = inputs[elem];
                        return (
                            <label className="register-block__label" key={elem}>
                                {label}
                                <input
                                    className="register-block__input"
                                    onChange={this.onChangeHandler}
                                    name={name}
                                    value={value}
                                    type={type}
                                    placeholder={placeholder}
                                    required={required}
                                />
                            </label>
                        );
                    })}
                    <button className="register-block__button register-block__button--submit" type="submit">
                        Register
                    </button>
                </form>
                <button
                    onClick={this.toLoginPage}
                    className="register-block__button register-block__button--to-login"
                    type="button"
                >
                    Already have an account? Log in
                </button>
                <a
                    href="https://wobbly.me/terms.html"
                    className="register-block__link register-block__link--to-conditions"
                >
                    By registration you agree with Terms and Privacy policy
                </a>
            </div>
        );
    }
}

export default RegisterPage;
