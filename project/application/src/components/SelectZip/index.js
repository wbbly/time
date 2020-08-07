import React, { Component } from 'react';

import './style.scss';
import { connect } from 'react-redux';

class SelectZip extends Component {
    state = {
        zip: '',
    };

    setValue = value => {
        this.setState({
            value,
        });
    };

    render() {
        const { vocabulary } = this.props;
        const { v_zip } = vocabulary;

        return (
            <div className="zip-input">
                <div className="zip-input__title">{v_zip}</div>
                <input className="zip-input_select" placeholder={v_zip} onChange={e => this.setValue(e)} />
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
)(SelectZip);
