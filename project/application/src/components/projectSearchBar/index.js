import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

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
        clientOrProjectFlag: false, //false - Project search | true - client Search
    };
    etalonTable = [];

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
                    (this.state.clientOrProjectFlag ? obj.client.name : obj.name)
                        .toLowerCase()
                        .indexOf(this.searchInput.value.toLowerCase().trim()) !== -1
            );
            this.props.projectsPageAction('CHANGE_ARR', { tableData: afterSearch });
        } else {
            this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
        }
    }

    setDefaultArr() {
        if (this.searchInput.value.length < 1) {
            this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
        }
    }

    render() {
        const { vocabulary } = this.props;
        const { v_apply, v_client } = vocabulary;
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
                <div
                    style={{
                        margin: '10px',
                    }}
                >
                    <label
                        style={{
                            display: 'flex',
                            borderLeft: '1px solid white',
                            fontSize: '16px',
                            alignItems: 'center',
                            height: '24px',
                        }}
                    >
                        <ThemeProvider theme={materialTheme}>
                            <Checkbox
                                color={'primary'}
                                // value={item.name || ''}
                                // checked={this.getCheckedClients(item.name)}
                                // checkedIcon={this.clientCheckbox(item)}
                                onClick={e => this.changeSearchFlasg(e)}
                            />
                        </ThemeProvider>{' '}
                        <span style={{ color: '#FFFFFF' }}>{v_client}</span>
                    </label>
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
