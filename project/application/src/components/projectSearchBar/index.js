import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import Checkbox from '@material-ui/core/Checkbox';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import PropTypes from 'prop-types';

// Services

// Components

// Actions

// Queries

// Config

// Styles
import './style.css';

const materialTheme = createMuiTheme({
    overrides: {
        MuiSvgIcon: {
            root: {
                fontSize: '24px',
            },
        },
    },
});

class ProjectSearchBar extends Component {
    state = {
        toggleSelectClient: false,
        clientDataSelected: [],
        clientDataFiltered: [],
        clientDataEtalon: [],
        clientArray: [],
    };

    openSelectClient() {
        this.setState({ toggleSelectClient: true });
        this.findClient(this.state.clientArray);
        document.addEventListener('click', this.closeDropdownClient);
    }

    clearClientSearch() {
        this.smallSelectClientInputRef.value = '';
        this.findClient(this.state.clientArray);
    }

    closeDropdownClient = e => {
        if (
            !this.selectListClientsRef ||
            !this.selectAllClientsRef ||
            !this.selectNoneClientsRef ||
            !this.selectListClientsRef.contains(e.target) ||
            this.selectAllClientsRef.contains(e.target) ||
            this.selectNoneClientsRef.contains(e.target)
        ) {
            this.setState(
                {
                    toggleSelectClient: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdownClient);
                }
            );
        }
        this.searchClients();
    };

    searchClients = () => {
        const last = this.state.clientDataEtalon.filter(el =>
            this.state.clientDataSelected.find(item => item === el.name)
        );
        this.props.projectsPageAction('CHANGE_ARR', { tableData: last.length ? last : this.state.clientDataEtalon });
    };

    findClient(items, searchText = '') {
        if (searchText.length > 0) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it);

                return values
                    .join()
                    .toLowerCase()
                    .indexOf(searchText) > -1
                    ? it
                    : undefined;
            });
            this.setState({ clientDataFiltered: filteredArr });
        } else {
            this.setState({ clientDataFiltered: items });
        }
    }

    toggleClient(client) {
        let clients = _.cloneDeep(this.state.clientDataSelected);
        clients.find(item => item === client) ? clients.splice(clients.indexOf(client), 1) : clients.push(client);
        this.setState({
            clientDataSelected: clients,
        });
    }

    selectAllClients() {
        this.setState({
            clientDataSelected: this.state.clientArray,
        });
    }

    selectNoneClients() {
        this.setState({ clientDataSelected: [] });
    }

    search() {
        if (this.searchInput.value.length) {
            let afterSearch = this.props.etalonArr.filter(
                obj =>
                    this.state.clientDataSelected.length
                        ? obj.name.toLowerCase().indexOf(this.searchInput.value.toLowerCase().trim()) !== -1 &&
                          this.state.clientDataSelected.find(item => item === obj.name)
                        : obj.name.toLowerCase().indexOf(this.searchInput.value.toLowerCase().trim()) !== -1
            );
            this.props.projectsPageAction('CHANGE_ARR', { tableData: afterSearch });
        } else {
            this.searchClients();
        }
    }

    setDefaultArr() {
        if (this.searchInput.value.length < 1) {
            this.searchClients();
        }
    }

    componentDidMount() {
        this.setState({
            clientDataEtalon: this.props.etalonArr,
            clientArray: [...new Set(this.props.etalonArr.map(el => el.name))],
        });
    }

    render() {
        const { toggleSelectClient, clientDataSelected, clientDataFiltered, clientArray } = this.state;
        const { vocabulary } = this.props;
        const { v_find, v_select_all, v_select_none, v_apply, v_client } = vocabulary;
        return (
            <div className="wrapper_project_search_bar">
                <div className="project_search_bar_search_field_container">
                    <i className="magnifer" />
                    <input
                        onChange={e => this.setDefaultArr()}
                        type="text"
                        onKeyUp={e => (e.keyCode === 13 ? this.search() : null)}
                        ref={input => (this.searchInput = input)}
                        className="project_search_bar_search_field"
                    />
                </div>
                <div className="wrapper_project_search_bar_dropmenu">
                    <div className="project_search_bar_dropmenu_container select">
                        <div className="dropmenu_select_wrapper">
                            <div
                                className="project_search_dropmenu_select_header"
                                onClick={_ => this.openSelectClient()}
                                ref={div => (this.clientInputRef = div)}
                            >
                                <div>
                                    {v_client}
                                    :&nbsp;
                                    {clientDataSelected.map((item, index) => (
                                        <span key={item + index}>{index === 0 ? item : `, ${item}`}</span>
                                    ))}
                                </div>
                                <i className={toggleSelectClient ? 'arrow_up' : 'arrow_down'} />
                            </div>
                        </div>
                        {toggleSelectClient && (
                            <div className="select_body" ref={div => (this.selectListClientsRef = div)}>
                                <div className="search_menu_select">
                                    <input
                                        type="text"
                                        onKeyUp={_ =>
                                            this.findClient(clientArray, this.smallSelectClientInputRef.value)
                                        }
                                        ref={input => (this.smallSelectClientInputRef = input)}
                                        placeholder={`${v_find}...`}
                                        autoFocus
                                    />
                                    <div
                                        ref={div => (this.selectAllClientsRef = div)}
                                        onClick={_ => this.selectAllClients()}
                                    >
                                        {v_select_all}
                                    </div>
                                    <div
                                        ref={div => (this.selectNoneClientsRef = div)}
                                        onClick={_ => this.selectNoneClients()}
                                    >
                                        {v_select_none}
                                    </div>
                                    <i className="small_clear" onClick={_ => this.clearClientSearch()} />
                                </div>
                                <div className="select_dropmenu_items_container">
                                    {clientDataFiltered.map((item, index) => (
                                        <div className="select_dropmenu_users_item" key={index}>
                                            <label>
                                                <ThemeProvider theme={materialTheme}>
                                                    <Checkbox
                                                        color={'primary'}
                                                        value={item}
                                                        checked={!!clientDataSelected.find(el => el === item)}
                                                        onChange={_ => {
                                                            this.toggleClient(item);
                                                        }}
                                                    />
                                                </ThemeProvider>{' '}
                                                <span className="select_dropmenu_users_item_username">{item}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="project_search_bar_button_container">
                    <button className="project_search_bar_button" onClick={e => this.search()}>
                        {v_apply}
                    </button>
                </div>
            </div>
        );
    }
}

ProjectSearchBar.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(ProjectSearchBar);
