import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import jwtDecode from 'jwt-decode';

// Actions
import userSettingAction from '../../actions/UserSettingAction';
import { setUserDataAction } from '../../actions/UserSettingAction';

//Components
import ChangePasswordModal from '../../components/ChangePasswordModal';
import SwitchLanguage from '../../components/SwitchLanguage';
import Input from '../../components/BaseComponents/Input';

//Services
import {
    getLoggedUserId,
    getTokenFromLocalStorage,
    setTokenToLocalStorage,
    getLoggedUser,
} from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';
import { authValidation } from '../../services/validateService';

//Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class UserSetting extends Component {
    state = {
        rotateArrowLoop: false,
        userSetJiraSync: false,
        validEmail: true,
        inputs: {
            userName: {
                value: '',
                type: 'text',
                name: 'userName',
            },
            email: {
                value: '',
                type: 'email',
                name: 'email',
            },
            jiraUsername: {
                value: '',
                type: 'text',
                name: 'jiraUsername',
                required: true,
            },
            jiraPassword: {
                value: '',
                type: 'password',
                name: 'jiraPassword',
                required: true,
            },
            syncJiraStatus: {
                checked: false,
                type: 'checkbox',
                name: 'syncJiraStatus',
            },
        },
    };

    changeUserSetting = ({ userName, email, tokenJira }) => {
        const { vocabulary, setUserDataAction } = this.props;
        const { v_a_data_updated_ok, lang } = vocabulary;

        const USER_ID = getLoggedUserId();
        apiCall(AppConfig.apiURL + `user/${USER_ID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
            },
            body: JSON.stringify({
                email,
                username: userName,
                language: lang.short,
                tokenJira,
            }),
        }).then(
            result => {
                if (result.token) {
                    setUserDataAction(jwtDecode(result.token));
                    setTokenToLocalStorage(result.token);
                    alert(v_a_data_updated_ok);
                    this.updateUserData();
                    this.setState({ userSetJiraSync: false });
                }
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

    onSubmitHandler = async event => {
        event.preventDefault();
        const { inputs, userSetJiraSync } = this.state;
        const { jiraUsername, jiraPassword, syncJiraStatus } = inputs;

        const userData = Object.keys(inputs).reduce((acc, curr) => {
            if (curr === 'syncJiraStatus' || curr === 'jiraUsername' || curr === 'jiraPassword') return acc;
            return { ...acc, [curr]: inputs[curr].value };
        }, {});
        if (authValidation('email', userData.email)) {
            this.setState({ validEmail: false });
            return;
        }
        this.setState({ validEmail: true });
        if (userSetJiraSync) {
            userData.tokenJira = syncJiraStatus.checked ? btoa(`${jiraUsername.value}:${jiraPassword.value}`) : '';
        }
        this.changeUserSetting(userData);
    };

    onChangeHandler = event => {
        const { name, value, checked } = event.target;
        if (name === 'syncJiraStatus') {
            this.setState(prevState => ({
                userSetJiraSync: true,
                inputs: {
                    ...prevState.inputs,
                    [name]: {
                        ...prevState.inputs[name],
                        checked,
                    },
                },
            }));
            return;
        }
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

    verifyJiraAuth = () => {
        this.setState({ rotateArrowLoop: true });
        const { vocabulary } = this.props;

        const { inputs } = this.state;
        const { jiraUsername, jiraPassword } = inputs;

        const tokenJira = btoa(`${jiraUsername.value}:${jiraPassword.value}`);

        return apiCall(AppConfig.apiURL + `sync/jira/my-permissions?token=${tokenJira}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
            },
        }).then(
            result => {
                this.setState({ rotateArrowLoop: false });
                alert(vocabulary[result.message]);
                return true;
            },
            err => {
                this.setState({ rotateArrowLoop: false });
                err.text().then(text => {
                    alert(vocabulary[JSON.parse(text).message]);
                    return false;
                });
            }
        );
    };

    componentDidMount() {
        this.setDataToForm();
    }

    render() {
        const { vocabulary, userSettingAction, isMobile } = this.props;
        const { v_my_profile, v_your_name, v_save_changes, v_change_password } = vocabulary;

        const { validEmail, inputs, userSetJiraSync, rotateArrowLoop } = this.state;
        const { userName, email, jiraUsername, jiraPassword, syncJiraStatus } = inputs;
        const { checked } = syncJiraStatus;

        // console.log('user', user);

        return (
            <div className={classNames('wrapper_user_setting_page', { 'wrapper_user_setting_page--mobile': isMobile })}>
                {Object.prototype.toString.call(this.props.userSettingReducer.changePasswordModal) ===
                    '[object Boolean]' &&
                    this.props.userSettingReducer.changePasswordModal && (
                        <ChangePasswordModal userSettingAction={userSettingAction} />
                    )}
                <div className="data_container">
                    <div className="header_user_setting">
                        <div>{v_my_profile}</div>
                        <button onClick={e => this.openChangePasswordModal()}>{v_change_password}</button>
                    </div>
                    <div className="body_user_setting">
                        <div className="column">{/*<i className="rectangle" />*/}</div>
                        <form className="column" onSubmit={this.onSubmitHandler}>
                            <label className="input_container">
                                <span className="input_title">{v_your_name}</span>
                                <Input
                                    config={{
                                        value: userName.value,
                                        type: userName.type,
                                        name: userName.name,
                                        onChange: this.onChangeHandler,
                                    }}
                                />
                            </label>
                            <label className="input_container">
                                <span className="input_title">E-Mail</span>
                                <Input
                                    config={{
                                        valid: validEmail,
                                        value: email.value,
                                        type: email.type,
                                        name: email.name,
                                        onChange: this.onChangeHandler,
                                    }}
                                />
                            </label>
                            <SwitchLanguage dropdown />

                            <div className="wrapper-jira-sync">
                                <label className="input_container input_checkbox_jira">
                                    <input
                                        type={syncJiraStatus.type}
                                        checked={syncJiraStatus.checked}
                                        name={syncJiraStatus.name}
                                        onChange={this.onChangeHandler}
                                    />
                                    <span className="input_title">Jira synchronization</span>
                                </label>
                                {checked &&
                                    userSetJiraSync && (
                                        <>
                                            <label className="input_container">
                                                <span className="input_title">Login</span>
                                                <Input
                                                    config={{
                                                        value: jiraUsername.value,
                                                        type: jiraUsername.type,
                                                        name: jiraUsername.name,
                                                        required: jiraUsername.required,
                                                        onChange: this.onChangeHandler,
                                                    }}
                                                />
                                            </label>
                                            <label className="input_container">
                                                <span className="input_title">
                                                    Password
                                                    <i
                                                        onClick={event => {
                                                            event.preventDefault();
                                                            this.verifyJiraAuth();
                                                        }}
                                                        className={classNames('verify-arrow-loop', {
                                                            'verify-arrow-loop--rotate-arrow': rotateArrowLoop,
                                                        })}
                                                        title="Verify"
                                                    />
                                                </span>
                                                <Input
                                                    config={{
                                                        value: jiraPassword.value,
                                                        type: jiraPassword.type,
                                                        name: jiraPassword.name,
                                                        required: jiraPassword.required,
                                                        onChange: this.onChangeHandler,
                                                    }}
                                                />
                                            </label>
                                        </>
                                    )}
                            </div>
                            <button type="submit">{v_save_changes}</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    openChangePasswordModal() {
        this.props.userSettingAction('TOGGLE_MODAL', true);
    }

    setDataToForm = () => {
        this.updateUserData();
    };

    updateUserData = () => {
        const { user } = this.props;
        const { userEmail, userName, tokenJira } = user;
        this.setState(prevState => ({
            inputs: {
                ...prevState.inputs,
                userName: {
                    ...prevState.inputs.userName,
                    value: userName,
                },
                email: {
                    ...prevState.inputs.email,
                    value: userEmail,
                },
                syncJiraStatus: {
                    ...prevState.inputs.syncJiraStatus,
                    checked: !!tokenJira,
                },
            },
        }));
    };
}

const mapStateToProps = state => ({
    userSettingReducer: state.userSettingReducer,
    isMobile: state.responsiveReducer.isMobile,
    user: state.userSettingReducer,
});

const mapDispatchToProps = dispatch => {
    return {
        userSettingAction: (actionType, action) => dispatch(userSettingAction(actionType, action))[1],
        setUserDataAction: payload => dispatch(setUserDataAction(payload)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSetting);
