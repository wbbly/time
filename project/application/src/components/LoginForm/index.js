import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Input from '../BaseComponents/Input';

import './style.scss';

class LoginForm extends Component {
    render() {
        const { vocabulary, submitForm } = this.props;
        const { v_email, v_add_your_email, v_add_your_password, v_password, v_enter } = vocabulary;

        return (
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('v_a_incorect_email')
                        .required('v_empty_email'),
                    password: Yup.string().required('v_empty_password'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    submitForm(values);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <form className="authorisation_window" onSubmit={formik.handleSubmit} noValidate>
                        <Input
                            config={{
                                id: 'email',
                                name: 'email',
                                type: 'email',
                                onChange: formik.handleChange,
                                onBlur: formik.handleBlur,
                                value: formik.values.email,
                                placeholder: `${v_add_your_email}...`,
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
                            }}
                            errorMsg={formik.errors.password}
                            label={v_password}
                            withValidation
                        />
                        <button type="submit" className="login_button">
                            {v_enter}
                        </button>
                    </form>
                )}
            </Formik>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(LoginForm);
