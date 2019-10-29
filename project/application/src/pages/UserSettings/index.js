import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

// Actions
import { toggleModal, changeUserData } from '../../actions/UserActions';
import { showNotificationAction } from '../../actions/NotificationActions';

//Components
import ChangePasswordModal from '../../components/ChangePasswordModal';
import SwitchLanguage from '../../components/SwitchLanguage';
import Input from '../../components/BaseComponents/Input';
import Avatar from '../../components/AvatarEditor';
import SelectDateFormat from '../../components/SelectDateFormat';
import SelectTimeFormat from '../../components/SelectTimeFormat';
import SelectFirstDayOfWeek from '../../components/SelectFirstDayOfWeek';
import SelectDurationTimeFormat from '../../components/SelectDurationTimeFormat';

//Services
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';
import { authValidation } from '../../services/validateService';

//Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';
import SwitchJiraType from '../../components/SwitchJiraType';

const fakePassword = '8d8ae757-81ca-408f-a0b8-00d1e9f9923f';

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
            jiraURL: {
                value: '',
                type: 'text',
                name: 'jiraURL',
                required: true,
            },
            jiraType: {
                value: '',
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
        const phoneWithoutPlus = phone.charAt(0) === '+' ? phone.substr(1) : phone;
        const phoneWithoutCode = phoneWithoutPlus.replace(code, '');
        if (phoneWithoutCode.length) {
            let editedPhone = `+${code} ${phoneWithoutCode}`;

            return editedPhone;
        }

        return `+${code}`;
    };

    changeUserSetting = ({ userName: username, ...rest }) => {
        const { vocabulary, changeUserData, userReducer, showNotificationAction } = this.props;
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
                phone: (phone.value || '').trim().indexOf(' ') > -1 ? phone.value : '',
                language: lang.short,
            }),
        }).then(
            result => {
                changeUserData(result);
                showNotificationAction({ text: v_a_data_updated_ok, type: 'success' });
                this.updateUserData();
                this.setState({ userSetJiraSync: false });
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
        const { vocabulary, showNotificationAction } = this.props;

        const { inputs, userSetJiraSync } = this.state;
        const { jiraUsername, jiraPassword, syncJiraStatus, jiraURL, jiraType } = inputs;

        const userData = Object.keys(inputs).reduce((acc, curr) => {
            if (
                curr === 'syncJiraStatus' ||
                curr === 'jiraUsername' ||
                curr === 'jiraPassword' ||
                curr === 'jiraURL' ||
                curr === 'jiraType'
            )
                return acc;
            return { ...acc, [curr]: inputs[curr].value };
        }, {});
        if (authValidation('email', userData.email)) {
            this.setState({ validEmail: false });
            return;
        }
        this.setState({ validEmail: true });

        if (userSetJiraSync) {
            if (syncJiraStatus.checked) {
                userData.tokenJira = '';
                try {
                    userData.tokenJira = btoa(`${jiraUsername.value}:${jiraPassword.value}`);
                } catch (e) {
                    showNotificationAction({
                        text: vocabulary['ERROR.TIMER.JIRA_SYNC_FAILED'],
                        type: 'error',
                    });
                    return false;
                }

                userData.urlJira = jiraURL.value;
                userData.typeJira = jiraType.value;
                userData.loginJira = jiraUsername.value;
            } else {
                userData.tokenJira = '';
                userData.urlJira = '';
                userData.typeJira = '';
                userData.loginJira = '';
            }
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
    selectedJiraType = value => {
        this.setState(prevState => ({
            inputs: {
                ...prevState.inputs,
                jiraType: {
                    value,
                },
            },
        }));
    };
    verifyJiraAuth = () => {
        this.setState({ rotateArrowLoop: true });
        const { vocabulary, showNotificationAction } = this.props;

        const { inputs } = this.state;
        const { jiraUsername, jiraPassword, jiraURL } = inputs;

        let tokenJira;
        try {
            tokenJira = btoa(`${jiraUsername.value}:${jiraPassword.value}`);
        } catch (e) {
            showNotificationAction({ text: vocabulary['ERROR.TIMER.JIRA_SYNC_FAILED'], type: 'error' });
            this.setState({ rotateArrowLoop: false });
            return false;
        }

        return apiCall(AppConfig.apiURL + `sync/jira/my-permissions?token=${tokenJira}&urlJira=${jiraURL.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
            },
        }).then(
            result => {
                this.setState({ rotateArrowLoop: false });
                showNotificationAction({ text: vocabulary[result.message], type: 'success' });
                return true;
            },
            err => {
                this.setState({ rotateArrowLoop: false });
                err.text().then(text => {
                    showNotificationAction({ text: vocabulary[JSON.parse(text).message], type: 'error' });
                    return false;
                });
            }
        );
    };

    checkFakePassword = () => {
        const { inputs } = this.state;
        if (inputs.jiraPassword.value === fakePassword) {
            this.setState(prevState => ({
                inputs: {
                    ...prevState.inputs,
                    jiraPassword: {
                        ...prevState.inputs.jiraPassword,
                        value: '',
                    },
                },
            }));
        }
    };

    switchVisibilityJiraForm = event => {
        event.preventDefault();
        this.setState(prevState => ({
            userSetJiraSync: !prevState.userSetJiraSync,
        }));
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
        const {
            v_my_profile,
            v_your_name,
            v_save_changes,
            v_change_password,
            v_phone,
            v_jira_synchronization,
            v_password,
            v_type,
            v_enter_to,
            v_to_get_token,
            v_login,
            v_show,
            v_hide,
        } = vocabulary;

        const { validEmail, inputs, phone, userSetJiraSync, rotateArrowLoop } = this.state;
        const { userName, email, jiraUsername, jiraPassword, syncJiraStatus, jiraURL, jiraType } = inputs;
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
                        <form
                            autoComplete="new-password"
                            className="column column-inputs"
                            onSubmit={this.onSubmitHandler}
                        >
                            <input
                                autoComplete="new-password"
                                className="fakecredentials"
                                type="text"
                                name="fakeusernameremembered"
                            />
                            <input
                                autoComplete="new-password"
                                className="fakecredentials"
                                type="email"
                                name="fakeuseremailremembered"
                            />
                            <input
                                autoComplete="new-password"
                                className="fakecredentials"
                                type="password"
                                name="fakepasswordremembered"
                            />
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
                                    defaultCountry="de"
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
                            <div className="user-settings__date-time-format-block">
                                <div className="user-settings__date-time-format-block--row">
                                    <SelectDateFormat />
                                    <SelectFirstDayOfWeek />
                                </div>
                                <div className="user-settings__date-time-format-block--row">
                                    <SelectTimeFormat />
                                    <SelectDurationTimeFormat />
                                </div>
                            </div>
                            <div className="wrapper-jira-sync">
                                <label className="input_container input_checkbox_jira">
                                    <input
                                        type={syncJiraStatus.type}
                                        checked={syncJiraStatus.checked}
                                        name={syncJiraStatus.name}
                                        onChange={this.onChangeHandler}
                                    />
                                    <span className="input_title">{v_jira_synchronization}</span>
                                    {checked && (
                                        <span
                                            className="jira_sync_visibility_btn"
                                            onClick={this.switchVisibilityJiraForm}
                                        >
                                            {userSetJiraSync ? v_hide : v_show}
                                        </span>
                                    )}
                                </label>
                                {checked &&
                                    userSetJiraSync && (
                                        <>
                                            <SwitchJiraType
                                                dropdown
                                                onSelect={this.selectedJiraType}
                                                selectedType={jiraType.value}
                                                v_type={v_type}
                                            />
                                            <label className="input_container">
                                                <span className="input_title">Jira url</span>
                                                <Input
                                                    config={{
                                                        value: jiraURL.value,
                                                        type: jiraURL.type,
                                                        name: jiraURL.name,
                                                        required: jiraURL.required,
                                                        onChange: this.onChangeHandler,
                                                    }}
                                                />
                                            </label>
                                            <label className="input_container">
                                                <span className="input_title">{v_login}</span>
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
                                                    {v_password}
                                                    {jiraPassword.value &&
                                                        jiraPassword.value !== fakePassword && (
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
                                                        )}
                                                </span>
                                                {jiraType.value === 'cloud' && (
                                                    <span className="input_subtitle">
                                                        ({v_enter_to}{' '}
                                                        <a
                                                            href="https://id.atlassian.com/manage/api-tokens"
                                                            target="_blank"
                                                        >
                                                            https://id.atlassian.com/manage/api-tokens
                                                        </a>{' '}
                                                        {v_to_get_token})
                                                    </span>
                                                )}
                                                <Input
                                                    checkFakePassword={this.checkFakePassword}
                                                    config={{
                                                        onFocus: this.checkFakePassword,
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
                            <button className="save_btn" type="submit">
                                {v_save_changes}
                            </button>
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
        const { email: userEmail, username: userName, tokenJira, phone, urlJira, typeJira, loginJira } = user;
        this.setState(prevState => ({
            phone: {
                value: phone ? phone : '+49',
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
                jiraType: {
                    value: typeJira || '',
                },
                jiraURL: {
                    ...prevState.inputs.jiraURL,
                    value: urlJira || '',
                },
                jiraUsername: {
                    ...prevState.inputs.jiraUsername,
                    value: loginJira || '',
                },
                jiraPassword: {
                    ...prevState.inputs.jiraPassword,
                    value: tokenJira ? fakePassword : '',
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
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSetting);
