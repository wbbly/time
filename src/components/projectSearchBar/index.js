import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './style.css';
import Select from '../select'

export default class ProjectSearchBar extends Component {
    etalonTable = [];

    search() {
        if (!!this.searchInput.value.length) {
            let afterSearch = this.etalonTable.filter(obj => Object.values(obj).some(value => value === (this.searchInput.value.toLowerCase())))
            this.props.toggleModal('CHANGE_ARR', {tableData: afterSearch})
        } else {
            console.log(this.etalonTable);
            this.props.toggleModal('CHANGE_ARR', {tableData: this.etalonTable})
        }
    }

    render() {
        return (
            <div className="wrapper_project_search_bar">
                <div className="project_search_bar_select_wrapper">
                    <Select/>
                </div>
                <div className="project_search_bar_select_wrapper">
                    <Select/>
                </div>
                <div className="project_search_bar_search_field_container">
                    <i className="magnifer"></i>
                    <input type="text" ref={(input) => this.searchInput = input}
                           className="project_search_bar_search_field"/>
                </div>
                <div className="project_search_bar_button_container">
                    <button className="project_search_bar_button" onClick={e => this.search()}>Apply</button>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.etalonTable = JSON.parse(JSON.stringify(this.props.tableInfo));
    }
}

ProjectSearchBar.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
