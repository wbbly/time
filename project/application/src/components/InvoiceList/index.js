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
import StatusIcon from '../StatusIcon';
import InvoiceInstruments from '../InvoiceInstruments';

const prevent = e => {
    e.preventDefault();
    e.stopPropagation();
};

const InvoiceList = ({
    vocabulary,
    invoice,
    dateFormat,
    isMobile,
    history,
    openCloseModal,
    copyInvoice,
    toggleSendInvoiceModal,
    showNotificationAction,
    confirmationModalHandler,
    editConfirmationModalHandler,
    setCurrentInvoice,
    partialPaymentModalHandler,
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

    const checkInvoceStatus = invoice => {
        if (invoice.status === 'awaiting' || invoice.status === 'reviewed') {
            editConfirmationModalHandler(invoice);
        } else {
            history.push(`/invoices/update/${invoice.id}`);
        }
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
                'all-invoices-list-item--reviewed': invoice.status === 'reviewed',
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
                    <StatusIcon
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
                <InvoiceInstruments
                    vocabulary={vocabulary}
                    invoice={invoice}
                    history={history}
                    isMobile={isMobile}
                    editConfirmationModalHandler={editConfirmationModalHandler}
                    copyInvoice={copyInvoice}
                    setCurrentInvoice={setCurrentInvoice}
                    confirmationModalHandler={confirmationModalHandler}
                    showNotificationAction={showNotificationAction}
                    toggleSendInvoiceModal={toggleSendInvoiceModal}
                    openCloseModal={openCloseModal}
                    partialPaymentModalHandler={partialPaymentModalHandler}
                />
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
