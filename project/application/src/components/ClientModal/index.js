import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Components
import Input from '../BaseComponents/Input';
import Checkbox from '@material-ui/core/Checkbox';
import CountriesDropdown from '../CountriesDropdown';

// Styles
import './style.scss';
// actions
import { showNotificationAction } from '../../actions/NotificationActions';

import countries from '../CountriesDropdown/countriesFlat.json';
const phoneRegExp = /^\+[0-9() -]{9,20}$/;
class ClientModal extends Component {
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
        const {
            closeModal,
            vocabulary,
            addNewClient,
            toEditClient,
            editedClient,
            deleteClient,
            showNotificationAction,
        } = this.props;
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
            v_delete_client,
            client_was_deleted,
            client_was_edited,
            company_name,
            v_client_name,
            v_save,
            v_address,
            v_edit_client_title,
            v_search,
            v_empty,
            select_country,
        } = vocabulary;
        const { logoFile, isOpenCountriesDropdown } = this.state;

        const getValue = valueName => {
            if (editedClient) {
                return editedClient[valueName] ? editedClient[valueName] : '';
            } else {
                return '';
            }
        };

        return (
            <div className="client-modal">
                <div className="client-modal__background" />

                <div className="client-modal__container">
                    <div className="client-modal__container-header">
                        <div className="client-modal__container-header-title">
                            {editedClient ? v_edit_client_title : v_add_client}
                        </div>
                        <i className="client-modal__container-header-close" onClick={() => closeModal()} />
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
                            name: getValue('name'),
                            email: getValue('email'),
                            company_name: getValue('company_name'),
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
                            if (this.state.deleteCheckbox) {
                                deleteClient(editedClient.id);
                                showNotificationAction({
                                    text: client_was_deleted,
                                    type: 'success',
                                });
                            } else {
                                editedClient
                                    ? (() => {
                                          toEditClient(values, editedClient.id, logoFile);
                                          showNotificationAction({
                                              text: client_was_edited,
                                              type: 'success',
                                          });
                                      })()
                                    : (() => {
                                          addNewClient(values, logoFile);
                                      })();
                            }
                        }}
                    >
                        {formik => (
                            <form className="billing-modal__container-form" onSubmit={formik.handleSubmit} noValidate>
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
                                <section className="client-info__section">
                                    <Input
                                        config={{
                                            id: 'name',
                                            name: 'name',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.name,
                                            placeholder: v_enter_text,
                                        }}
                                        label={v_client_name}
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
                                            id: 'city',
                                            name: 'city',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.city,
                                            placeholder: v_enter_text,
                                        }}
                                        label={`${v_city}, ${v_address.toLowerCase()}`}
                                        withValidation
                                    />
                                </section>
                                <section className="client-info__section section-solo">
                                    {/* <Input
                                        config={{
                                            id: 'language',
                                            name: 'language',
                                            type: 'text',
                                            onChange: formik.handleChange,
                                            onBlur: formik.handleBlur,
                                            value: formik.values.language,
                                            placeholder: v_enter_language,
                                        }}
                                        label={v_language}
                                        withValidation
                                    /> */}

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

                                {editedClient && (
                                    <section className="client-info__section-delete">
                                        <Checkbox
                                            color="primary"
                                            onChange={this.handleChangeCheckbox}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        <span>{v_delete_client}</span>
                                    </section>
                                )}
                                <button type="submit" className="client-modal__container-form-button">
                                    {editedClient ? v_save : v_add_client}
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
)(ClientModal);
