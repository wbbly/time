import React, { Component } from 'react';
import { connect } from 'react-redux';

import Checkbox from '@material-ui/core/Checkbox';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

// Services
import { apiCall } from '../../services/apiService';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

const materialTheme = createMuiTheme({
    overrides: {
        MuiSvgIcon: {
            root: {
                fontSize: '24px',
            },
        },
    },
});

class ReportsByProjectSearchBar extends Component {
    state = {
        toggleSelectUser: false,
        userDataSelected: [],
        userDataFiltered: [],
        userDataEtalon: [],
    };

    sortEtalonUser = (a, b) => {
        let nameA = (a.username || '').trim().toLowerCase();
        let nameB = (b.username || '').trim().toLowerCase();
        if (nameA > nameB) {
            return 1;
        }

        if (nameA < nameB) {
            return -1;
        }
    };

    openSelectUser() {
        this.setState({ toggleSelectUser: true });
        this.findUser(this.state.userDataEtalon);
        document.addEventListener('click', this.closeDropdownUser);
    }

    clearUserSearch() {
        this.smallSelectUserInputRef.value = '';
        this.findUser(this.state.userDataEtalon);
    }

    closeDropdownUser = e => {
        if (this.selectListUsersRef && !this.selectListUsersRef.contains(e.target)) {
            this.setState(
                {
                    toggleSelectUser: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdownUser);
                }
            );
        }
    };

    findUser(items, searchText = '') {
        if (searchText.length > 0) {
            searchText = searchText.toLowerCase().trim();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it['username']);
                values.push(it['email']);

                return values
                    .join()
                    .toLowerCase()
                    .indexOf(searchText) > -1
                    ? it
                    : undefined;
            });
            this.setState({ userDataFiltered: filteredArr });
        } else {
            this.setState({ userDataFiltered: items });
        }
    }

    applySearch() {
        if (this.searchInput.value.length) {
            this.props.applySearch(this.state.userDataSelected.map(u => u.email), this.searchInput.value);
        } else {
            this.props.applySearch(this.state.userDataSelected.map(u => u.email), '');
        }
    }

    getCheckedUsers(email) {
        return this.state.userDataSelected.some(item => item.email === email);
    }

    toggleUser(user) {
        let users = JSON.parse(JSON.stringify(this.state.userDataSelected));
        let exists = false;
        for (let i = 0; i < users.length; i++) {
            const currentUser = users[i];
            if (currentUser.email === user.email) {
                exists = true;
                users.splice(i, 1);
                break;
            }
        }

        if (!exists) {
            users.push(user);
        }

        this.setState({ userDataSelected: users });
    }

    selectAllUsers() {
        this.setState({ userDataSelected: this.state.userDataEtalon });
    }

    selectNoneUsers() {
        this.setState({ userDataSelected: [] });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.userDataEtalon !== this.state.userDataEtalon) {
            let userDataEtalonSorted = this.state.userDataEtalon;
            this.setState({
                userDataEtalon: userDataEtalonSorted.sort((a, b) => this.sortEtalonUser(a, b)),
            });
        }
        if (
            prevProps.reportUsers !== this.props.reportUsers &&
            !!this.props.reportUsers.length &&
            !prevProps.reportUsers.length
        ) {
            this.setState({
                userDataEtalon: this.props.reportUsers,
                userDataSelected: this.props.reportUsers,
            });
        }
    }

    render() {
        const { vocabulary } = this.props;
        const { v_user, v_find, v_select_all, v_select_none, v_apply } = vocabulary;
        return (
            <div className="wrapper_reports_by_project_search_bar">
                <div className="reports_by_project_search_bar_search_field_container">
                    <i className="magnifer" />
                    <input
                        type="text"
                        onKeyUp={e => (e.keyCode === 13 ? this.applySearch() : null)}
                        ref={input => (this.searchInput = input)}
                        className="reports_by_project_search_bar_search_field"
                    />
                </div>

                <div className="reports_by_project_search_bar_search_field_container select">
                    <div className="reports_by_project_search_select_wrapper">
                        <div className="reports_by_project_search_select_header" onClick={_ => this.openSelectUser()}>
                            <div>
                                {v_user}
                                :&nbsp;
                                {this.state.userDataSelected.length === 0
                                    ? v_select_none
                                    : this.state.userDataSelected.length === this.state.userDataEtalon.length
                                        ? v_select_all
                                        : this.state.userDataSelected.map((item, index) => (
                                              <span key={item.username + index}>
                                                  {index === 0 ? item.username : `, ${item.username}`}
                                              </span>
                                          ))}
                            </div>
                            <i className={`arrow_down ${this.state.toggleSelectUser ? 'arrow_up' : ''}`} />
                        </div>
                    </div>
                    {this.state.toggleSelectUser && (
                        <div className="select_body" ref={div => (this.selectListUsersRef = div)}>
                            <div className="search_menu_select">
                                <input
                                    type="text"
                                    onKeyUp={_ =>
                                        this.findUser(this.state.userDataEtalon, this.smallSelectUserInputRef.value)
                                    }
                                    ref={input => (this.smallSelectUserInputRef = input)}
                                    placeholder={`${v_find}...`}
                                />
                                <div ref={div => (this.selectAllUsersRef = div)} onClick={_ => this.selectAllUsers()}>
                                    {v_select_all}
                                </div>
                                <div ref={div => (this.selectNoneUsersRef = div)} onClick={_ => this.selectNoneUsers()}>
                                    {v_select_none}
                                </div>
                                <i className="small_clear" onClick={_ => this.clearUserSearch()} />
                            </div>
                            <div className="select_items_container">
                                {this.state.userDataFiltered.map((item, index) => (
                                    <div className="select_users_item" key={item.email}>
                                        <label>
                                            <ThemeProvider theme={materialTheme}>
                                                <Checkbox
                                                    color={'primary'}
                                                    value={item.email || ''}
                                                    checked={this.getCheckedUsers(item.email)}
                                                    onChange={_ => {
                                                        this.toggleUser(item);
                                                    }}
                                                />
                                            </ThemeProvider>{' '}
                                            <span className="select_users_item_username">{item.username}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="reports_by_project_search_bar_button_container">
                    <button className="reports_by_project_search_bar_button" onClick={_ => this.applySearch()}>
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

export default connect(mapStateToProps)(ReportsByProjectSearchBar);
