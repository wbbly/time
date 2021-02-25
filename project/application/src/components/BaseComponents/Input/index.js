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
            typeInput: state.typeInput === 'password' ? 'text' : 'password',
        }));

    render() {
        const { typeInput } = this.state;
        const { config, vocabulary, errorMsg, withValidation, label, dark, checkFakePassword = () => {} } = this.props;
        const { type, id, ...rest } = config;

        return (
            <div className={classNames('input_container', { input_container_dark: dark })}>
                {label && (
                    <label htmlFor={id} className="input_title">
                        {label}
                    </label>
                )}
                <div
                    className={classNames('wrapper-base-input', {
                        'wrapper-base-input--error': errorMsg && withValidation,
                    })}
                >
                    {(config.autocomplete !== 'off' || type !== 'password') && (
                        <input placeholder={label} {...rest} id={id} type={type === 'password' ? typeInput : type} />
                    )}
                    {config.autocomplete === 'off' &&
                        type === 'password' && (
                            <input
                                placeholder={label}
                                {...rest}
                                id={id}
                                type="text"
                                className={typeInput === 'password' ? 'hidden-password-input' : ''}
                            />
                        )}
                    {config.autocomplete === 'off' &&
                        type === 'password' &&
                        typeInput === 'password' && (
                            <span className="hidden-password-value">
                                {config.value.split('').map(letter => (
                                    <span className="hidden-password-letter">
                                        {letter}
                                        <span className="hidden-password-point">•</span>
                                    </span>
                                ))}
                            </span>
                        )}
                    {type === 'password' && (
                        <span
                            className={`wrapper-base-input__icon-eye ${'wrapper-base-input__icon-eye_' + typeInput}`}
                            onClick={event => {
                                this.switchPasswordVisibility();
                                checkFakePassword();
                            }}
                        />
                    )}
                    {withValidation ? (
                        <div className="wrapper-base-input__error-message">{errorMsg ? vocabulary[errorMsg] : ''}</div>
                    ) : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(Input);
