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
        message: msg || '${path} must be the same as ${reference}',
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

class ChangePasswordForm extends Component {
    render() {
        const { vocabulary, submitForm, emailFromRedirect } = this.props;
        const {
            v_new_password,
            v_add_your_password,
            v_cofirm_password,
            v_add_confirm_password,
            v_change_password,
        } = vocabulary;

        return (
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={Yup.object({
                    password: Yup.string().required('v_empty_password'),
                    confirmPassword: Yup.string()
                        .equalTo(Yup.ref('password'), 'v_a_confirm_password_error')
                        .required('v_cofirm_password_required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    submitForm(values.password);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <div className="change-password_container">
                        <form className="change-password_window" onSubmit={formik.handleSubmit} noValidate>
                            <Input
                                config={{
                                    id: 'password',
                                    name: 'password',
                                    type: 'password',
                                    onChange: formik.handleChange,
                                    onBlur: formik.handleBlur,
                                    value: formik.values.password,
                                    placeholder: `${v_add_your_password}...`,
                                }}
                                errorMsg={formik.errors.password}
                                label={v_new_password}
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
                                }}
                                errorMsg={formik.errors.confirmPassword}
                                label={v_cofirm_password}
                                withValidation
                            />
                            <button type="submit" className="login_button">
                                {v_change_password}
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

export default connect(mapStateToProps)(ChangePasswordForm);
