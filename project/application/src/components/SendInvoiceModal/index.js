import React, {Component} from 'react';

import './style.scss';
import {connect} from "react-redux";

const inputText = `Dear [Tomas],

Please, look at invoice [number] for [project name] here:
https://time.wobbly.me/team

A reminder of my payment terms: payment is due on [date].

If you have any questions about your invoice, please contact [name] at [contact details].


Thank you for your business.
We appreciate the opportunity to do business with you.

Wobbly team`;

class SendInvoiceModal extends Component {
    state = {
        inputValue: inputText,
    };

    render() {
        const {closeModal, sendInvoice, vocabulary, user, openedInvoice} = this.props;
        const {inputValue} = this.state;
        const {v_send_invoice, v_send_invoice_placeholder, v_send, v_cancel, v_from, v_to} = vocabulary;

        console.log({user});
        return (
            <div className="wrapper_send_invoice_modal">
                <div className="send_invoice_modal_background"/>
                <div className="send_invoice_modal_container">
                    <div>
                        <div className="send_invoice_modal_header">
                            <div className="send_invoice_modal_header_title">
                                {v_send_invoice}
                            </div>
                        </div>
                        <div className="send_invoice_modal_data">
                            <div><span className="bold">{v_from}:</span> {user.username}</div>
                            <div><span className="bold">{v_to}:</span> {openedInvoice.name}</div>
                            <div className="send_invoice_modal_data_input_container">
                            <textarea
                                value={inputValue}
                                placeholder={v_send_invoice_placeholder}
                                onChange={e => this.setState({inputValue: e.target.value})}
                            />
                            </div>
                        </div>
                    </div>
                    <div className="send_invoice_modal_button_container">
                        <button
                            className="send_invoice_modal_button_container_button"
                            onClick={e => sendInvoice(inputValue)}
                        >
                            {v_send}
                        </button>
                        <button
                            className="send_invoice_modal_button_container_button"
                            onClick={closeModal}
                        >
                            {v_cancel.toLowerCase()}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = ({invoicesReducer, userReducer}) => ({
    openedInvoice: invoicesReducer.openedInvoice,
    user: userReducer.user,
});

export default connect(mapStateToProps)(SendInvoiceModal);
