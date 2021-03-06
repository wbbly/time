import React, { Component } from 'react';

import './style.scss';

class ClientsDropdown extends Component {
    constructor(props) {
        super(props);

        this.searchClientInput = React.createRef();

        this.state = {
            clientsList: [],
            showList: false,
            inputValue: '',
            selectedItem: null,
        };
    }

    closeDropdown = e => {
        const { showList } = this.state;
        if (showList && !e.target.closest('.clients_list_wrapper')) {
            this.setState({ showList: false });
        }
    };

    searchClient = e => {
        let targetValue = e.target.value;
        let afterSearch = this.props.clientsList.filter(
            obj => this.getClientFullName(obj, false).indexOf(targetValue.toLowerCase().trim()) >= 0
        );
        this.setState({
            clientsList: afterSearch,
            inputValue: targetValue,
        });
    };

    clientSelect = client => {
        this.setState({ inputValue: '', showList: false, selectedItem: client });
        this.props.clientSelect(client);
    };

    removeSelectedClient = event => {
        event.stopPropagation();
        this.setState({ selectedItem: null });
        this.props.clientSelect(null);
    };

    getClientFullName(client, listView = true) {
        const { company_name, name } = client;
        // returns 'Company (Client Name)' for list visualization, or 'company clientname' for search
        if (listView) {
            return company_name ? `${company_name}${name ? ` (${name})` : ''}` : name;
        } else {
            return (company_name ? `${company_name}${name ? ` ${name}` : ''}` : name).toLowerCase();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { showList } = this.state;
        const { clientsList, editedClient } = this.props;
        if (prevProps.clientsList !== clientsList) {
            this.setState({ clientsList });
        }
        if (prevProps.editedClient !== editedClient) {
            this.setState({ selectedItem: editedClient });
        }
        if (prevState.showList !== showList) {
            if (showList) {
                this.searchClientInput.current.focus();
            } else {
                this.setState({
                    inputValue: '',
                    clientsList,
                });
            }
        }
    }

    componentDidMount() {
        this.setState({ inputValue: '' });
        document.addEventListener('mousedown', this.closeDropdown);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeDropdown);
    }

    render() {
        const { clientsList, showList, inputValue, selectedItem } = this.state;
        const { vocabulary } = this.props;
        const { v_select_client, v_clients, v_find, v_empty } = vocabulary;
        return (
            <div
                className="clients_list_wrapper"
                data-label={v_select_client}
                onClick={event => event.stopPropagation()}
            >
                <div className="clients_list_select-title" onClick={e => this.setState({ showList: !showList })}>
                    <span>
                        {selectedItem ? (
                            this.getClientFullName(selectedItem)
                        ) : (
                            <span className="clients-select-placeholder">{`${v_clients}...`}</span>
                        )}
                    </span>
                    <span>
                        {selectedItem ? <i className="client-remove" onClick={this.removeSelectedClient} /> : null}
                    </span>
                </div>
                <i
                    className={`clients-vector ${showList ? 'clients-vector_up' : ''}`}
                    onClick={e => this.setState({ showList: !showList })}
                />
                {showList && (
                    <div className="clients_list_dropdown">
                        <div className="clients_list_input">
                            <input
                                ref={this.searchClientInput}
                                placeholder={`${v_find}...`}
                                type="text"
                                value={inputValue}
                                onChange={this.searchClient}
                            />
                        </div>
                        <div className="clients_list">
                            {clientsList.length === 0 && <div className="empty-list">{v_empty}</div>}
                            {clientsList.map(client => {
                                return (
                                    <div
                                        key={client.id}
                                        className="clients_list_item"
                                        onClick={e => this.clientSelect(client)}
                                    >
                                        <div className="clients_list_item_name">{this.getClientFullName(client)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ClientsDropdown;
