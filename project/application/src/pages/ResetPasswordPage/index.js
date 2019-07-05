import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Services
import { logoutByUnauthorized } from '../../services/authentication';

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

class ResetPasswordPage extends Component {
    state = {
        haveToken: false,
        authorizationModal: true,
        passwordType: true,
        secondPasswordType: true,
        token: '',
        redirect: false,
    };

    changePassword(password, newPassword, token, resetPasswordPage) {
        if (password !== newPassword) {
            alert("The passwords you entered don't match!");

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
                password: newPassword,
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
                    alert('Great! You can sign in  now again!');
                    resetPasswordPage.setState({ redirect: true });
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
    }

    checkVisible = passwordField => {
        if (passwordField === 'passwordType') {
            return this.state.passwordType ? 'password' : 'text';
        } else if (passwordField === 'secondPasswordType') {
            return this.state.secondPasswordType ? 'password' : 'text';
        }
    };

    componentWillMount() {}

    componentDidMount() {
        this.setState({ token: this.props.location.search.substring(7) });
    }

    render() {
        if (this.state.redirect) return <Redirect to={'/login'} />;

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
                        <input
                            type={this.checkVisible('passwordType')}
                            ref={input => (this.password1 = input)}
                            placeholder="enter new password"
                        />
                        <div className="input_title">New password</div>
                        <i
                            className="visible_password_eye new_password"
                            onClick={e => {
                                this.setState({ passwordType: !this.state.passwordType });
                            }}
                        />
                    </div>
                    <div className="input_container">
                        <input
                            type={this.checkVisible('secondPasswordType')}
                            ref={input => (this.password2 = input)}
                            placeholder="repeat new password"
                        />
                        <div className="input_title">Confirm password</div>
                        <i
                            className="visible_password_eye new_password"
                            onClick={e => {
                                this.setState({ secondPasswordType: !this.state.secondPasswordType });
                            }}
                        />
                    </div>
                    <button
                        className="login_button"
                        onClick={e => {
                            this.changePassword(this.password1.value, this.password2.value, this.state.token, this);
                        }}
                    >
                        Change password
                    </button>
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
)(ResetPasswordPage);
