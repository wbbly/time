import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import PropTypes from 'prop-types';

// Services

// Components

// Actions

// Queries

// Config

// Styles
import './style.css';

class ProjectSearchBar extends Component {
    render() {
        const { vocabulary } = this.props;
        const { v_apply } = vocabulary;
        return (
            <div className="wrapper_project_search_bar">
                <div className="project_search_bar_search_field_container">
                    <i className="magnifer" />
                    <input
                        type="text"
                        onKeyUp={e => (e.keyCode === 13 ? this.props.filterProjects() : null)}
                        value={this.props.searchValue}
                        onChange={this.props.searchValueHandler}
                        className="project_search_bar_search_field"
                    />
                </div>
                <div className="project_search_bar_button_container">
                    <button className="project_search_bar_button" onClick={e => this.props.filterProjects()}>
                        {v_apply}
                    </button>
                </div>
            </div>
        );
    }
}

ProjectSearchBar.propTypes = {
    searchValue: PropTypes.string.isRequired,
    searchValueHandler: PropTypes.func.isRequired,
    filterProjects: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(ProjectSearchBar);
