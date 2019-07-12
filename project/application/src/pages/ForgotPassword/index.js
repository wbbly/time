import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Services
import { authValidation } from '../../services/validateService';

// Components
import Input from '../../components/BaseComponents/Input';
import SwitchLanguage from '../../components/SwitchLanguage';

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class ForgotPassword extends Component {
    state = {
        validEmail: true,
        inputs: {
            email: {
                value: '',
                type: 'email',
                name: 'email',
            },
        },
    };

    addUser = ({ email }) => {
        const { history, vocabulary } = this.props;
        const { v_check_email } = vocabulary;
        fetch(AppConfig.apiURL + 'user/reset-password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.toLowerCase(),
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
            })
            .then(
                result => {
                    alert(v_check_email);
                    history.push('/login');
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
        this.addUser(userData);
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
        const { email } = inputs;

        const { vocabulary } = this.props;
        const { v_send, v_enter_email } = vocabulary;

        return (
            <div className="forgot_password_modal_wrapper">
                <SwitchLanguage />
                <i className="page_title" />
                <form className="add_to_team_modal_data" onSubmit={this.onSubmitHandler} noValidate>
                    <label className="add_to_team_modal_input_container">
                        <span className="add_to_team_modal_input_title">Email</span>
                        <Input
                            config={{
                                valid: validEmail,
                                type: email.type,
                                name: email.name,
                                value: email.value,
                                onChange: this.onChangeHandler,
                                placeholder: `${v_enter_email}...`,
                                className: 'add_to_team_modal_input',
                            }}
                        />
                    </label>
                    <button type="submit">{v_send}</button>
                </form>
            </div>
        );
    }
}

export default withRouter(ForgotPassword);
