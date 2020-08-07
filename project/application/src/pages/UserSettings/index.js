import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';

import classNames from 'classnames';

import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

import ReactFlagsSelect from 'react-flags-select';

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
import TechnologyComponent from '../../components/TechnologyComponent';
import CustomScrollbar from '../../components/CustomScrollbar';
//Services
import { verifyJiraToken, requestChangeUserData } from '../../configAPI';

//Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';
import 'react-flags-select/scss/react-flags-select.scss';
const fakePassword = '8d8ae757-81ca-408f-a0b8-00d1e9f9923f';

const OpenJiraMenuIfValidationFails = props => {
    const { formik, open, onSubmissionError } = props;
    const { jiraUrl, jiraUserName, jiraPassword } = formik.errors;
    const effect = () => {
        if ((jiraUrl || jiraUserName || jiraPassword) && !open) {
            onSubmissionError();
        }
    };
    React.useEffect(effect, [formik.submitCount, formik.errors]);
    return null;
};

class UserSetting extends Component {
    state = {
        rotateArrowLoop: false,
        userSetJiraSync: false,
        phone: {
            value: '',
        },
        zip: {
            value: '',
        },
        state: {
            value: '',
        },
        city: {
            value: '',
        },
        country: {
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
        userTechnologies: [],
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

        const { phone, userTechnologies } = this.state;

        const { id } = userReducer.user;
        let userData = {
            ...rest,
            username,
            phone: (phone.value || '').trim().indexOf(' ') > -1 ? phone.value : '',
            language: lang.short,
            technologies: userTechnologies.map(item => item.id),
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
        const { jiraUserName, jiraPassword, jiraUrl, zip } = values;
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
    getCountry() {
        const { vocabulary } = this.props;
        switch (vocabulary.lang.short) {
            case 'ru':
                return 'RU';
            case 'de':
                return 'DE';
            case 'it':
                return 'IT';
            case 'uk':
                return 'UA';
            default:
                break;
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
            v_country,
            v_state,
            v_city,
            v_address_lowC,
            v_zip,
            e_mail,
            v_technologies,
            v_company_name,
        } = vocabulary;

        const { inputs, phone, userSetJiraSync, rotateArrowLoop } = this.state;
        const { syncJiraStatus, jiraType } = inputs;
        const { checked } = syncJiraStatus;

        const { user } = this.props.userReducer;
        const { email, username, companyName, country, state, city, zip, tokenJira, urlJira, loginJira } = user;

        return (
            <div className={classNames('wrapper_user_setting_page', { 'wrapper_user_setting_page--mobile': isMobile })}>
                {Object.prototype.toString.call(userReducer.changePasswordModal) === '[object Boolean]' &&
                    userReducer.changePasswordModal && <ChangePasswordModal />}
                <div className="data_container">
                    <CustomScrollbar>
                        <div className="header_user_setting">
                            <div>{v_my_profile}</div>
                            <button onClick={e => this.openChangePasswordModal()}>{v_change_password}</button>
                        </div>
                        <div className="body_user_setting">
                            <div className="column column-avatar-social">
                                <Avatar />
                                {AppConfig.socialAuth.active && <SocialConnect />}
                            </div>
                            <Formik
                                enableReinitialize={true}
                                validateOnChange={false}
                                validateOnBlur={false}
                                initialValues={{
                                    email: email || '',
                                    userName: username || '',
                                    companyName: companyName || '',
                                    country: country || this.getCountry(),
                                    state: state || '',
                                    city: city || '',
                                    zip: zip || '',
                                    jiraUrl: urlJira,
                                    jiraUserName: loginJira,
                                    jiraPassword: tokenJira ? fakePassword : '',
                                }}
                                validationSchema={Yup.object({
                                    email: Yup.string()
                                        .email('v_a_incorect_email')
                                        .required('v_v_required'),
                                    userName: Yup.string().required('v_v_required'),
                                    country: Yup.string().required('v_v_required'),
                                    city: Yup.string().required('v_v_required'),
                                    jiraUrl:
                                        checked &&
                                        Yup.string()
                                            .url('v_v_incorect_url')
                                            .required('v_v_required'),
                                    jiraUserName: checked && Yup.string().required('v_v_required'),
                                    jiraPassword: checked && Yup.string().required('v_v_required'),
                                    zip: Yup.number()
                                        .integer('v_billing_code_error')
                                        .positive('v_billing_code_error'),
                                })}
                                onSubmit={(values, { setSubmitting }) => {
                                    this.onSubmitHandler(values);
                                    setSubmitting(false);
                                }}
                            >
                                {formik => (
                                    <form
                                        autoComplete="off"
                                        className="column column-inputs"
                                        onSubmit={formik.handleSubmit}
                                        noValidate
                                    >
                                        <OpenJiraMenuIfValidationFails
                                            formik={formik}
                                            open={userSetJiraSync}
                                            onSubmissionError={e => this.setState({ userSetJiraSync: true })}
                                        />
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
                                            label={`${v_your_name}*`}
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
                                            label={`${e_mail}*`}
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
                                        <Input
                                            config={{
                                                id: 'companyName',
                                                name: 'companyName',
                                                type: 'text',
                                                onChange: formik.handleChange,
                                                onBlur: formik.handleBlur,
                                                value: formik.values.companyName,
                                            }}
                                            label={v_company_name}
                                            withValidation
                                            dark
                                        />
                                        <div className="user-settings__select-location">
                                            <div className="user-settings__select-adress">
                                                <div className="flag-input-container">
                                                    <div className="flag-input-container-title">{`${v_country}`}</div>
                                                    <ReactFlagsSelect
                                                        searchable={true}
                                                        defaultCountry={formik.values.country}
                                                        onSelect={countryCode => {
                                                            formik.values.country = countryCode;
                                                        }}
                                                    />
                                                    <div
                                                        className="wrapper-base-input__error-message"
                                                        style={{ height: '1rem' }}
                                                    />
                                                </div>
                                                <Input
                                                    config={{
                                                        id: 'state',
                                                        name: 'state',
                                                        type: 'state',
                                                        onChange: formik.handleChange,
                                                        onBlur: formik.handleBlur,
                                                        value: formik.values.state,
                                                    }}
                                                    label={v_state}
                                                    withValidation
                                                    dark
                                                />
                                            </div>
                                            <div className="user-settings__select-adress">
                                                <Input
                                                    config={{
                                                        id: 'city',
                                                        name: 'city',
                                                        type: 'text',
                                                        onChange: formik.handleChange,
                                                        onBlur: formik.handleBlur,
                                                        value: formik.values.city,
                                                    }}
                                                    errorMsg={formik.errors.city}
                                                    label={`${v_city}, ${v_address_lowC}*`}
                                                    withValidation
                                                    dark
                                                />
                                                <Input
                                                    config={{
                                                        id: 'zip',
                                                        name: 'zip',
                                                        type: 'number',
                                                        onChange: formik.handleChange,
                                                        onBlur: formik.handleBlur,
                                                        value: formik.values.zip,
                                                    }}
                                                    label={v_zip}
                                                    errorMsg={formik.errors.zip}
                                                    withValidation
                                                    dark
                                                />
                                            </div>
                                        </div>

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
                                        <div className="user-settings__technology">
                                            <div className="user-settings__technology-title">{v_technologies}</div>
                                            <TechnologyComponent
                                                userTechnologies={this.state.userTechnologies}
                                                setUserTechnologies={techArr =>
                                                    this.setState({ userTechnologies: techArr })
                                                }
                                                vocabulary={vocabulary}
                                            />
                                        </div>
                                        <div className="wrapper-jira-sync">
                                            <div className="jira-sync-labels-wrapper">
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
                                                </label>
                                                <label>
                                                    {checked && (
                                                        <span
                                                            className="jira_sync_visibility_btn"
                                                            onClick={event => {
                                                                this.switchVisibilityJiraForm(event);
                                                            }}
                                                        >
                                                            {userSetJiraSync ? v_hide : v_show}
                                                        </span>
                                                    )}
                                                </label>
                                            </div>
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
                                                                        rel="noopener noreferrer"
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
                                                                        if (
                                                                            formik.values.jiraPassword === fakePassword
                                                                        ) {
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
                    </CustomScrollbar>
                </div>
            </div>
        );
    }

    openChangePasswordModal() {
        this.props.toggleModal(true);
    }

    setDataToForm = () => {
        const { user } = this.props.userReducer;
        const { tokenJira, phone, typeJira, userTechnologies } = user;
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
            userTechnologies: userTechnologies.map(item => item.technology),
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
