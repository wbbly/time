import React, { useState, useRef } from 'react';
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
import InvoiceActionsDropdown from '../InvoicePageComponents/InvoiceActionsDropdown';
import { useOutsideClick } from '../../services/hookHelpers';
import InvoiceCopyLinkModal from '../InvoicePageComponents/InvoiceCopyLinkModal';

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
                    strokeLinejoin="round"
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
export const CopyLinkIcon = ({ className, onClick, valueTip }) => (
    <svg
        onClick={onClick}
        className={className}
        data-tip={valueTip}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.5 9.74997C7.82209 10.1806 8.23302 10.5369 8.70491 10.7947C9.17681 11.0525 9.69863 11.2058 10.235 11.2442C10.7713 11.2826 11.3097 11.2052 11.8135 11.0173C12.3173 10.8294 12.7748 10.5353 13.155 10.155L15.405 7.90497C16.0881 7.19772 16.4661 6.25046 16.4575 5.26722C16.449 4.28398 16.0546 3.34343 15.3593 2.64815C14.664 1.95287 13.7235 1.55849 12.7403 1.54995C11.757 1.5414 10.8098 1.91938 10.1025 2.60247L8.8125 3.88497"
            // stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10.5006 8.24992C10.1785 7.81933 9.76762 7.46304 9.29572 7.20522C8.82383 6.9474 8.30201 6.79409 7.76565 6.75567C7.22929 6.71726 6.69095 6.79465 6.18713 6.98259C5.68331 7.17053 5.2258 7.46462 4.84564 7.84492L2.59564 10.0949C1.91255 10.8022 1.53457 11.7494 1.54311 12.7327C1.55165 13.7159 1.94604 14.6565 2.64132 15.3517C3.3366 16.047 4.27715 16.4414 5.26038 16.45C6.24362 16.4585 7.19088 16.0805 7.89814 15.3974L9.18064 14.1149"
            // stroke="#333333"
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

export const MoreIcon = ({ className, onClick, valueTip }) => (
    <svg
        onClick={onClick}
        className={className}
        width="18"
        height="18"
        data-tip={valueTip}
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9 9.75C9.41421 9.75 9.75 9.41421 9.75 9C9.75 8.58579 9.41421 8.25 9 8.25C8.58579 8.25 8.25 8.58579 8.25 9C8.25 9.41421 8.58579 9.75 9 9.75Z"
            // fill="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.25 9.75C14.6642 9.75 15 9.41421 15 9C15 8.58579 14.6642 8.25 14.25 8.25C13.8358 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.8358 9.75 14.25 9.75Z"
            // fill="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3.75 9.75C4.16421 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.16421 8.25 3.75 8.25C3.33579 8.25 3 8.58579 3 9C3 9.41421 3.33579 9.75 3.75 9.75Z"
            // fill="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
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
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const wrapperRef = useRef(null);

    useOutsideClick(wrapperRef, () => setShowActionsMenu(false));

    const toggleOpenMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleShowActionsMenu = show => {
        setShowActionsMenu(show);
    };

    const styleSpan = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '50px' };
    const switchMenu = window.innerWidth < 1200;

    const { v_edit, v_clone, v_show_more, v_link_copied } = vocabulary;

    const copyToClipBoard = invoice => {
        const el = document.createElement('textarea');
        el.value = `${window.location.origin}/invoice/${invoice && invoice.id}`;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShowNotif(true);
        setTimeout(() => {
            setShowNotif(false);
        }, 2000);
    };

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

            <div className="all-invoices-list-item__instruments" onClick={prevent}>
                {!switchMenu && (
                    <>
                        <div data-tip={v_edit}>
                            <EditIcon
                                className="all-invoices-list-item__icon-button"
                                onClick={e => history.push(`/invoices/update/${invoice.id}`)}
                            />
                        </div>
                        <div data-tip={v_clone}>
                            <CopyIcon
                                className="all-invoices-list-item__icon-button"
                                onClick={() => copyInvoice(invoice)}
                            />
                        </div>
                    </>
                )}
                <div className="all-invoices-list-item__more-icon" ref={wrapperRef}>
                    <MoreIcon
                        valueTip={v_show_more}
                        className={classNames('all-invoices-list-item__icon-button icon-stroke', {
                            'icon-stroke--active': showActionsMenu,
                            'icon-stroke--rotated': switchMenu,
                        })}
                        onClick={() => {
                            ReactTooltip.hide();
                            handleShowActionsMenu(!showActionsMenu);
                        }}
                    />
                    {showActionsMenu && (
                        <InvoiceActionsDropdown
                            isMobile={switchMenu}
                            vocabulary={vocabulary}
                            editHandler={() => {
                                setShowActionsMenu(false);
                                history.push(`/invoices/update/${invoice.id}`);
                            }}
                            copyHandler={() => {
                                setShowActionsMenu(false);
                                copyInvoice(invoice);
                            }}
                            downloadHandler={async () => {
                                setShowActionsMenu(false);
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
                            sendHandler={() => {
                                toggleSendInvoiceModal(invoice);
                                setShowActionsMenu(false);
                            }}
                            deleteHandler={() => {
                                openCloseModal(invoice.id);
                                setShowActionsMenu(false);
                            }}
                            shareHandler={() => {
                                setShowActionsMenu(false);
                                if (switchMenu) {
                                    copyToClipBoard(invoice);
                                } else {
                                    setShowCopyModal(true);
                                }
                            }}
                        />
                    )}
                </div>
                {!switchMenu && (
                    <ReactTooltip className={'tool-tip'} arrowColor={' #FFFFFF'} place="right" effect={'solid'} />
                )}
                {showCopyModal && (
                    <InvoiceCopyLinkModal
                        handleClose={() => setShowCopyModal(false)}
                        invoiceLink={`${window.location.origin}/invoice/${invoice && invoice.id}`}
                        vocabulary={vocabulary}
                    />
                )}
                {showNotif && <div className="all-invoices-list-item__mobile-notif">{v_link_copied}</div>}
            </div>
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
