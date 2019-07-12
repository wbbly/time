import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Services
import { logoutByUnauthorized } from '../../services/authentication';

// Components
import Input from '../../components/BaseComponents/Input';
import SwitchLanguage from '../../components/SwitchLanguage';

// Actions
import toggleRegisterModal from '../../actions/AuthPageAction';
import reportsPageAction from '../../actions/ReportsPageAction';

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
            },
            confirmPassword: {
                value: '',
                type: 'password',
                name: 'confirmPassword',
            },
        },
    };

    changePassword = ({ password, confirmPassword }, token) => {
        const { history, vocabulary } = this.props;
        const { v_a_password_same_error, v_a_change_password_great_ok } = vocabulary;

        if (password !== confirmPassword) {
            alert(v_a_password_same_error);

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
                    alert(v_a_change_password_great_ok);
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
        this.setState({ token: this.props.location.search.substring(7) });
    }

    render() {
        const { vocabulary } = this.props;
        const { v_new_password, v_add_your_password, v_cofirm_password, v_change_password } = vocabulary;

        const { inputs } = this.state;
        const { password, confirmPassword } = inputs;

        logoutByUnauthorized(false);

        return (
            <div className="wrapper_authorization_page">
                <SwitchLanguage />
                <i className="page_title" />
                <form className="authorization_window" onSubmit={this.onSubmitHandler} noValidate>
                    <label className="input_container">
                        <span className="input_title">{v_new_password}</span>
                        <Input
                            config={{
                                value: password.value,
                                placeholder: `${v_add_your_password}...`,
                                type: password.type,
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

const mapDispatchToProps = dispatch => {
    return {
        toggleRegisterModal: (actionType, action) => dispatch(toggleRegisterModal(actionType, action))[1],
        reportsPageAction: (actionType, toggle) => dispatch(reportsPageAction(actionType, toggle))[1],
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ResetPasswordPage)
);
