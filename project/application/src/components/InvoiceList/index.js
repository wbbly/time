import React, { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteInvoiceById, editInvoicePaymentStatus } from '../../actions/InvoicesActions';
import { spaceAndFixNumber, fixNumberHundredths, internationalFormatNum } from '../../services/numberHelpers';
import { downloadPDF } from '../../services/downloadPDF';
import { downloadInvoicePDF } from '../../configAPI';
import { showNotificationAction } from '../../actions/NotificationActions';
import ReactTooltip from 'react-tooltip';

// Styles
import './style.scss';
import { Link } from 'react-router-dom';

const CheckIcon = ({ className, onClick, fill, vocabulary }) => {
    const { v_paid, v_awaiting, v_overdue, v_draft } = vocabulary;
    if (className === 'paid') {
        return (
            <svg
                data-tip={v_paid}
                className={className}
                onClick={onClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#27AE60"
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
            <svg
                data-tip={v_overdue}
                className={className}
                onClick={onClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#EB5757"
                />
                <path
                    d="M12 8V12M12 16H12.01"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    } else if (className === 'awaiting') {
        return (
            <svg
                data-tip={v_awaiting}
                className={className}
                onClick={onClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="rgb(255, 174, 0)"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#F3AD26"
                />
                <path
                    d="M12 7V12.25L16 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        );
    } else if (className === 'draft') {
        return (
            <svg
                data-tip={v_draft}
                className={className}
                onClick={onClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="rgb(255, 174, 0)"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#626262"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.297 8.015C15.1146 8.015 14.9397 8.08746 14.8107 8.21645L8.61187 14.4152L8.28763 15.7122L9.58459 15.388L15.7834 9.18917C15.9124 9.06018 15.9848 8.88523 15.9848 8.70281C15.9848 8.52039 15.9124 8.34544 15.7834 8.21645C15.6544 8.08746 15.4794 8.015 15.297 8.015ZM13.7808 7.18662C14.183 6.7845 14.7283 6.55859 15.297 6.55859C15.8657 6.55859 16.4111 6.7845 16.8132 7.18662C17.2153 7.58874 17.4412 8.13413 17.4412 8.70281C17.4412 9.2715 17.2153 9.81689 16.8132 10.219L10.4718 16.5604C10.3785 16.6537 10.2615 16.72 10.1335 16.752L7.46343 17.4195C7.21527 17.4815 6.95277 17.4088 6.77189 17.2279C6.59102 17.0471 6.51831 16.7846 6.58035 16.5364L7.24787 13.8663C7.27988 13.7383 7.34609 13.6214 7.43941 13.528L13.7808 7.18662Z"
                    fill="white"
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

export const SaveIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
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

const prevent = e => {
    e.preventDefault();
    e.stopPropagation();
};

const InvoiceList = ({
    vocabulary,
    invoice,
    dateFormat,
    getInvoice,
    history,
    editInvoicePaymentStatus,
    openCloseModal,
    copyInvoice,
    toggleSendInvoiceModal,
    showNotificationAction,
}) => {
    const [openMenu, setOpenMenu] = useState(false);

    const toggleOpenMenu = () => {
        setOpenMenu(!openMenu);
    };
    const styleSpan = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '50px' };
    const switchMenu = window.innerWidth < 1200;
    const { v_draft, v_paid, v_overdue, v_edit_client, v_download, v_copy, v_send, v_delete } = vocabulary;

    return (
        <Link
            to={`/invoices/view/${invoice.id}`}
            key={invoice.id}
            className={classNames('all-invoices-list-item', {
                'all-invoices-list-item--confirmed': invoice.status === 'paid',
                'all-invoices-list-item--overdue': invoice.status === 'overdue',
                'all-invoices-list-item--draft': invoice.status === 'draft',
                'all-invoices-list-item--awaiting': invoice.status === 'awaiting',
            })}
        >
            <div className="all-invoices-list-item__block">
                <div className="all-invoices-list-item__wrapper">
                    <div className="all-invoices-list-item__number">{`#${invoice.invoice_number}`}</div>
                    <div className="all-invoices-list-item__name">{invoice.to.company_name || invoice.to.name}</div>
                </div>
            </div>
            <div className="all-invoices-list-item__block">
                <div className="all-invoices-list-item__price">
                    <div> {invoice.currency}</div>{' '}
                    <span style={invoice.total > 20000 ? styleSpan : {}}>
                        {internationalFormatNum(fixNumberHundredths(spaceAndFixNumber(invoice.total)))}
                    </span>
                </div>
                <div className="all-invoices-list-item__date-wrapper">
                    <div className="all-invoices-list-item__date">
                        {moment(invoice.invoice_date).format(dateFormat)}
                    </div>
                    <div className="all-invoices-list-item__date">{moment(invoice.due_date).format(dateFormat)}</div>
                </div>
            </div>
            <div className="all-invoices-list-item__status-button" onClick={e => prevent(e)}>
                <div className="all-invoices-list-item__status-button-container">
                    <CheckIcon
                        className={invoice.status}
                        vocabulary={vocabulary}
                        onClick={e => editInvoicePaymentStatus(invoice.id, !invoice.payment_status)}
                    />
                </div>
            </div>

            {switchMenu && (
                <div
                    className={classNames('dropdown-menu', { open: openMenu })}
                    onClick={e => {
                        toggleOpenMenu();
                        prevent(e);
                    }}
                    onBlur={e => {
                        if (openMenu) {
                            setTimeout(() => {
                                toggleOpenMenu();
                            }, 200);
                        }
                    }}
                >
                    <button className="menu-btn" />
                    <div className="menu-content">
                        <EditIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={e => history.push(`/invoices/update/${invoice.id}`)}
                        />

                        <SaveIcon className="all-invoices-list-item__icon-button" />
                        <CopyIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={() => copyInvoice(invoice)}
                        />

                        <SendIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={() => toggleSendInvoiceModal(invoice)}
                        />
                        <DeleteIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={() => {
                                openCloseModal(invoice.id);
                            }}
                        />
                    </div>
                </div>
            )}
            {!switchMenu && (
                <div className="all-invoices-list-item__instruments" onClick={prevent}>
                    <div data-tip={v_edit_client}>
                        <EditIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={e => history.push(`/invoices/update/${invoice.id}`)}
                        />
                    </div>
                    <div data-tip={v_download}>
                        <SaveIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={async () => {
                                try {
                                    let responce = await downloadInvoicePDF(invoice.id);
                                    downloadPDF(responce.data, `${invoice.invoice_number}.pdf`);
                                } catch (error) {
                                    console.log(error);
                                    showNotificationAction({
                                        type: 'error',
                                        text: error.message,
                                    });
                                }
                            }}
                        />
                    </div>
                    <div data-tip={v_copy}>
                        <CopyIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={() => copyInvoice(invoice)}
                        />
                    </div>
                    <div data-tip={v_send}>
                        <SendIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={() => toggleSendInvoiceModal(invoice)}
                        />
                    </div>
                    <div data-tip={v_delete}>
                        <DeleteIcon
                            className="all-invoices-list-item__icon-button"
                            onClick={() => openCloseModal(invoice.id)}
                        />
                    </div>
                    <ReactTooltip className={'tool-tip'} arrowColor={' #FFFFFF'} place="top" />
                </div>
            )}
        </Link>
    );
};

const mapStateToProps = ({ invoicesReducer, userReducer, languageReducer }) => ({
    isFetching: invoicesReducer.isFetching,
    dateFormat: userReducer.dateFormat,
    vocabulary: languageReducer.vocabulary,
});

const mapDispatchToProps = {
    deleteInvoiceById,
    editInvoicePaymentStatus,
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceList);
