import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        const userData = Object.keys(inputs).reduce((acc, curr) => {
            if (curr === 'email') {
                return { ...acc, [curr]: inputs[curr].value.toLowerCase() };
            }
            return { ...acc, [curr]: inputs[curr].value };
        }, {});
        if (userData.confirmPassword !== userData.password) {
            alert('Wrong confirm password value');
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
        const { viewport } = this.props;
        return (
            <div className="register-block" style={{ height: viewport.height }}>
                <i className="register-block__logo" />
                <form className="register-block__form" onSubmit={this.onSubmitHandler}>
                    <label className="register-block__label">
                        {email.label}
                        <input
                            className="register-block__input"
                            onChange={this.onChangeHandler}
                            name={email.name}
                            value={email.value}
                            type={email.type}
                            placeholder={email.placeholder}
                            required={email.required}
                        />
                    </label>
                    <label className="register-block__label">
                        {password.label}
                        <input
                            className="register-block__input"
                            onChange={this.onChangeHandler}
                            name={password.name}
                            value={password.value}
                            type={password.type}
                            placeholder={password.placeholder}
                            required={password.required}
                        />
                    </label>
                    <label className="register-block__label">
                        {confirmPassword.label}
                        <input
                            className="register-block__input"
                            onChange={this.onChangeHandler}
                            name={confirmPassword.name}
                            value={confirmPassword.value}
                            type={confirmPassword.type}
                            placeholder={confirmPassword.placeholder}
                            required={confirmPassword.required}
                        />
                    </label>
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

const mapStateToProps = state => ({
    viewport: state.responsiveReducer.viewport,
});

export default connect(mapStateToProps)(RegisterPage);
