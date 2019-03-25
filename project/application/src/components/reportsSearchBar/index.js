import React, { Component } from 'react';

import './style.css';

export default class ReportsSearchBar extends Component {
    state = {
        toggleSelect: false,
        activeSelectItem: 'Team',
    };

    togglSelect() {
        this.setState({ toggleSelect: !this.state.toggleSelect });
        document.addEventListener('click', this.closeDropdown);
    }

    closeDropdown = e => {
        if (this.dropList && !this.dropList.contains(e.target)) {
            this.setState(
                {
                    toggleSelect: !this.state.toggleSelect,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdown);
                }
            );
        }
    };

    setItem(item) {
        this.setState({ activeSelectItem: item });
    }

    render() {
        return (
            <div className="wrapper_reports_search_bar">
                <div className="reports_search_bar_search_field_container">
                    <div className="reports_search_select_wrapper" ref={div => (this.dropList = div)}>
                        <div className="reports_search_select_header" onClick={e => this.togglSelect()}>
                            {this.state.activeSelectItem}
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelect && (
                        <div className="select_body">
                            {this.props.users.map(item => (
                                <div className="select_users_item" onClick={e => this.setItem(item)}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="reports_search_bar_button_container">
                    <button className="reports_search_bar_button" onClick={e => this.search()}>
                        Apply
                    </button>
                </div>
            </div>
        );
    }
}
