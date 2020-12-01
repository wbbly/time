import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteInvoiceById, editInvoicePaymentStatus } from '../../../actions/InvoicesActions';
import DeleteInvoiceModal from '../../../components/DeleteInvoiceModal/index';
import InvoiceList from '../../InvoiceList/index';
import CustomPagination from '../../CustomPagination/index';

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

export const CopyLinkIcon = ({ className, onClick, valueTip }) => (
    // <svg
    //     data-tip={valueTip}
    //     className={className}
    //     onClick={onClick}
    //     aria-hidden="true"
    //     focusable="false"
    //     dataprefix="fas"
    //     dataicon="link"
    //     role="img"
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 512 512"
    //     width="19px"
    //     height="19px"
    // >
    //     <path
    //         d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"
    //     />
    // </svg>
    <svg
        className={className}
        onClick={onClick}
        data-tip={valueTip}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.5 9.74997C7.82209 10.1806 8.23302 10.5369 8.70491 10.7947C9.17681 11.0525 9.69863 11.2058 10.235 11.2442C10.7713 11.2826 11.3097 11.2052 11.8135 11.0173C12.3173 10.8294 12.7748 10.5353 13.155 10.155L15.405 7.90497C16.0881 7.19772 16.4661 6.25046 16.4575 5.26722C16.449 4.28398 16.0546 3.34343 15.3593 2.64815C14.664 1.95287 13.7235 1.55849 12.7403 1.54995C11.757 1.5414 10.8098 1.91938 10.1025 2.60247L8.8125 3.88497"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10.5006 8.24992C10.1785 7.81933 9.76762 7.46304 9.29572 7.20522C8.82383 6.9474 8.30201 6.79409 7.76565 6.75567C7.22929 6.71726 6.69095 6.79465 6.18713 6.98259C5.68331 7.17053 5.2258 7.46462 4.84564 7.84492L2.59564 10.0949C1.91255 10.8022 1.53457 11.7494 1.54311 12.7327C1.55165 13.7159 1.94604 14.6565 2.64132 15.3517C3.3366 16.047 4.27715 16.4414 5.26038 16.45C6.24362 16.4585 7.19088 16.0805 7.89814 15.3974L9.18064 14.1149"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

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
export const SaveInvoice = ({ className, onClick, ...props }) => (
    <svg
        onClick={onClick}
        className={className}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
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

const AllInvoicesList = ({
    invoices,
    vocabulary,
    toggleSendInvoiceModal,
    history,
    deleteInvoiceById,
    copyInvoice,
    page,
    pageCount,
    changePage,
}) => {
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
            <CustomPagination page={page} pageCount={pageCount} changePage={changePage} />
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
