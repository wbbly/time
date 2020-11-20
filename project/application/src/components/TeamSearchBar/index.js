import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';

class TeamSearchBar extends Component {
    render() {
        const { vocabulary, search } = this.props;
        const { v_apply } = vocabulary;
        return (
            <div className="wrapper_team_search_bar">
                <div className="team_search_bar_search_field_container">
                    <i className="magnifer" />
                    <input
                        type="text"
                        onKeyUp={e => (e.keyCode === 13 ? search(this.searchInput.value) : null)}
                        ref={input => (this.searchInput = input)}
                        className="team_search_bar_search_field"
                    />
                </div>
                <div className="team_search_bar_button_container">
                    <button className="team_search_bar_button" onClick={e => search(this.searchInput.value)}>
                        {v_apply}
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(TeamSearchBar);
