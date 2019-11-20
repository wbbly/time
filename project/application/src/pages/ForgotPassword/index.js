import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Services
import { resetPassword } from '../../configAPI';

// Components
import Input from '../../components/BaseComponents/Input';
import SwitchLanguageLogin from '../../components/SwitchLanguageLogin';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

// Queries

// Config

// Styles
import './style.scss';

class ForgotPassword extends Component {
    submitForm = async email => {
        const { history, vocabulary, showNotificationAction } = this.props;
        const { v_check_email } = vocabulary;

        try {
            await resetPassword(email.toLowerCase());
            showNotificationAction({ text: v_check_email, type: 'success' });
            history.push('/login');
        } catch (error) {
            showNotificationAction({ text: v_check_email, type: 'success' });
            history.push('/login');
        }
    };

    render() {
        const { vocabulary } = this.props;
        const { v_send, v_enter_email, v_email } = vocabulary;

        return (
            <div className="forgot_password_modal_wrapper">
                <div className="fixed_right_corner">
                    <SwitchLanguageLogin dropdown />
                </div>
                <i className="page_title" />
                <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{ email: '' }}
                    validationSchema={Yup.object({
                        email: Yup.string()
                            .email('v_a_incorect_email')
                            .required('v_empty_email'),
                    })}
                    onSubmit={(value, { setSubmitting }) => {
                        this.submitForm(value.email);
                        setSubmitting(false);
                    }}
                >
                    {formik => (
                        <div className="forgot_password_form_container">
                            <form className="add_to_team_modal_data" onSubmit={formik.handleSubmit} noValidate>
                                <Input
                                    config={{
                                        id: 'email',
                                        name: 'email',
                                        type: 'email',
                                        onChange: formik.handleChange,
                                        onBlur: formik.handleBlur,
                                        value: formik.values.email,
                                        placeholder: `${v_enter_email}...`,
                                    }}
                                    errorMsg={formik.errors.email}
                                    label={v_email}
                                    withValidation
                                />
                                <button type="submit">{v_send}</button>
                            </form>
                        </div>
                    )}
                </Formik>
            </div>
        );
    }
}
const mapDispatchToProps = {
    showNotificationAction,
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(ForgotPassword)
);
