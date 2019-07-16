import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

// Services

// Components

// Actions

// Queries

// Config

// Styles
import './style.css';

class ProjectSearchBar extends Component {
    etalonTable = [];

    search() {
        if (!!this.searchInput.value.length) {
            let afterSearch = this.props.tableInfo.filter(obj => {
                let objFiltered = Object.assign({}, obj, { id: undefined });
                return Object.values(objFiltered).some(
                    value => typeof value === 'string' && value.includes(this.searchInput.value.toLowerCase())
                );
            });
            this.props.projectsPageAction('CHANGE_ARR', { tableData: afterSearch });
        } else {
            this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
        }
    }

    setDefaultArr() {
        this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
    }

    render() {
        const { vocabulary } = this.props;
        const { v_apply } = vocabulary;
        return (
            <div className="wrapper_project_search_bar">
                <div className="project_search_bar_search_field_container">
                    <i className="magnifer" />
                    <input
                        onFocus={e => this.setDefaultArr()}
                        type="text"
                        ref={input => (this.searchInput = input)}
                        className="project_search_bar_search_field"
                    />
                </div>
                <div className="project_search_bar_button_container">
                    <button className="project_search_bar_button" onClick={e => this.search()}>
                        {v_apply}
                    </button>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
    }
}

ProjectSearchBar.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(ProjectSearchBar);
