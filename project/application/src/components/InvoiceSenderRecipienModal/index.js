import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
// Components
import Input from '../BaseComponents/Input';
import ReactFlagsSelect from 'react-flags-select';

// Styles
import './style.scss';
import 'react-flags-select/scss/react-flags-select.scss';
// actions
import { showNotificationAction } from '../../actions/NotificationActions';

const phoneRegExp = /^\+[0-9() -]{9,20}$/;
class InvoiceSenderRecipienModal extends Component {
    state = {
        deleteCheckbox: false,
        logoFile: null,
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
    componentDidMount() {
        const { select_country } = this.props.vocabulary;
        if (this.props.editedClient) {
            this.setState({
                logoFile: this.props.editedClient.avatar,
            });
            if (this.props.editedClient.country == null) {
                let flagPlaceHolder = document.querySelector('.flag-select__option--placeholder');
                flagPlaceHolder.innerHTML = select_country;
            }
        }
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
            v_enter_language,
            v_language,
            v_add_client,
            v_delete_client,
            client_was_deleted,
            client_was_edited,
            company_name,
            full_name,
            v_save,
            v_address,
            v_edit_client_title,
            v_edit_sender,
        } = vocabulary;
        const { logoFile } = this.state;

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
                        enableReinitialize={true}
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
                                    <div
                                        className="flag-input-container"
                                        onClick={e => {
                                            e.persist();
                                            setTimeout(() => {
                                                let flagInput = document.querySelectorAll(
                                                    '.filterBox input[type=text]'
                                                )[0];
                                                if (flagInput) {
                                                    flagInput.focus();
                                                }
                                            }, 700);
                                        }}
                                    >
                                        <div className="flag-input-container-title">{v_country}</div>
                                        <ReactFlagsSelect
                                            searchable={true}
                                            defaultCountry={formik.values.country}
                                            onSelect={countryCode => {
                                                formik.values.country = countryCode;
                                            }}
                                        />
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
