import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteInvoiceById } from '../../actions/InvoicesActions';
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
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.33398 10.834C8.69186 11.3124 9.14845 11.7083 9.67278 11.9947C10.1971 12.2812 10.7769 12.4516 11.3729 12.4942C11.9688 12.5369 12.567 12.4509 13.1268 12.2421C13.6866 12.0333 14.1949 11.7065 14.6173 11.284L17.1173 8.78396C17.8763 7.99811 18.2963 6.9456 18.2868 5.85312C18.2773 4.76063 17.8391 3.71558 17.0666 2.94304C16.294 2.17051 15.249 1.73231 14.1565 1.72281C13.064 1.71332 12.0115 2.1333 11.2257 2.89229L9.79232 4.31729"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.6659 9.16702C11.308 8.68858 10.8514 8.2927 10.3271 8.00623C9.80274 7.71977 9.22293 7.54942 8.62698 7.50674C8.03103 7.46406 7.43287 7.55004 6.87307 7.75887C6.31327 7.96769 5.80493 8.29446 5.38252 8.71702L2.88252 11.217C2.12353 12.0029 1.70355 13.0554 1.71305 14.1479C1.72254 15.2403 2.16075 16.2854 2.93328 17.0579C3.70581 17.8305 4.75086 18.2687 5.84335 18.2782C6.93584 18.2877 7.98835 17.8677 8.77419 17.1087L10.1992 15.6837"
            stroke="white"
            strokeWidth="1.5"
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
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SaveIcon = ({ className, onClick }) => (
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
            d="M17.5 12.5L17.5 15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5L4.16667 17.5C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333L2.5 12.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.83268 8.33398L9.99935 12.5007L14.166 8.33398"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M10 12.5L10 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CopyIcon = ({ className, onClick, valueTip }) => (
    <svg
        data-tip={valueTip}
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.16602 12.4993H3.33268C2.89065 12.4993 2.46673 12.3238 2.15417 12.0112C1.84161 11.6986 1.66602 11.2747 1.66602 10.8327V3.33268C1.66602 2.89065 1.84161 2.46673 2.15417 2.15417C2.46673 1.84161 2.89065 1.66602 3.33268 1.66602H10.8327C11.2747 1.66602 11.6986 1.84161 12.0112 2.15417C12.3238 2.46673 12.4993 2.89065 12.4993 3.33268V4.16602"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const DeleteIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2.5 5H4.16667H17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
            d="M6.66602 4.99935V3.33268C6.66602 2.89065 6.84161 2.46673 7.15417 2.15417C7.46673 1.84161 7.89066 1.66602 8.33268 1.66602H11.666C12.108 1.66602 12.532 1.84161 12.8445 2.15417C13.1571 2.46673 13.3327 2.89065 13.3327 3.33268V4.99935M15.8327 4.99935V16.666C15.8327 17.108 15.6571 17.532 15.3445 17.8445C15.032 18.1571 14.608 18.3327 14.166 18.3327H5.83268C5.39065 18.3327 4.96673 18.1571 4.65417 17.8445C4.34161 17.532 4.16602 17.108 4.16602 16.666V4.99935H15.8327Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.33398 9.16602V14.166"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.666 9.16602V14.166"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SendIcon = ({ className, onClick }) => (
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
            d="M18.3327 1.66602L9.16602 10.8327"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M18.3327 1.66602L12.4993 18.3327L9.16602 10.8327L1.66602 7.49935L18.3327 1.66602Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
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
    openCloseModal,
    copyInvoice,
    toggleSendInvoiceModal,
    showNotificationAction,
    confirmationModalHandler,
    setCurrentInvoice,
}) => {
    // const [openMenu, setOpenMenu] = useState(false);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const wrapperRef = useRef(null);

    useOutsideClick(wrapperRef, () => setShowActionsMenu(false));

    // const toggleOpenMenu = () => {
    //     setOpenMenu(!openMenu);
    // };

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
                        onClick={e => {
                            confirmationModalHandler();
                            setCurrentInvoice(invoice);
                        }}
                    />
                </div>
            </div>

            <div className="all-invoices-list-item__instruments" onClick={prevent}>
                {!switchMenu && (
                    <>
                        <div>
                            <EditIcon
                                valueTip={v_edit}
                                className="all-invoices-list-item__icon-button"
                                onClick={e => history.push(`/invoices/update/${invoice.id}`)}
                            />
                        </div>
                        <div>
                            <CopyIcon
                                valueTip={v_clone}
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
                                    downloadPDF(responce.data, `invoice-${invoice.invoice_number}.pdf`);
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
                            confirmed={invoice.status === 'paid'}
                            confirmPayment={() => {
                                confirmationModalHandler();
                                setCurrentInvoice(invoice);
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
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceList);
