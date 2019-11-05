import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import './style.scss';

class ClientsDropdown extends Component {
    state = {
        clientsList: [],
        showList: false,
        inputValue: '',
        selectedItem: null,
    };
    componentDidMount() {
        this.setState({ inputValue: '' });
        document.addEventListener('mousedown', this.closeDropdown);
    }
    componentDidUpdate(prevProps, prevState) {
        const { clientsList, editedClient } = this.props;
        if (prevProps.clientsList !== clientsList) {
            this.setState({ clientsList });
        }
        if (prevProps.editedClient !== editedClient) {
            this.setState({ selectedItem: editedClient });
        }
    }
    closeDropdown = e => {
        const { showList } = this.state;
        if (showList && !e.target.closest('.clients_list_wrapper')) {
            this.setState({ showList: false });
        }
    };
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeDropdown);
    }
    searchClient = e => {
        let targetValue = e.target.value;
        let afterSearch = this.props.clientsList.filter(
            obj => obj.name.toLowerCase().indexOf(targetValue.toLowerCase().trim()) !== -1
        );
        this.setState({
            clientsList: afterSearch,
            inputValue: targetValue,
        });
    };

    clientSelect = (name, id) => {
        this.setState({ inputValue: '', showList: false, selectedItem: { name, id } });
        this.props.clientSelect({ name, id });
    };
    removeSelectedClient = event => {
        event.stopPropagation();
        this.setState({ selectedItem: null });
        this.props.clientSelect(null);
    };
    render() {
        const { clientsList, showList, inputValue, selectedItem } = this.state;
        const { editedClient, vocabulary } = this.props;
        const { v_select_client, v_clients, v_search, v_find } = vocabulary;
        return (
            <div
                className="clients_list_wrapper"
                data-label={v_select_client}
                onClick={event => event.stopPropagation()}
            >
                <div className="clients_list_select-title" onClick={e => this.setState({ showList: !showList })}>
                    <span>
                        {selectedItem ? (
                            selectedItem.name
                        ) : (
                            <span className="clients-select-placeholder">{`${v_clients}...`}</span>
                        )}
                    </span>
                    <span>
                        {selectedItem ? <i className="client-remove" onClick={this.removeSelectedClient} /> : null}
                    </span>
                </div>
                <i className="clients-vector" onClick={e => this.setState({ showList: !showList })} />
                {showList && (
                    <div className="clients_list">
                        <input
                            className="clients_list_input"
                            placeholder={`${v_find}...`}
                            type="text"
                            value={inputValue}
                            onChange={this.searchClient}
                        />
                        <Scrollbars autoHeight autoHeightMax={150}>
                            {clientsList.length === 0 ? <div className="empty-list">empty...</div> : null}
                            {clientsList.map(client => {
                                return (
                                    <div
                                        key={client.id}
                                        className="clients_list_item"
                                        onClick={e => this.clientSelect(client.name, client.id)}
                                    >
                                        <div className="clients_list_item_name">{client.name}</div>
                                    </div>
                                );
                            })}
                        </Scrollbars>
                    </div>
                )}
            </div>
        );
    }
}

export default ClientsDropdown;
