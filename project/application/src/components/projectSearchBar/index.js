import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import _ from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';

// Components

// Actions

// Queries

// Config

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
            this.state.clientDataSelected.find(item => item === (el.client && el.client.name))
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

    changeSearchFlasg(e) {
        e.target.checked ? this.setState({ clientOrProjectFlag: true }) : this.setState({ clientOrProjectFlag: false });
        this.searchInput.value = '';
        this.searchInput.focus();
        this.search();
    }

    search() {
        if (this.searchInput.value.length) {
            let afterSearch = this.props.etalonArr.filter(
                obj =>
                    this.state.clientDataSelected.length
                        ? obj.name.toLowerCase().indexOf(this.searchInput.value.toLowerCase().trim()) !== -1 &&
                          this.state.clientDataSelected.find(item => item === (obj.client && obj.client.name))
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
            clientArray: [
                ...new Set(this.props.etalonArr.filter(el => el.client && el.client.name).map(el => el.client.name)),
            ],
        });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.closeDropdownClient);
    }

    render() {
        const { toggleSelectClient, clientDataSelected, clientDataFiltered, clientArray } = this.state;
        const { vocabulary } = this.props;
        const { v_find, v_select_all, v_select_none, v_apply, v_client } = vocabulary;
        return (
            <div className="project_search_bar">
                <div className="project_search_bar__search_field_container">
                    <i className="project_search_bar__search_field_container-magnifer" />
                    <input
                        className="project_search_bar__search_field_container-input"
                        onChange={e => this.setDefaultArr()}
                        type="text"
                        onKeyUp={e => (e.keyCode === 13 ? this.search() : null)}
                        ref={input => (this.searchInput = input)}
                    />
                </div>
                <div className="project_search_bar__dropmenu">
                    <div className="project_search_bar__dropmenu-select_wrapper">
                        <div
                            className="project_search_bar__dropmenu-select_header"
                            onClick={_ => this.openSelectClient()}
                            ref={div => (this.clientInputRef = div)}
                        >
                            <div className="project_search_bar__dropmenu-select_header-names">
                                {v_client}
                                :&nbsp;
                                {clientDataSelected.join(', ')}
                            </div>
                            <i
                                className={
                                    toggleSelectClient
                                        ? 'project_search_bar__dropmenu-arrow_up'
                                        : 'project_search_bar__dropmenu-arrow_down'
                                }
                            />
                        </div>
                    </div>
                    {toggleSelectClient && (
                        <div
                            className="project_search_bar__dropmenu-select_body"
                            ref={div => (this.selectListClientsRef = div)}
                        >
                            <div className="project_search_bar__dropmenu-search_menu">
                                <input
                                    className="project_search_bar__dropmenu-search_menu-input"
                                    type="text"
                                    onKeyUp={_ => this.findClient(clientArray, this.smallSelectClientInputRef.value)}
                                    ref={input => (this.smallSelectClientInputRef = input)}
                                    placeholder={`${v_find}...`}
                                    autoFocus
                                />
                                <div
                                    className="project_search_bar__dropmenu-search_menu-find_all"
                                    ref={div => (this.selectAllClientsRef = div)}
                                    onClick={_ => this.selectAllClients()}
                                >
                                    {v_select_all}
                                </div>
                                <div
                                    className="project_search_bar__dropmenu-search_menu-find_none"
                                    ref={div => (this.selectNoneClientsRef = div)}
                                    onClick={_ => this.selectNoneClients()}
                                >
                                    {v_select_none}
                                </div>
                                <i
                                    className="project_search_bar__dropmenu-search_menu-clear"
                                    onClick={_ => this.clearClientSearch()}
                                />
                            </div>
                            <div className="project_search_bar__dropmenu-items_container">
                                {clientDataFiltered.map((item, index) => (
                                    <div className="project_search_bar__dropmenu-users_item" key={index}>
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
                                            <span className="project_search_bar__dropmenu_users_item_username">
                                                {item}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="project_search_bar__button_container">
                    <button className="project_search_bar__button_container-button" onClick={e => this.search()}>
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
