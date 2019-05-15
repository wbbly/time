import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import './style.css';
import { AppConfig } from '../../config';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';

export default class ReportsSearchBar extends Component {
    state = {
        toggleSelectUser: false,
        toggleSelectProject: false,
        userDataSelected: [],
        userDataFiltered: [],
        userDataEtalon: [],
        projectDataSelected: [],
        projectDataFiltered: [],
        projectDataEtalon: [],
    };

    openSelectUser() {
        this.setState({ toggleSelectUser: true });
        this.findUser(this.state.userDataEtalon);
        document.addEventListener('click', this.closeDropdownUser);
    }

    openSelectProject() {
        this.setState({ toggleSelectProject: true });
        this.findProject(this.state.projectDataEtalon);
        document.addEventListener('click', this.closeDropdownProject);
    }

    clearUserSearch() {
        this.smallSelectUserInputRef.value = '';
        this.findUser(this.state.userDataEtalon);
    }

    clearProjectSearch() {
        this.smallSelectProjectInputRef.value = '';
        this.findProject(this.state.projectDataEtalon);
    }

    closeDropdownUser = e => {
        if (
            !this.selectListUsersRef.contains(e.target) ||
            this.selectAllUsersRef.contains(e.target) ||
            this.selectNoneUsersRef.contains(e.target)
        ) {
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

    closeDropdownProject = e => {
        if (
            !this.selectListProjectsRef.contains(e.target) ||
            this.selectAllProjectsRef.contains(e.target) ||
            this.selectNoneProjectsRef.contains(e.target)
        ) {
            this.setState(
                {
                    toggleSelectProject: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdownProject);
                }
            );
        }
    };

    findProject(items, searchText = '') {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it['name']);

                return values
                    .join()
                    .toLowerCase()
                    .indexOf(searchText) > -1
                    ? it
                    : undefined;
            });
            this.setState({ projectDataFiltered: filteredArr });
        } else {
            this.setState({ projectDataFiltered: items });
        }
    }

    findUser(items, searchText = '') {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
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
        this.props.applySearch();
    }

    getCheckedProjects(name) {
        if (JSON.stringify(this.state.projectDataSelected).indexOf(name) > -1) {
            return true;
        }
    }

    getCheckedUsers(name) {
        if (JSON.stringify(this.state.userDataSelected).indexOf(name) > -1) {
            return true;
        }
    }

    toggleProject(project) {
        let projects = JSON.parse(JSON.stringify(this.state.projectDataSelected));
        let exists = false;
        for (let i = 0; i < projects.length; i++) {
            const currentProject = projects[i];
            if (currentProject.name === project.name) {
                exists = true;
                projects.splice(i, 1);
                break;
            }
        }

        if (!exists) {
            projects.push(project);
        }

        this.setState({ projectDataSelected: projects });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: projects.map(p => p.name) });
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
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: users.map(u => u.email) });
    }

    selectAllProjects() {
        this.setState({ projectDataSelected: this.state.projectDataEtalon });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', {
            data: this.state.projectDataEtalon.map(p => p.name),
        });
    }

    selectAllUsers() {
        this.setState({ userDataSelected: this.state.userDataEtalon });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: this.state.userDataEtalon.map(u => u.email) });
    }

    selectNoneUsers() {
        this.setState({ userDataSelected: [] });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: [] });
    }

    selectNoneProjects() {
        this.setState({ projectDataSelected: [] });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: [] });
    }

    render() {
        return (
            <div className="wrapper_reports_search_bar">
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper">
                        <div
                            className="reports_search_select_header"
                            onClick={_ => this.openSelectUser()}
                            ref={div => (this.userInputRef = div)}
                        >
                            <div>
                                User:&nbsp;
                                {this.state.userDataSelected.map((item, index) => (
                                    <span key={item.username + index}>
                                        {index === 0 ? item.username : `, ${item.username}`}
                                    </span>
                                ))}
                            </div>
                            <i className="arrow_down" />
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
                                    placeholder={'Find'}
                                />
                                <div ref={div => (this.selectAllUsersRef = div)} onClick={_ => this.selectAllUsers()}>
                                    Select all
                                </div>
                                <div ref={div => (this.selectNoneUsersRef = div)} onClick={_ => this.selectNoneUsers()}>
                                    Select none
                                </div>
                                <i className="small_clear" onClick={_ => this.clearUserSearch()} />
                            </div>
                            <div className="select_items_container">
                                {this.state.userDataFiltered.map((item, index) => (
                                    <div className="select_users_item" key={item.email + index}>
                                        <label>
                                            <Checkbox
                                                color={'primary'}
                                                value={item.email || ''}
                                                checked={this.getCheckedUsers(item.email)}
                                                onChange={_ => {
                                                    this.toggleUser(item);
                                                }}
                                            />{' '}
                                            <span className="select_users_item_username">{item.username}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper">
                        <div
                            className="reports_search_select_header"
                            onClick={_ => this.openSelectProject()}
                            ref={div => (this.projectInputRef = div)}
                        >
                            <div>
                                Project:&nbsp;
                                {this.state.projectDataSelected.map((item, index) => (
                                    <span key={item.name + index}>{index === 0 ? item.name : `, ${item.name}`}</span>
                                ))}
                            </div>
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelectProject && (
                        <div className="select_body" ref={div => (this.selectListProjectsRef = div)}>
                            <div className="search_menu_select">
                                <input
                                    type="text"
                                    onKeyUp={_ => {
                                        this.findProject(
                                            this.state.projectDataEtalon,
                                            this.smallSelectProjectInputRef.value
                                        );
                                    }}
                                    ref={input => (this.smallSelectProjectInputRef = input)}
                                    placeholder={'Find'}
                                />
                                <div
                                    ref={div => (this.selectAllProjectsRef = div)}
                                    onClick={_ => this.selectAllProjects()}
                                >
                                    Select all
                                </div>
                                <div
                                    ref={div => (this.selectNoneProjectsRef = div)}
                                    onClick={_ => this.selectNoneProjects()}
                                >
                                    Select none
                                </div>
                                <i className="small_clear" onClick={_ => this.clearProjectSearch()} />
                            </div>
                            <div className="select_items_container">
                                {this.state.projectDataFiltered.map((item, index) => (
                                    <div className="select_users_item" key={item.name + index}>
                                        <label>
                                            <Checkbox
                                                color={'primary'}
                                                value={item.name}
                                                checked={this.getCheckedProjects(item.name)}
                                                onChange={_ => {
                                                    this.toggleProject(item);
                                                }}
                                            />{' '}
                                            <span className="select_users_item_username">{item.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="reports_search_bar_button_container">
                    <button className="reports_search_bar_button" onClick={_ => this.applySearch()}>
                        Apply
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.userInputRef.value = this.props.inputUserData[0] || '';
        this.projectInputRef.value = this.props.inputProjectData[0] || '';
        fetch(AppConfig.apiURL + `user/list`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                result => {
                    let users = result.data.user;
                    this.setState({ userDataEtalon: users });
                    const inputUserData = this.props.inputUserData;
                    for (let i = 0; i < inputUserData.length; i++) {
                        const inputUser = inputUserData[i];
                        for (let j = 0; j < users.length; j++) {
                            const currentUser = users[j];
                            if (JSON.stringify(currentUser).indexOf(inputUser) > -1) {
                                this.toggleUser(currentUser);
                                break;
                            }
                        }
                    }
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => console.log(errorMessage));
                    } else {
                        console.log(err);
                    }
                }
            );

        fetch(AppConfig.apiURL + `project/list?userId=${getUserIdFromLocalStorage()}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                result => {
                    let projects = result.data.project_v2.reverse();
                    this.setState({ projectDataEtalon: projects });
                    const inputProjectData = this.props.inputProjectData;
                    for (let i = 0; i < inputProjectData.length; i++) {
                        const inputProject = inputProjectData[i];
                        for (let j = 0; j < projects.length; j++) {
                            const currentProject = projects[j];
                            if (JSON.stringify(currentProject).indexOf(inputProject) > -1) {
                                this.toggleProject(currentProject);
                                break;
                            }
                        }
                    }
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => console.log(errorMessage));
                    } else {
                        console.log(err);
                    }
                }
            );
    }
}
