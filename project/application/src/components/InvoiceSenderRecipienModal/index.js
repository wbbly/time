import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import classNames from 'classnames';
// Components
import Input from '../BaseComponents/Input';
import CountriesDropdown from '../CountriesDropdown';

// Styles
import './style.scss';
// actions
import { showNotificationAction } from '../../actions/NotificationActions';

import countries from '../CountriesDropdown/countriesFlat.json';

const phoneRegExp = /^\+[0-9() -]{9,20}$/;
class InvoiceSenderRecipienModal extends Component {
    state = {
        deleteCheckbox: false,
        logoFile: null,
        isOpenCountriesDropdown: false,
    };
    handleFileLoad = image => {
        this.setState({ logoFile: image });
    };

    handleChangeCheckbox = event => {
        this.setState({ deleteCheckbox: event.target.checked });
    };
    handleFileDelete = () => {
        this.setState({ logoFile: null });
    };
    closeDropdown = e => {
        const { isOpenCountriesDropdown } = this.state;
        if (isOpenCountriesDropdown && !e.target.closest('.flag-input-container')) {
            this.setState({ isOpenCountriesDropdown: false });
        }
    };
    componentDidMount() {
        if (this.props.editedClient) {
            this.setState({
                logoFile: this.props.editedClient.avatar,
            });
        }
        document.addEventListener('mousedown', this.closeDropdown);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeDropdown);
    }
    render() {
        const { closeModal, vocabulary, addNewClient, editedClient, userSender, setSender } = this.props;
        const {
            v_zip_code,
            v_country,
            v_enter_state,
            v_email,
            v_city,
            v_state,
            v_enter_text,
            v_phone,
            v_enter_number,
            v_add_client,
            company_name,
            full_name,
            v_save,
            v_address,
            v_edit_sender,
            v_search,
            v_empty,
            select_country,
        } = vocabulary;
        const { isOpenCountriesDropdown } = this.state;

        const getValue = valueName => {
            if (editedClient) {
                return editedClient[valueName] ? editedClient[valueName] : '';
            } else {
                if (userSender) {
                    return userSender[valueName] ? userSender[valueName] : '';
                }
            }
        };
        return (
            <div className="sender-recipient-modal">
                <div className="sender-recipient-modal__background" />

                <div className="sender-recipient-modal__container">
                    <div className="sender-recipient-modal__container-header">
                        <div className="sender-recipient-modal__container-header-title">
                            {userSender ? v_edit_sender : v_add_client}
                        </div>
                        <i className="sender-recipient-modal__container-header-close" onClick={() => closeModal()} />
                    </div>

                    <Formik
                        // enableReinitialize={true}
                        validateOnChange={false}
                        validateOnBlur={false}
                        initialValues={{
                            country: getValue('country'),
                            city: getValue('city'),
                            state: getValue('state'),
                            language: getValue('language'),
                            phone: getValue('phone'),
                            zip: getValue('zip'),
                            username: getValue('username'),
                            email: getValue('email'),
                            company_name: getValue('company_name') || getValue('companyName'),
                        }}
                        validationSchema={Yup.object({
                            zip: Yup.number()
                                .integer('v_billing_code_error')
                                .positive('v_billing_code_error'),
                            email: Yup.string().email('v_a_incorect_email'),
                            company_name: Yup.string().required('v_v_required'),
                            phone: Yup.string().matches(phoneRegExp, 'no_valid_number'),
                        })}
                        onSubmit={values => {
                            if (userSender) {
                                setSender(values);
                            } else {
                                addNewClient(values);
                            }
                        }}
                    >
                        {formik => (
                            <form className="billing-modal__container-form" onSubmit={formik.handleSubmit} noValidate>
                                <section className="client-info__section">
                                    <Input
                                        config={{
                                            id: 'company_name',
                                            name: 'company_name',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.company_name,
                                            placeholder: v_enter_text,
                                        }}
                                        errorMsg={formik.errors.company_name}
                                        label={`${company_name}*`}
                                        withValidation
                                    />
                                    <div className="flag-input-container">
                                        <div className="flag-input-container-title">{v_country}</div>
                                        <div
                                            className="flag-input-container-select"
                                            onClick={() =>
                                                this.setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        isOpenCountriesDropdown: !prevState.isOpenCountriesDropdown,
                                                    };
                                                })
                                            }
                                        >
                                            <div className="flag-input-container-selected">
                                                {countries[formik.values.country] ? (
                                                    <>
                                                        <img
                                                            className="flag-input-container-selected-flag"
                                                            src={countries[formik.values.country].flag}
                                                            alt=""
                                                        />
                                                        <span className="flag-input-container-selected-text">
                                                            {countries[formik.values.country].name.common}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="flag-input-container-selected-text-empty">
                                                        {select_country}
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className={classNames('flag-input-container-select-arrow', {
                                                    rotated: isOpenCountriesDropdown,
                                                })}
                                            />
                                        </div>
                                        {isOpenCountriesDropdown && (
                                            <div className="flag-input-container-select-dropdown">
                                                <CountriesDropdown
                                                    inputPlaceholder={`${v_search}...`}
                                                    epmtyText={v_empty}
                                                    onSelect={item => {
                                                        formik.values.country = item.code;
                                                        this.setState({ isOpenCountriesDropdown: false });
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="wrapper-base-input__error-message" style={{ height: '1rem' }} />
                                    </div>
                                </section>
                                <section className="client-info__section">
                                    <Input
                                        config={{
                                            id: 'username',
                                            name: 'username',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.username,
                                            placeholder: v_enter_text,
                                        }}
                                        label={full_name}
                                        withValidation
                                    />
                                    <Input
                                        config={{
                                            id: 'email',
                                            name: 'email',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.email,
                                            placeholder: v_enter_text,
                                        }}
                                        errorMsg={formik.errors.email}
                                        label={v_email}
                                        withValidation
                                    />
                                </section>
                                <section className="client-info__section">
                                    <Input
                                        config={{
                                            id: 'city',
                                            name: 'city',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.city,
                                        }}
                                        label={`${v_city}, ${v_address.toLowerCase()}`}
                                        withValidation
                                    />
                                    <Input
                                        config={{
                                            id: 'state',
                                            name: 'state',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.state,
                                            placeholder: v_enter_state,
                                        }}
                                        label={v_state}
                                        withValidation
                                    />
                                </section>
                                <section className="client-info__section">
                                    <Input
                                        config={{
                                            id: 'phone',
                                            name: 'phone',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.phone,
                                            placeholder: v_enter_number,
                                        }}
                                        errorMsg={formik.errors.phone}
                                        label={v_phone}
                                        withValidation
                                    />
                                    <Input
                                        config={{
                                            id: 'zip',
                                            name: 'zip',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.zip,
                                            placeholder: v_enter_number,
                                        }}
                                        label={v_zip_code}
                                        errorMsg={formik.errors.zip}
                                        withValidation
                                    />
                                </section>
                                <button type="submit" className="sender-recipient-modal__container-form-button">
                                    {userSender ? v_save : v_add_client}
                                </button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    clientsData: state.clientsReducer.clientsList,
    defaultCountry: state.userReducer.user.language,
});
const mapDispatchToProps = {
    showNotificationAction,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceSenderRecipienModal);
