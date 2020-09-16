import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteInvoiceById, editInvoicePaymentStatus } from '../../../actions/InvoicesActions';
import DeleteInvoiceModal from '../../../components/DeleteInvoiceModal/index';
import InvoiceList from '../../InvoiceList/index';

// Styles
import './style.scss';

export const CheckIcon = ({ className, onClick, fill }) => {
    if (className === 'paid') {
        return (
            <svg
                className={className}
                onClick={onClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="9" fill="white" />
                <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                    fill={fill}
                />
            </svg>
        );
    } else if (className === 'overdue') {
        return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill="#EB5757"
                />
            </svg>
        );
    } else if (className === 'awaiting') {
        return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill="#F3AD26"
                />
            </svg>
        );
    }
};

export const EditIcon = ({ className, onClick, valueTip }) => (
    <svg
        data-tip={valueTip}
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M3 17.2501V21.0001H6.75L17.81 9.94006L14.06 6.19006L3 17.2501ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z" />
    </svg>
);
export const SaveInvoice = ({ className, onClick }) => (
    <svg
        onClick={onClick}
        className={className}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5 3.75C4.66848 3.75 4.35054 3.8817 4.11612 4.11612C3.8817 4.35054 3.75 4.66848 3.75 5V19C3.75 19.3315 3.8817 19.6495 4.11612 19.8839C4.35054 20.1183 4.66848 20.25 5 20.25H6.25V13C6.25 12.5858 6.58579 12.25 7 12.25H17C17.4142 12.25 17.75 12.5858 17.75 13V20.25H19C19.3315 20.25 19.6495 20.1183 19.8839 19.8839C20.1183 19.6495 20.25 19.3315 20.25 19V8.31066L15.6893 3.75H7.75V7.25H15V8.75H7C6.58579 8.75 6.25 8.41421 6.25 8V3.75H5ZM16.25 20.25V13.75H7.75V20.25H16.25ZM3.05546 3.05546C3.57118 2.53973 4.27065 2.25 5 2.25H16C16.1989 2.25 16.3897 2.32902 16.5303 2.46967L21.5303 7.46967C21.671 7.61032 21.75 7.80109 21.75 8V19C21.75 19.7293 21.4603 20.4288 20.9445 20.9445C20.4288 21.4603 19.7293 21.75 19 21.75H5C4.27065 21.75 3.57118 21.4603 3.05546 20.9445C2.53973 20.4288 2.25 19.7293 2.25 19V5C2.25 4.27065 2.53973 3.57118 3.05546 3.05546Z"
        />
    </svg>
);

export const SaveIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M19 12V19H5V12H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" />
    </svg>
);

export const CopyIcon = ({ className, onClick, color }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5L21 11V21C21 22.1 20.1 23 19 23H7.99C6.89 23 6 22.1 6 21L6.01 7C6.01 5.9 6.9 5 8 5H15ZM14 12H19.5L14 6.5V12Z" />
    </svg>
);

export const DeleteIcon = ({ className, onClick, color }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" />
    </svg>
);

export const SendIcon = ({ className, onClick, color }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" />
    </svg>
);

const AllInvoicesList = ({ invoices, vocabulary, toggleSendInvoiceModal, history, deleteInvoiceById, copyInvoice }) => {
    const {
        v_draft,
        v_paid,
        v_overdue,
        v_edit_client,
        v_download,
        v_copy,
        v_send,
        v_delete,
        v_invoice,
        v_client,
        v_price,
        v_invoice_date,
        v_invoice_due,
        v_status,
    } = vocabulary;

    const getInvoice = invoice => {
        if (invoice.payment_status) {
            return v_paid;
        } else {
            if (moment().isBefore(moment(invoice.due_date))) {
                return v_draft;
            } else {
                return v_overdue;
            }
        }
    };
    const [modalOpeningId, openCloseModal] = useState(false);

    const deleteInvoice = id => {
        openCloseModal(false);
        deleteInvoiceById(id);
    };
    return (
        <div className="all-invoices-list">
            <div className="all-invoices-list__title-wrapper">
                <div className="data-wrapper">
                    <div className="invoice-number-title">
                        {`# ${v_invoice}`}
                        <span className="mobile-slash-separator">&nbsp;/</span>
                    </div>
                    <div className="invoice-client-title">{v_client}</div>
                </div>
                <div className="data-wrapper">
                    <div className="invoice-price-title-wrapper">
                        <div className="invoice-price-title">{v_price}</div>
                    </div>
                    <div className="date-wrapper">
                        <div className="invoice-issued-title">
                            {v_invoice_date}
                            <span className="mobile-slash-separator">&nbsp;/</span>
                        </div>
                        <div className="invoice-due-title">{v_invoice_due}</div>
                    </div>
                </div>
                <div className="invoice-status-title">{v_status}</div>
                <div className="invoice-instruments-title" />
            </div>
            {invoices.map((invoice, id) => {
                return (
                    <InvoiceList
                        invoice={invoice}
                        openCloseModal={openCloseModal}
                        toggleSendInvoiceModal={toggleSendInvoiceModal}
                        getInvoice={getInvoice}
                        copyInvoice={copyInvoice}
                        history={history}
                        key={id}
                    />
                );
            })}
            {modalOpeningId && (
                <DeleteInvoiceModal
                    deleteInvoice={deleteInvoice}
                    openCloseModal={openCloseModal}
                    modalOpeningId={modalOpeningId}
                />
            )}
        </div>
    );
};

const mapStateToProps = ({ invoicesReducer, userReducer }) => ({});

const mapDispatchToProps = {
    deleteInvoiceById,
    editInvoicePaymentStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllInvoicesList);
