import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import './style.css';
import { getUserData } from '../../services/authentication';
import { AppConfig } from '../../config';

export default class ReportsSearchBar extends Component {
    state = {
        toggleSelect: false,
        activeSelectItem: 'Team',
        users: [],
        toggleSelectProject: false,
        selectUersData: [],
        selectUersDataEtalon: [],
        selectProjectData: [],
        projectsData: [],
        etalonProjectsData: [],
        checkedProjects: false,
        selectUserData: [],
    };

    openSelect() {
        this.setState({ toggleSelect: true });
        this.findUser(this.state.selectUersDataEtalon, '');
        document.addEventListener('click', this.closeDropdown);
    }

    openSelectProject() {
        this.setState({ toggleSelectProject: true });
        this.findProject(this.state.etalonProjectsData, '');
        document.addEventListener('click', this.closeDropdownProject);
    }

    closeDropdownProject = e => {
        if (this.projectHeaderSelect && !this.projectHeaderSelect.contains(e.target)) {
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

    closeDropdown = e => {
        if (
            this.dropList &&
            !this.dropList.contains(e.target) &&
            !this.smallSeleUserInput.contains(e.target) &&
            !this.usersItemsContainer.contains(e.target)
        ) {
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

    findProject(items, searchText) {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
            let finishArr = items.filter(it => {
                let values = [];
                values.push(it['name']);

                return (
                    JSON.stringify(values)
                        .toLowerCase()
                        .indexOf(searchText) > -1
                );
            });
            this.setState({ projectsData: finishArr });
        } else {
            this.setState({ projectsData: this.state.etalonProjectsData });
        }
    }

    clearSmallProjectSearch() {
        this.smallSeleProjectInput.value = '';
        this.setState({ projectsData: this.state.etalonProjectsData });
    }

    closeDropdownProject = e => {
        if (
            this.dropListProjects &&
            !this.dropListProjects.contains(e.target) &&
            !this.projectSelectList.contains(e.target) &&
            !this.projectHeaderClean.contains(e.target) &&
            !this.smallSeleProjectInput.contains(e.target)
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

    findUser(items, searchText) {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
            let finishArr = items.filter(it => {
                let values = [];
                values.push(it['username']);

                return (
                    JSON.stringify(values)
                        .toLowerCase()
                        .indexOf(searchText) > -1
                );
            });
            this.setState({ selectUersData: finishArr });
        } else {
            this.setState({ selectUersData: this.state.selectUersDataEtalon });
        }
    }

    setOtherUser() {
        if (this.props.setUser.length) {
            this.props.getDataUsers();
        } else {
            alert('Please, select at least one user');
        }
    }

    getChecked(name) {
        if (this.props.selectedProjects.join().indexOf(name) !== -1) {
            return true;
        }
    }

    getCheckedUsers(name) {
        if (this.state.selectUserData.join().indexOf(name) !== -1) {
            return true;
        }
    }

    addProject(e, name) {
        let projects = JSON.parse(JSON.stringify(this.state.selectProjectData));
        if (e.target.checked) {
            projects.push(name);
        } else {
            let item = projects.indexOf(`"${name}"`);
            projects.splice(item, 1);
        }
        this.setState({ selectProjectData: projects });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: projects });
    }

    addUsers(e, user) {
        let users = JSON.parse(JSON.stringify(this.state.selectUserData));
        if (e.target.checked) {
            users.push(user.username);
        } else {
            let item = users.indexOf('' + user.username);
            users.splice(item, 1);
        }
        this.setState({ selectUserData: users });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: users });
    }

    selectAllProjects() {
        let projects = [];
        for (let i = 0; i < this.state.etalonProjectsData.length; i++) {
            projects.push(this.state.etalonProjectsData[i].name);
        }
        this.setState({ checkedProjects: true });
        this.setState({ selectProjectData: projects });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: projects });
    }

    selectAllUsers() {
        let users = [];
        for (let i = 0; i < this.state.selectUersData.length; i++) {
            users.push(this.state.selectUersData[i].username);
        }
        this.setState({ selectUserData: users });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: users });
    }

    selectNoneUsers() {
        this.setState({ selectUserData: [] });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: [] });
    }

    selectNone() {
        let projects = [];
        for (let i = 0; i < this.state.etalonProjectsData.length; i++) {
            projects.push(this.state.etalonProjectsData[i].name);
        }
        this.setState({ checkedProjects: false });
        this.setState({ selectProjectData: [] });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: [] });
    }

    render() {
        return (
            <div className="wrapper_reports_search_bar">
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper" ref={div => (this.dropList = div)}>
                        <div
                            className="reports_search_select_header"
                            onClick={e => this.openSelect()}
                            ref={div => (this.userInput = div)}
                        >
                            <div>
                                User:&nbsp;
                                {this.props.setUser.map((item, index) => (
                                    <span key={item + index}>{item}</span>
                                ))}
                            </div>
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelect && (
                        <div className="select_body">
                            <div className="search_menu_select">
                                <input
                                    type="text"
                                    onKeyUp={e =>
                                        this.findUser(this.state.selectUersDataEtalon, this.smallSeleUserInput.value)
                                    }
                                    ref={input => (this.smallSeleUserInput = input)}
                                    placeholder={'Find'}
                                />
                                <div onClick={e => this.selectAllUsers()}>Select all</div>
                                <div onClick={e => this.selectNoneUsers()}>Select none</div>
                                <i className="small_clear" onClick={e => this.clearSmallProjectSearch()} />
                            </div>
                            <div className="select_items_container" ref={div => (this.usersItemsContainer = div)}>
                                {this.state.selectUersData.map((item, index) => (
                                    <div className="select_users_item" key={item.username + index}>
                                        <label>
                                            <Checkbox
                                                color={'primary'}
                                                value={item.username || ''}
                                                checked={this.getCheckedUsers(item.username)}
                                                onChange={e => {
                                                    this.addUsers(e, item);
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
                <div
                    className="reports_search_bar_search_field_container select"
                    onClick={e => this.openSelectProject()}
                >
                    <div className="reports_search_select_wrapper">
                        <div className="reports_search_select_header" ref={div => (this.dropListProjects = div)}>
                            <div>Project:{this.state.selectProjectData.join(' ')}</div>
                            {/*{this.props.setUser.username}*/}
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelectProject && (
                        <div className="select_body" ref={div => (this.projectHeaderSelect = div)}>
                            <div className="search_menu_select">
                                <input
                                    type="text"
                                    onKeyUp={e => {
                                        this.findProject(
                                            this.state.etalonProjectsData,
                                            this.smallSeleProjectInput.value
                                        );
                                    }}
                                    ref={input => (this.smallSeleProjectInput = input)}
                                    placeholder={'Find'}
                                />
                                <div onClick={e => this.selectAllProjects()}>Select all</div>
                                <div onClick={e => this.selectNone()}>Select none</div>
                                <i
                                    className="small_clear"
                                    ref={i => (this.projectHeaderClean = i)}
                                    onClick={e => this.clearSmallProjectSearch()}
                                />
                            </div>
                            <div className="select_items_container" ref={div => (this.projectSelectList = div)}>
                                {this.state.projectsData.map((item, index) => (
                                    <div className="select_users_item" key={item.name + index}>
                                        <label>
                                            <Checkbox
                                                color={'primary'}
                                                value={item.name}
                                                checked={this.getChecked(item.name)}
                                                onChange={e => {
                                                    this.addProject(e, item.name);
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
                    <button className="reports_search_bar_button" onClick={e => this.setOtherUser()}>
                        Apply
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.userInput.value = this.props.setUser.username;
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: [getUserData().username] });
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
                    let data = result.data;
                    this.setState({ selectUersDataEtalon: data.user });
                    this.setState({ selectUserData: this.props.setUser });
                },
                err => err.text().then(errorMessage => {})
            );
        setTimeout(() => {
            this.setState({ projectsData: this.props.projectsData });
            this.setState({ etalonProjectsData: this.props.projectsData });
        }, 800);
    }
    componentWillUnmount() {
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: [getUserData().username] });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: [] });
    }
}
