import React, { Component } from 'react';

import './style.scss';
import { connect } from 'react-redux';

class SelectCountry extends Component {
    state = {
        country: '',
    };

    setValue = event => {
        this.setState({
            country: event.target.value,
        });
    };

    render() {
        const { vocabulary } = this.props;
        const { v_country } = vocabulary;

        return (
            <div className="country-input">
                <div className="country-input__title">{v_country}</div>
                <input className="country-input_select" placeholder={v_country} onChange={e => this.setValue(e)} />
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
)(SelectCountry);
