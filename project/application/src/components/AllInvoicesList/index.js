import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';

// Styles
import './style.scss';

//Components
import { toggleSendInvoiceModal } from '../../actions/InvoicesActions';

const CheckIcon = ({ className, onClick, fill }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
            fill={fill}
        />
    </svg>
);

const EditIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3 17.2501V21.0001H6.75L17.81 9.94006L14.06 6.19006L3 17.2501ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z"
            fill="white"
        />
    </svg>
);

const SaveIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M19 12V19H5V12H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z"
            fill="white"
        />
    </svg>
);

const CopyIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5L21 11V21C21 22.1 20.1 23 19 23H7.99C6.89 23 6 22.1 6 21L6.01 7C6.01 5.9 6.9 5 8 5H15ZM14 12H19.5L14 6.5V12Z"
            fill="white"
        />
    </svg>
);

const DeleteIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
            fill="white"
        />
    </svg>
);

const SendIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white" />
    </svg>
);

const AllInvoicesList = ({ invoices, vocabulary, toggleSendInvoiceModal }) => {
    return (
        <div className="all-invoices-list">
            {invoices.map(invoice => (
                <div key={invoice.id} className="all-invoices-list-item">
                    <div className="all-invoices-list-item__block">
                        <div
                            className={classNames('all-invoices-list-item__status', {
                                'all-invoices-list-item__status--confirmed': invoice.confirmed,
                            })}
                        />
                        <div className="all-invoices-list-item__number">{`#${invoice.number}`}</div>
                        <div className="all-invoices-list-item__name">{invoice.name}</div>
                    </div>
                    <div className="all-invoices-list-item__block">
                        <div className="all-invoices-list-item__price">
                            {invoice.currency} {invoice.price.toLocaleString()}
                        </div>
                        <div className="all-invoices-list-item__date">
                            {moment(invoice.createdAt).format('MMM Do YYYY')}
                        </div>
                        <div className="all-invoices-list-item__date">
                            {moment(invoice.deadlineDate).format('MMM Do YYYY')}
                        </div>
                    </div>
                    <div className="all-invoices-list-item__instruments">
                        <CheckIcon
                            className="all-invoices-list-item__icon-button"
                            fill={invoice.confirmed ? '#27AE60' : '#EB5757'}
                        />
                        <EditIcon className="all-invoices-list-item__icon-button" />
                        <SaveIcon className="all-invoices-list-item__icon-button" />
                        <CopyIcon className="all-invoices-list-item__icon-button" />
                        <DeleteIcon className="all-invoices-list-item__icon-button" />
                        <SendIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={() => toggleSendInvoiceModal(invoice)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const mapDispatchToProps = {
    toggleSendInvoiceModal,
};

export default connect(
    null,
    mapDispatchToProps
)(AllInvoicesList);
