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
        const { config, vocabulary, errorMsg, withValidation, label, checkFakePassword = () => {} } = this.props;
        const { type, id, ...rest } = config;

        return (
            <label htmlFor={id} className="input_container">
                <span className="input_title">{label}</span>
                <div
                    className={classNames('wrapper-base-input', {
                        'wrapper-base-input--error': errorMsg && withValidation,
                    })}
                >
                    <input {...rest} id={id} type={type === 'password' ? typeInput : type} />
                    {config.type === 'password' && (
                        <span
                            className="wrapper-base-input__icon-eye"
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
            </label>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(Input);
