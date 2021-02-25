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

class ChangePasswordForm extends Component {
    render() {
        const { vocabulary, submitForm, withOldPassword } = this.props;
        const {
            v_new_password,
            v_current_password,
            v_add_old_password,
            v_cofirm_password,
            v_add_new_password,
            v_add_confirm_password,
            v_change_password,
        } = vocabulary;

        return (
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{ oldPassword: withOldPassword && '', password: '', confirmPassword: '' }}
                validationSchema={Yup.object({
                    oldPassword: withOldPassword && Yup.string().required('v_v_required'),
                    password: Yup.string().required('v_v_required'),
                    confirmPassword: Yup.string()
                        .equalTo(Yup.ref('password'), 'v_a_confirm_password_error')
                        .required('v_v_required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    submitForm({ newPassword: values.password, password: values.oldPassword });
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <div className="change-password_container">
                        <form className="change-password_window" onSubmit={formik.handleSubmit} noValidate>
                            {withOldPassword && (
                                <Input
                                    config={{
                                        id: 'oldPassword',
                                        name: 'oldPassword',
                                        type: 'password',
                                        onChange: formik.handleChange,
                                        onBlur: formik.handleBlur,
                                        value: formik.values.oldPassword,
                                        placeholder: `${v_add_old_password}...`,
                                    }}
                                    errorMsg={formik.errors.oldPassword}
                                    label={v_current_password}
                                    withValidation
                                />
                            )}
                            <Input
                                config={{
                                    id: 'password',
                                    name: 'password',
                                    type: 'password',
                                    onChange: formik.handleChange,
                                    onBlur: formik.handleBlur,
                                    value: formik.values.password,
                                    placeholder: `${v_add_new_password}...`,
                                    autocomplete: 'off',
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
                                    autocomplete: 'off',
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
