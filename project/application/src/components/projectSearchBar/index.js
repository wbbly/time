import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';

export default class ProjectSearchBar extends Component {
    etalonTable = [];

    search() {
        if (!!this.searchInput.value.length) {
            let afterSearch = this.props.tableInfo.filter(obj =>
                Object.values(obj).some(value => value === this.searchInput.value.toLowerCase())
            );
            this.props.projectsPageAction('CHANGE_ARR', { tableData: afterSearch });
        } else {
            this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
        }
    }

    setDefaultArr() {
        this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
    }

    render() {
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
                        Apply
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
