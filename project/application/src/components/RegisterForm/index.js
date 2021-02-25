import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Input from '../BaseComponents/Input';

import './style.scss';

function equalTo(ref, msg) {
    return Yup.mixed().test({
        name: 'equalTo',
        exclusive: false,
        message: msg || 'Wrong value',
        params: {
            reference: ref.path,
        },
        test: function(value) {
            if (!value) return true;
            return value === this.resolve(ref);
        },
    });
}
Yup.addMethod(Yup.string, 'equalTo', equalTo);

class RegisterForm extends Component {
    render() {
        const { vocabulary, submitForm, emailFromRedirect } = this.props;
        const {
            v_email,
            v_add_your_email,
            v_add_your_password,
            v_password,
            v_register,
            v_cofirm_password,
            v_add_confirm_password,
        } = vocabulary;

        return (
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{ email: emailFromRedirect ? emailFromRedirect : '', password: '', confirmPassword: '' }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('v_a_incorect_email')
                        .required('v_empty_email'),
                    password: Yup.string().required('v_empty_password'),
                    confirmPassword: Yup.string()
                        .equalTo(Yup.ref('password'), 'v_a_confirm_password_error')
                        .required('v_cofirm_password_required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    const { email, password } = values;
                    submitForm({ email, password });
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <div className="register_container">
                        <form
                            className="authorisation_window"
                            onSubmit={formik.handleSubmit}
                            noValidate
                            autoComplete="off"
                        >
                            <Input
                                config={{
                                    id: 'email',
                                    name: 'email',
                                    type: 'email',
                                    onChange: formik.handleChange,
                                    onBlur: formik.handleBlur,
                                    value: formik.values.email,
                                    placeholder: `${v_add_your_email}...`,
                                    autocomplete: 'off',
                                }}
                                errorMsg={formik.errors.email}
                                label={v_email}
                                withValidation
                            />
                            <Input
                                config={{
                                    id: 'password',
                                    name: 'password',
                                    type: 'password',
                                    onChange: formik.handleChange,
                                    onBlur: formik.handleBlur,
                                    value: formik.values.password,
                                    placeholder: `${v_add_your_password}...`,
                                    autocomplete: 'off',
                                }}
                                errorMsg={formik.errors.password}
                                label={v_password}
                                withValidation
                            />
                            <Input
                                config={{
                                    id: 'confirmPassword',
                                    name: 'confirmPassword',
                                    type: 'password',
                                    onChange: formik.handleChange,
                                    onBlur: formik.handleBlur,
                                    value: formik.values.confirmPassword,
                                    placeholder: `${v_add_confirm_password}...`,
                                    autocomplete: 'off',
                                }}
                                errorMsg={formik.errors.confirmPassword}
                                label={v_cofirm_password}
                                withValidation
                            />
                            <button type="submit" className="login_button">
                                {v_register}
                            </button>
                        </form>
                    </div>
                )}
            </Formik>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(RegisterForm);
