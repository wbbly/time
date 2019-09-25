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
import SwitchJiraType from '../../components/SwitchJiraType';

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
                phone: (phone.value || '').trim().indexOf(' ') > -1 ? phone.value : '',
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
        const { vocabulary } = this.props;

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
                    alert(vocabulary['ERROR.TIMER.JIRA_SYNC_FAILED']);
                    return false;
                }

                userData.urlJira = jiraURL.value;
                userData.typeJira = jiraType.value;
            } else {
                userData.tokenJira = '';
                userData.urlJira = '';
                userData.typeJira = '';
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
        const { vocabulary } = this.props;

        const { inputs } = this.state;
        const { jiraUsername, jiraPassword, jiraURL } = inputs;

        let tokenJira;
        try {
            tokenJira = btoa(`${jiraUsername.value}:${jiraPassword.value}`);
        } catch (e) {
            alert(vocabulary['ERROR.TIMER.JIRA_SYNC_FAILED']);
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
        const { v_my_profile, v_your_name, v_save_changes, v_change_password, v_phone, v_jira_synchronization, v_log_in, v_password, v_type } = vocabulary;

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
                                    <span className="input_title">{v_jira_synchronization}</span>
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
                                                <span className="input_title">{v_log_in}</span>
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
                                                {jiraType.value === 'cloud' && (
                                                    <span className="input_subtitle">
                                                        (Log in to{' '}
                                                        <a
                                                            href="https://id.atlassian.com/manage/api-tokens"
                                                            target="_blank"
                                                        >
                                                            https://id.atlassian.com/manage/api-tokens
                                                        </a>{' '}
                                                        to get the API token)
                                                    </span>
                                                )}
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
