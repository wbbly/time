import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import './style.css';
import { client } from '../../requestSettings';
import { getUsers } from '../../queries';
import * as moment from 'moment';

export default class ReportsSearchBar extends Component {
    state = {
        toggleSelect: false,
        activeSelectItem: 'Team',
        users: [],
        toggleSelectProject: false,
        selectUersData: [],
        selectUersDataEtalon: [],
        selectProjectData: [],
    };

    openSelect() {
        this.userInput.select();
        this.setState({ toggleSelect: true });
        document.addEventListener('click', this.closeDropdown);
    }

    openSelectProject() {
        this.setState({ toggleSelectProject: !this.state.toggleSelectProject });
    }

    closeUserSelect() {
        this.setState({ toggleSelect: false });
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

    closeDropdownProject = e => {
        if (this.dropListProjects && !this.dropListProjects.contains(e.target)) {
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

    setItem(item) {
        this.userInput.value = item.username;
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: item });
    }

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
        let start = this.getYear(this.props.settedDate.startDate);
        let end = this.getYear(this.props.settedDate.endDate);
        this.props.getDataUsers();
    }

    getYear(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    getChecked(id) {
        if (this.state.selectProjectData.indexOf(id) !== -1) {
            return true;
        }
    }

    addProject(e, id) {
        let projects = JSON.parse(JSON.stringify(this.state.selectProjectData));
        if (e.target.checked) {
            projects.push(id);
        } else {
            let item = projects.indexOf(id);
            projects.splice(item, 1);
        }
        console.log(projects);
        this.setState({ selectProjectData: projects });
    }

    render() {
        return (
            <div className="wrapper_reports_search_bar">
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper" ref={div => (this.dropList = div)}>
                        <div className="reports_search_select_header">
                            <input
                                type="text"
                                onFocus={e => this.openSelect()}
                                onKeyUp={e => this.findUser(this.state.selectUersDataEtalon, this.userInput.value)}
                                ref={input => (this.userInput = input)}
                            />
                            {/*{this.props.setUser.username}*/}
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelect && (
                        <div className="select_body">
                            {this.state.selectUersData.map(item => (
                                <div className="select_users_item" onClick={e => this.setItem(item)}>
                                    {item.username}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper" ref={div => (this.dropListProjects = div)}>
                        <div className="reports_search_select_header">
                            <input
                                type="text"
                                onClick={e => this.openSelectProject()}
                                value={'Projects'}
                                readOnly={true}
                                ref={input => (this.projectInput = input)}
                            />
                            {/*{this.props.setUser.username}*/}
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelectProject && (
                        <div className="select_body">
                            {/*<div className="search_menu_select">*/}
                                {/*<div>*/}
                                    {/*Select all*/}
                                {/*</div>*/}
                                {/*<div>*/}
                                    {/*Select none*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {this.props.projectsData.map((item, index) => (
                                <div className="select_users_item" key={item.name + index}>
                                    <label>
                                        <Checkbox
                                            color={'primary'}
                                            value={item.id}
                                            checked={this.getChecked(item.id)}
                                            onChange={e => {
                                                this.addProject(e, item.id);
                                            }}
                                        />{' '}
                                        {item.name}
                                    </label>
                                </div>
                            ))}
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
        client.request(getUsers()).then(data => {
            this.setState({ selectUersData: data.user });
            this.setState({ selectUersDataEtalon: data.user });
        });
    }
}
