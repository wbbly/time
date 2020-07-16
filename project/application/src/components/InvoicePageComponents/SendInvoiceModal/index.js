import React, { Component } from 'react';
import { connect } from 'react-redux';

//Styles
import './style.scss';

//Components
import ModalPortal from '../../ModalPortal';

class SendInvoiceModal extends Component {
    state = {
        inputValue: `Dear ${this.props.invoice.to.name},

Please, look at invoice ${this.props.invoice.invoice_number} for ${this.props.invoice.projects.map(
            project => project.project_name
        )} here:
https://time.wobbly.me/team
        
A reminder of my payment terms: payment is due on ${this.props.invoice.due_date}.
        
If you have any questions about your invoice, please contact ${this.props.invoice.from.username} at ${
            this.props.invoice.from.email
        }.
        
Thank you for your business.
We appreciate the opportunity to do business with you.
        
Wobbly team`,
    };

    render() {
        const { closeModal, vocabulary, user, invoice } = this.props;
        const { inputValue } = this.state;
        const { v_send_invoice, v_send_invoice_placeholder, v_send, v_cancel, v_from, v_to } = vocabulary;
        return (
            <ModalPortal>
                <div className="send-invoice-modal">
                    <div className="send-invoice-modal__background" />
                    <div className="send-invoice-modal__container">
                        <div>
                            <div className="send-invoice-modal__header-title">{v_send_invoice}</div>
                            <div className="send-invoice-modal__data">
                                <div>
                                    <span className="send-invoice-modal__bold-text">{v_from}:</span> {user.username}
                                </div>
                                <div>
                                    <span className="send-invoice-modal__bold-text">{v_to}:</span> {invoice.to.name}
                                </div>
                                <div className="send-invoice-modal__input-container">
                                    <textarea
                                        value={inputValue}
                                        placeholder={v_send_invoice_placeholder}
                                        onChange={e => this.setState({ inputValue: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="send-invoice-modal__button-container">
                            <button className="send-invoice-modal__button" onClick={e => closeModal()}>
                                {v_send}
                            </button>
                            <button className="send-invoice-modal__button" onClick={() => closeModal()}>
                                {v_cancel.toLowerCase()}
                            </button>
                        </div>
                    </div>
                </div>
            </ModalPortal>
        );
    }
}

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user,
});

export default connect(mapStateToProps)(SendInvoiceModal);
