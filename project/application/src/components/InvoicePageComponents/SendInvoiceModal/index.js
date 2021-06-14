import React, { Component } from 'react';
import { connect } from 'react-redux';

//Styles
import './style.scss';
// Actions
import { sendInvoiceLetterThunk } from '../../../actions/InvoicesActions';
//Components
import ModalPortal from '../../ModalPortal';
import { showNotificationAction } from '../../../actions/NotificationActions';

class SendInvoiceModal extends Component {
    state = {
        inputValue: `Dear ${this.props.invoice.to.name},
Please, look at invoice ${this.props.invoice.invoice_number} for ${window.location.origin}/invoice/${
            this.props.invoice.id
        }
A reminder of my payment terms: payment is due on ${this.props.invoice.due_date}
If you have any questions about your invoice, please contact ${this.props.invoice.from.username} at ${
            this.props.invoice.from.email
        }
Thank you
We appreciate the opportunity to do business with you
Wobbly team`,
    };

    render() {
        const {
            closeModal,
            vocabulary,
            invoice,
            getInvoices,
            sendInvoiceLetterThunk,
            isInvoicePageDetailed,
            showNotificationAction,
        } = this.props;
        const { inputValue } = this.state;
        const {
            v_send_invoice,
            v_send_invoice_placeholder,
            v_send,
            v_cancel,
            v_from,
            v_to,
            v_client_no_email,
        } = vocabulary;
        const sendInvoiceLetter = async () => {
            const message = this.state.inputValue.replace(/\n/g, '<br>');
            let data = {
                message: message,
                sendingStatus: true,
            };
            if (invoice.to.email) {
                await sendInvoiceLetterThunk(invoice.id, data, isInvoicePageDetailed);
                closeModal();
                showNotificationAction({ text: 'Invoice was sent', type: 'success' });
                getInvoices();
            } else {
                showNotificationAction({ text: v_client_no_email, type: 'error' });
            }
        };
        return (
            <ModalPortal>
                <div className="send-invoice-modal">
                    <div className="send-invoice-modal__background" />
                    <div className="send-invoice-modal__container">
                        <div>
                            <div className="send-invoice-modal__header-title">{v_send_invoice}</div>
                            <div className="send-invoice-modal__data">
                                <div>
                                    <span className="send-invoice-modal__bold-text">{v_from}:</span>{' '}
                                    {invoice.from.username} ({invoice.from.email})
                                </div>
                                <div>
                                    <span className="send-invoice-modal__bold-text">{v_to}:</span> {invoice.to.name} (
                                    {invoice.to.email})
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
                            <button className="send-invoice-modal__button" onClick={e => sendInvoiceLetter()}>
                                {v_send}
                            </button>
                            <button className="send-invoice-modal__button" onClick={() => closeModal()}>
                                {v_cancel}
                            </button>
                        </div>
                    </div>
                </div>
            </ModalPortal>
        );
    }
}
const mapDispatchToProps = {
    sendInvoiceLetterThunk,
    showNotificationAction,
};
const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SendInvoiceModal);
