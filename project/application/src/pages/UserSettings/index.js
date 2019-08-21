import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

// Actions
import { toggleModal, changeUserData } from '../../actions/UserActions';

//Components
import ChangePasswordModal from '../../components/ChangePasswordModal';
import SwitchLanguage from '../../components/SwitchLanguage';
import Input from '../../components/BaseComponents/Input';
import Avatar from '../../components/AvatarEditor';

//Services
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';
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
        phone: {
            value: '',
        },
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

    checkValidPhone = (phone, code) => {
        let editedPhone = phone.replace(code, code + ' ');

        return editedPhone.split('')[0] === '+' ? editedPhone : `+${editedPhone}`;
    };

    changeUserSetting = ({ userName: username, ...rest }) => {
        const { vocabulary, changeUserData, userReducer } = this.props;
        const { v_a_data_updated_ok, lang } = vocabulary;

        const { phone } = this.state;

        const { id } = userReducer.user;

        apiCall(AppConfig.apiURL + `user/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
            },
            body: JSON.stringify({
                ...rest,
                username,
                phone: phone.value,
                language: lang.short,
            }),
        }).then(
            result => {
                changeUserData(result);
                alert(v_a_data_updated_ok);
                this.updateUserData();
                this.setState({ userSetJiraSync: false });
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

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.userReducer.user) !== JSON.stringify(this.props.userReducer.user)) {
            this.setDataToForm();
        }
    }

    render() {
        const { vocabulary, isMobile, userReducer } = this.props;
        const { v_my_profile, v_your_name, v_save_changes, v_change_password, v_phone } = vocabulary;

        const { validEmail, inputs, phone, userSetJiraSync, rotateArrowLoop } = this.state;
        const { userName, email, jiraUsername, jiraPassword, syncJiraStatus } = inputs;
        const { checked } = syncJiraStatus;
        return (
            <div className={classNames('wrapper_user_setting_page', { 'wrapper_user_setting_page--mobile': isMobile })}>
                {Object.prototype.toString.call(userReducer.changePasswordModal) === '[object Boolean]' &&
                    userReducer.changePasswordModal && <ChangePasswordModal />}
                <div className="data_container">
                    <div className="header_user_setting">
                        <div>{v_my_profile}</div>
                        <button onClick={e => this.openChangePasswordModal()}>{v_change_password}</button>
                    </div>
                    <div className="body_user_setting">
                        <Avatar />
                        <form className="column column-inputs" onSubmit={this.onSubmitHandler}>
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
                            <div className="input_container_phone">
                                <span className="input_title">{v_phone}</span>
                                <ReactPhoneInput
                                    defaultCountry="ua"
                                    countryCodeEditable={false}
                                    autoFormat={false}
                                    placeholder=""
                                    inputExtraProps={{ value: phone.value }}
                                    value={phone.value}
                                    onChange={(value, data) => {
                                        this.setState({
                                            phone: {
                                                value: this.checkValidPhone(value, data.dialCode),
                                            },
                                        });
                                    }}
                                />
                            </div>
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
        this.props.toggleModal(true);
    }

    setDataToForm = () => {
        this.updateUserData();
    };

    updateUserData = () => {
        const { user } = this.props.userReducer;
        const { email: userEmail, username: userName, tokenJira, phone } = user;
        this.setState(prevState => ({
            phone: {
                value: phone ? phone : '+380',
            },
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
    userReducer: state.userReducer,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    toggleModal,
    changeUserData,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSetting);
