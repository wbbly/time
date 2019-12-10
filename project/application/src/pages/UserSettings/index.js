import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';

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
import SocialConnect from '../../components/SocialConnect';
import SwitchJiraType from '../../components/SwitchJiraType';

//Services
import { verifyJiraToken, requestChangeUserData } from '../../configAPI';

//Config

// Styles
import './style.scss';

const fakePassword = '8d8ae757-81ca-408f-a0b8-00d1e9f9923f';

class UserSetting extends Component {
    state = {
        rotateArrowLoop: false,
        userSetJiraSync: false,
        phone: {
            value: '',
        },
        inputs: {
            jiraType: {
                value: '',
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

    changeUserSetting = async ({ userName: username, ...rest }) => {
        const { vocabulary, changeUserData, userReducer, showNotificationAction } = this.props;
        const { v_a_data_updated_ok, lang } = vocabulary;

        const { phone } = this.state;

        const { id } = userReducer.user;
        let userData = {
            ...rest,
            username,
            phone: (phone.value || '').trim().indexOf(' ') > -1 ? phone.value : '',
            language: lang.short,
        };
        try {
            const result = await requestChangeUserData(userData, id);
            if (result.data) {
                changeUserData(result.data);
                showNotificationAction({ text: v_a_data_updated_ok, type: 'success' });
                this.setDataToForm();
                this.setState({ userSetJiraSync: false });
            }
        } catch (error) {
            this.setDataToForm();
            if (error.response && error.response.data.message) {
                const errorMsg = error.response.data.message;
                showNotificationAction({ text: vocabulary[errorMsg], type: 'error' });
            } else {
                console.log(error);
            }
        }
    };

    onSubmitHandler = values => {
        const { vocabulary, showNotificationAction } = this.props;

        const { inputs, userSetJiraSync } = this.state;
        const { syncJiraStatus, jiraType } = inputs;
        const { jiraUserName, jiraPassword, jiraUrl } = values;
        const userData = Object.keys(values).reduce((acc, curr) => {
            if (curr === 'jiraUserName' || curr === 'jiraPassword' || curr === 'jiraUrl') return acc;
            return { ...acc, [curr]: values[curr] };
        }, {});

        if (userSetJiraSync) {
            if (syncJiraStatus.checked) {
                userData.tokenJira = '';
                try {
                    userData.tokenJira = btoa(`${jiraUserName}:${jiraPassword}`);
                } catch (e) {
                    showNotificationAction({
                        text: vocabulary['ERROR.TIMER.JIRA_SYNC_FAILED'],
                        type: 'error',
                    });
                    return false;
                }

                userData.urlJira = jiraUrl;
                userData.typeJira = jiraType.value;
                userData.loginJira = jiraUserName;
            } else {
                userData.tokenJira = '';
                userData.urlJira = '';
                userData.typeJira = '';
                userData.loginJira = '';
            }
        }
        if (userData.tokenJira && jiraPassword === fakePassword) {
            delete userData.tokenJira;
        }
        this.changeUserSetting(userData);
    };

    changeSyncJiraStatus = event => {
        const { name, checked } = event.target;
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

    verifyJiraAction = async formik => {
        const { jiraUserName, jiraPassword, jiraUrl } = formik.values;
        await formik.validateForm();
        this.verifyJiraAuth(jiraUserName, jiraPassword, jiraUrl);
    };

    verifyJiraAuth = async (jiraUserName, jiraPassword, jiraUrl) => {
        this.setState({ rotateArrowLoop: true });
        const { vocabulary, showNotificationAction } = this.props;

        let tokenJira;
        try {
            tokenJira = btoa(`${jiraUserName}:${jiraPassword}`);
            const result = await verifyJiraToken({ token: tokenJira, urlJira: jiraUrl });
            this.setState({ rotateArrowLoop: false });
            showNotificationAction({ text: vocabulary[result.data.message], type: 'success' });
            return true;
        } catch (error) {
            this.setState({ rotateArrowLoop: false });
            if (error.response && error.response.data.message) {
                const errorMsg = error.response.data.message;
                showNotificationAction({ text: vocabulary[errorMsg], type: 'error' });
                return false;
            } else {
                console.log(error);
                showNotificationAction({ text: vocabulary['ERROR.TIMER.JIRA_SYNC_FAILED'], type: 'error' });
                return false;
            }
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

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.userReducer.user.avatar !== nextProps.userReducer.user.avatar) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        const { userReducer } = this.props;
        if (!_.isEqual(prevProps.userReducer.user, userReducer.user)) {
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
            v_verify,
        } = vocabulary;

        const { inputs, phone, userSetJiraSync, rotateArrowLoop } = this.state;
        const { syncJiraStatus, jiraType } = inputs;
        const { checked } = syncJiraStatus;

        const { user } = this.props.userReducer;
        const { email, username, tokenJira, urlJira, loginJira } = user;

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
                        <div className="column column-avatar-social">
                            <Avatar />
                            <SocialConnect />
                        </div>
                        <Formik
                            enableReinitialize={true}
                            validateOnChange={false}
                            validateOnBlur={false}
                            initialValues={{
                                email: email || '',
                                userName: username || '',
                                jiraUrl: urlJira,
                                jiraUserName: loginJira,
                                jiraPassword: tokenJira ? fakePassword : '',
                            }}
                            validationSchema={Yup.object({
                                email: Yup.string()
                                    .email('v_a_incorect_email')
                                    .required('v_v_required'),
                                userName: Yup.string().required('v_v_required'),
                                jiraUrl:
                                    checked &&
                                    Yup.string()
                                        .url('v_v_incorect_url')
                                        .required('v_v_required'),
                                jiraUserName: checked && Yup.string().required('v_v_required'),
                                jiraPassword: checked && Yup.string().required('v_v_required'),
                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                this.onSubmitHandler(values);
                                setSubmitting(false);
                            }}
                        >
                            {formik => (
                                <form
                                    autoComplete="new-password"
                                    className="column column-inputs"
                                    onSubmit={formik.handleSubmit}
                                    noValidate
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
                                    <Input
                                        config={{
                                            id: 'userName',
                                            name: 'userName',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.userName,
                                        }}
                                        errorMsg={formik.errors.userName}
                                        label={v_your_name}
                                        withValidation
                                        dark
                                    />
                                    <Input
                                        config={{
                                            id: 'email',
                                            name: 'email',
                                            type: 'email',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.email,
                                        }}
                                        errorMsg={formik.errors.email}
                                        label={'E-Mail'}
                                        withValidation
                                        dark
                                    />
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
                                                onChange={event => {
                                                    this.changeSyncJiraStatus(event);
                                                    formik.setValues({
                                                        ...formik.values,
                                                        jiraPassword: tokenJira ? fakePassword : '',
                                                        jiraUserName: loginJira || '',
                                                        jiraUrl: urlJira || '',
                                                    });
                                                }}
                                            />
                                            <span className="input_title">{v_jira_synchronization}</span>
                                            {checked && (
                                                <span
                                                    className="jira_sync_visibility_btn"
                                                    onClick={event => {
                                                        this.switchVisibilityJiraForm(event);
                                                        formik.setValues({
                                                            ...formik.values,
                                                            jiraPassword: tokenJira ? fakePassword : '',
                                                            jiraUserName: loginJira || '',
                                                            jiraUrl: urlJira || '',
                                                        });
                                                    }}
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
                                                    <Input
                                                        config={{
                                                            id: 'jiraUrl',
                                                            name: 'jiraUrl',
                                                            type: 'text',
                                                            onChange: formik.handleChange,
                                                            onBlur: formik.handleBlur,
                                                            value: formik.values.jiraUrl,
                                                        }}
                                                        errorMsg={formik.errors.jiraUrl}
                                                        label={'Jira url'}
                                                        withValidation
                                                        dark
                                                    />
                                                    <Input
                                                        name="jiraUserInput"
                                                        config={{
                                                            id: 'jiraUserName',
                                                            name: 'jiraUserName',
                                                            type: 'text',
                                                            onChange: e => {
                                                                e.preventDefault();
                                                                formik.handleChange(e);
                                                                if (formik.values.jiraPassword === fakePassword) {
                                                                    formik.setFieldValue('jiraPassword', '');
                                                                }
                                                            },
                                                            onBlur: formik.handleBlur,
                                                            value: formik.values.jiraUserName,
                                                        }}
                                                        errorMsg={formik.errors.jiraUserName}
                                                        label={v_login}
                                                        withValidation
                                                        dark
                                                    />
                                                    <label className="input_container">
                                                        <span className="input_title">
                                                            {v_password}
                                                            {formik.values.jiraPassword &&
                                                                formik.values.jiraPassword !== fakePassword && (
                                                                    <i
                                                                        onClick={event => {
                                                                            event.preventDefault();
                                                                            this.verifyJiraAction(formik);
                                                                        }}
                                                                        className={classNames('verify-arrow-loop', {
                                                                            'verify-arrow-loop--rotate-arrow': rotateArrowLoop,
                                                                        })}
                                                                        title={v_verify}
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
                                                            config={{
                                                                id: 'jiraPassword',
                                                                name: 'jiraPassword',
                                                                type: 'password',
                                                                onChange: formik.handleChange,
                                                                onBlur: formik.handleBlur,
                                                                onFocus: event => {
                                                                    event.preventDefault();
                                                                    if (formik.values.jiraPassword === fakePassword) {
                                                                        formik.setFieldValue('jiraPassword', '');
                                                                    }
                                                                },
                                                                value: formik.values.jiraPassword,
                                                            }}
                                                            errorMsg={formik.errors.jiraPassword}
                                                            withValidation
                                                            dark
                                                        />
                                                    </label>
                                                </>
                                            )}
                                    </div>
                                    <button className="save_btn" type="submit">
                                        {v_save_changes}
                                    </button>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }

    openChangePasswordModal() {
        this.props.toggleModal(true);
    }

    setDataToForm = () => {
        const { user } = this.props.userReducer;
        const { tokenJira, phone, typeJira } = user;
        this.setState(prevState => ({
            phone: {
                value: phone ? phone : '+49',
            },
            inputs: {
                ...prevState.inputs,
                jiraType: {
                    value: typeJira || '',
                },
                syncJiraStatus: {
                    ...prevState.inputs.syncJiraStatus,
                    checked: !!tokenJira,
                },
            },
        }));
    };

    updateUserData = () => {};
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
