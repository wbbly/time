import React, { Component } from 'react';

import './style.scss';
import { connect } from 'react-redux';

class SelectStreet extends Component {
    state = {
        street: '',
    };

    setValue = value => {
        this.setState({
            value,
        });
    };

    render() {
        const { vocabulary } = this.props;
        const { v_city } = vocabulary;

        return (
            <div className="street-input">
                <div className="street-input__title">{v_city}</div>
                <input className="street-input_select" placeholder={v_city} onChange={e => this.setValue(e)} />
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
)(SelectStreet);
