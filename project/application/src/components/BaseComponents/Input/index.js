import React, { Component } from 'react';

import './style.scss';

class Input extends Component {
    state = {
        type: 'password',
        value: '',
    };

    changeHandler = event => {
        const { value } = event.target;
        this.setState({
            value,
        });
    };

    switchType = event =>
        this.setState(state => ({
            type: state.type === 'password' ? 'test' : 'password',
        }));

    render() {
        const { type, value } = this.state;
        return (
            <div className="wrapper-base-input">
                <input value={value} onChange={this.changeHandler} {...this.props} type={type} />
                <span className="wrapper-base-input__icon-eye" onClick={this.switchType} />
            </div>
        );
    }
}

export default Input;
