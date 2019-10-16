import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import './style.scss';

class Input extends Component {
    state = {
        typeInput: 'password',
    };

    switchPasswordVisibility = event =>
        this.setState(state => ({
            typeInput: state.typeInput === 'password' ? 'test' : 'password',
        }));

    render() {
        const { typeInput } = this.state;
        const { config, vocabulary, checkFakePassword = () => {} } = this.props;

        const { v_a_incorect_email } = vocabulary;
        const { valid = true, type, ...rest } = config;

        let component = null;

        switch (type) {
            case 'password':
                component = (
                    <>
                        <input {...rest} type={typeInput} />
                        <span
                            className="wrapper-base-input__icon-eye"
                            onClick={event => {
                                this.switchPasswordVisibility();
                                checkFakePassword();
                            }}
                        />
                    </>
                );
                break;
            case 'email':
                component = (
                    <>
                        <input {...rest} type="email" />
                        <p className="wrapper-base-input__error-message">{valid ? '' : v_a_incorect_email}</p>
                    </>
                );
                break;

            default:
                component = (
                    <>
                        <input {...rest} type="text" />
                    </>
                );
                break;
        }

        return (
            <div className={classNames('wrapper-base-input', { 'wrapper-base-input--error': !valid })}>{component}</div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(Input);
