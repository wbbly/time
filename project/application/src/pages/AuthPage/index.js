import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Services
import { userLoggedIn } from '../../services/authentication';
import {
    setUserToLocalStorage,
    getUserEmailFromLocalStorage,
    removeUserFromLocalStorage,
} from '../../services/userStorageService';
import { removeCurrentTimerFromLocalStorage } from '../../services/currentTimerStorageService';
import { removeServerClientTimediffFromLocalStorage } from '../../services/serverClientTimediffStorageService';
import { setCurrentTeamDataToLocalStorage } from '../../services/currentTeamDataStorageService';

// Components
import RegisterModal from '../../components/RegisterModal';

// Actions
import toggleRegisterModal from '../../actions/AuthPageAction';
import reportsPageAction from '../../actions/ReportsPageAction';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './index.css';

class AuthPage extends Component {
    state = {
        haveToken: false,
        authorisationModal: true,
    };

    login = (email, password) => {
        fetch(AppConfig.apiURL + 'user/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
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
                    setUserToLocalStorage(result.user);
                    this.props.reportsPageAction('SET_ACTIVE_USER', {
                        data: [getUserEmailFromLocalStorage()],
                    });
                    this.setState({ haveToken: true });
                    fetch(AppConfig.apiURL + `team/current?userId=${result.user.id}`).then(res =>
                        res.json().then(response => {
                            const currentTeam = response.data.user_team[0] || {};
                            const currentTeamInfo = currentTeam.team || {};
                            const currentTeamRoleCollaboration = currentTeam.role_collaboration || {};
                            setCurrentTeamDataToLocalStorage({
                                id: currentTeamInfo.id,
                                name: currentTeamInfo.name,
                                role: currentTeamRoleCollaboration.title,
                            });
                        })
                    );
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

    componentWillMount() {}

    render() {
        if (userLoggedIn() || this.state.haveToken) return <Redirect to={'/timer'} />;

        removeUserFromLocalStorage();
        removeCurrentTimerFromLocalStorage();
        removeServerClientTimediffFromLocalStorage();

        return (
            <div className="wrapper_authorisation_page">
                {this.props.authPageReducer && <RegisterModal toggleRegisterModal={this.props.toggleRegisterModal} />}
                <i className="page_title" />
                <div className="authorisation_window">
                    <div className="input_container">
                        <input type="text" ref={input => (this.email = input)} placeholder="Add your login..." />
                        <div className="input_title">Login</div>
                    </div>
                    <div className="input_container">
                        <input
                            type="password"
                            ref={input => (this.password = input)}
                            placeholder="Add your password..."
                        />
                        <div className="input_title">Password</div>
                    </div>
                    <button
                        className="login_button"
                        onClick={e => {
                            this.login(this.email.value, this.password.value);
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="registration_button"
                        onClick={e => {
                            this.props.toggleRegisterModal('TOGGLE_REGISTER_MODAL', { registerModal: true });
                        }}
                    >
                        Registration
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        authPageReducer: store.authPageReducer.registerModal,
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
)(AuthPage);
