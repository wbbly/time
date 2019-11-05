import React, { Component } from 'react';

import './style.scss';

class ClientModal extends Component {
    state = {
        inputValue: '',
    };
    componentDidMount() {
        const { editedItem } = this.props;
        if (editedItem) {
            this.setState({ inputValue: editedItem.name });
        }
    }
    render() {
        const { closeModal, addNewClient, editedItem, editClient, vocabulary } = this.props;
        const { inputValue } = this.state;
        const { v_add_new_client, v_edit_client_name, v_client_name, v_edit_project, v_add_client } = vocabulary;
        return (
            <div className="wrapper_client_modal">
                <div className="client_modal_background" />
                <div className="client_modal_container">
                    <div className="client_modal_header">
                        <div className="client_modal_header_title">
                            {editedItem ? v_edit_client_name : v_add_new_client}
                        </div>
                        <i className="client_modal_header_close" onClick={e => closeModal()} />
                    </div>
                    <div className="client_modal_data">
                        <div className="client_modal_data_input_container">
                            <input
                                type="text"
                                value={this.state.inputValue}
                                placeholder={v_client_name}
                                onChange={e => this.setState({ inputValue: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="client_modal_button_container">
                        <button
                            className="client_modal_button_container_button"
                            onClick={e =>
                                editedItem ? editClient(inputValue, editedItem.id) : addNewClient(inputValue)
                            }
                        >
                            {editedItem ? v_edit_project : v_add_client}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default ClientModal;
