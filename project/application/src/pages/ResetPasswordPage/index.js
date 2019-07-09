import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

// Services
import { logoutByUnauthorized } from '../../services/authentication';

// Components
import Input from '../../components/BaseComponents/Input';
// import RegisterModal from '../../components/RegisterModal';
// import ForgotPasswordModal from '../../components/ForgotPasswordModal';

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
    };

    changePassword = (password, newPassword, token) => {
        const { history, vocabulary } = this.props;
        const { v_a_password_same_error, v_a_change_password_great_ok } = vocabulary;

        if (password !== newPassword) {
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

    componentDidMount() {
        this.setState({ token: this.props.location.search.substring(7) });
    }

    render() {
        const { vocabulary } = this.props;
        const { v_new_password, v_add_your_password, v_cofirm_password, v_change_password } = vocabulary;

        logoutByUnauthorized(false);

        return (
            <div className="wrapper_authorization_page">
                <i className="page_title" />
                <div className="authorization_window">
                    <div className="input_container">
                        <Input ref={input => (this.password1 = input)} placeholder={`${v_add_your_password}...`} />
                        <div className="input_title">{v_new_password}</div>
                    </div>
                    <div className="input_container">
                        <Input ref={input => (this.password2 = input)} placeholder={`${v_cofirm_password}...`} />
                        <div className="input_title">{v_cofirm_password}</div>
                    </div>
                    <button
                        className="login_button"
                        onClick={e => {
                            this.changePassword(
                                this.password1.state.value,
                                this.password2.state.value,
                                this.state.token
                            );
                        }}
                    >
                        {v_change_password}
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ResetPasswordPage)
);
