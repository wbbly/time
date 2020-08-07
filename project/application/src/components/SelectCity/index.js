import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.scss';

class SelectCity extends Component {
    state = {
        city: '',
    };

    setValue = value => {
        this.setState({
            value,
        });
    };

    render() {
        const { vocabulary } = this.props;
        const { v_state } = vocabulary;
        return (
            <div className="city-input">
                <div className="city-input__title">{v_state}</div>
                <input className="city-input_select" placeholder={v_state} onChange={e => this.setValue(e)} />
            </div>
        );
    }
}

const mStP = store => ({
    vocabulary: store.languageReducer.vocabulary,
});

export default connect(
    mStP,
    {}
)(SelectCity);
