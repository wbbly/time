import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Services
import { logoutByUnauthorized } from '../../services/authentication';

// Components
import Input from '../../components/BaseComponents/Input';
import SwitchLanguage from '../../components/SwitchLanguage';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class ResetPasswordPage extends Component {
    state = {
        token: '',
        inputs: {
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

    changePassword = ({ password, confirmPassword }, token) => {
        const { history, vocabulary, showNotificationAction } = this.props;
        const { v_a_password_same_error, v_a_change_password_great_ok } = vocabulary;

        if (password !== confirmPassword) {
            showNotificationAction({ text: v_a_password_same_error, type: 'warning' });
            return false;
        }

        fetch(AppConfig.apiURL + 'user/set-password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                password: confirmPassword,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                result => {
                    showNotificationAction({ text: v_a_change_password_great_ok, type: 'success' });
                    history.push('/login');
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
        const { inputs, token } = this.state;
        const userData = Object.keys(inputs).reduce((acc, curr) => ({ ...acc, [curr]: inputs[curr].value }), {});
        this.changePassword(userData, token);
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

    componentDidMount() {
        logoutByUnauthorized();
        this.setState({ token: this.props.location.search.substring(7) });
    }

    render() {
        const { vocabulary } = this.props;
        const { v_new_password, v_add_your_password, v_cofirm_password, v_change_password } = vocabulary;

        const { inputs } = this.state;
        const { password, confirmPassword } = inputs;

        return (
            <div className="wrapper_authorization_page">
                <SwitchLanguage />
                <i className="page_title" />
                <form className="authorization_window" onSubmit={this.onSubmitHandler}>
                    <label className="input_container">
                        <span className="input_title">{v_new_password}</span>
                        <Input
                            config={{
                                value: password.value,
                                placeholder: `${v_add_your_password}...`,
                                type: password.type,
                                required: password.required,
                                name: password.name,
                                onChange: this.onChangeHandler,
                            }}
                        />
                    </label>
                    <label className="input_container">
                        <span className="input_title">{v_cofirm_password}</span>
                        <Input
                            config={{
                                value: confirmPassword.value,
                                placeholder: `${v_cofirm_password}...`,
                                type: confirmPassword.type,
                                required: password.required,
                                name: confirmPassword.name,
                                onChange: this.onChangeHandler,
                            }}
                        />
                    </label>
                    <button type="submit" className="login_button">
                        {v_change_password}
                    </button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    authPageReducer: state.authPageReducer,
});

const mapDispatchToProps = {
    showNotificationAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ResetPasswordPage)
);
