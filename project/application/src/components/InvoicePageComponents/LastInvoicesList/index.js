import React from 'react';
// { useState }

import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { spaceAndFixNumber, fixNumberHundredths, internationalFormatNum } from '../../../services/numberHelpers';
import { showNotificationAction } from '../../../actions/NotificationActions';

// Styles
import './style.scss';
import StatusIcon from '../../StatusIcon';
import InvoiceInstruments from '../../InvoiceInstruments';

const prevent = e => {
    e.preventDefault();
    e.stopPropagation();
};

const LastInvoicesList = ({
    history,
    isMobile,
    invoices,
    vocabulary,
    toggleSendInvoiceModal,
    showNotificationAction,
    editInvoicePaymentStatus,
    dateFormat,
    invoicesNumber,
    confirmationModalHandler,
    editConfirmationModalHandler,
    setCurrentInvoice,
    copyInvoice,
    openCloseModal,
    partialPaymentModalHandler,
}) => {
    const { v_invoice, v_total, v_confirm_payment, v_send_payment, v_last_invoices } = vocabulary;

    const onHover = ref => {
        if (!ref.current.classList.contains('last-invoices-list-item--fixed')) {
            ref.current.classList.add('last-invoices-list-item--hover');
        }
    };

    const onBlur = ref => {
        if (!ref.current.classList.contains('last-invoices-list-item--fixed')) {
            ref.current.classList.remove('last-invoices-list-item--hover');
        }
    };

    const onDropdownShow = ref => {
        if (ref.current) {
            if (ref.current.classList.contains('last-invoices-list-item--hover')) {
                ref.current.classList.remove('last-invoices-list-item--hover');
            }
            if (!ref.current.classList.contains('last-invoices-list-item--fixed')) {
                ref.current.classList.add('last-invoices-list-item--fixed');
            }
        }
    };

    const onDropdownHide = ref => {
        if (ref.current) {
            if (ref.current.classList.contains('last-invoices-list-item--hover')) {
                ref.current.classList.remove('last-invoices-list-item--hover');
            }
            if (ref.current.classList.contains('last-invoices-list-item--fixed')) {
                ref.current.classList.remove('last-invoices-list-item--fixed');
            }
        }
    };

    const addRefs = invoices => {
        return invoices.map(item => {
            const newItem = { ...item };
            newItem.innerRef = React.createRef();
            return newItem;
        });
    };

    moment.lang(vocabulary.lang.short);
    return (
        <div
            className={classNames('last-invoices-list', {
                'last-invoices-list--not-full': invoices.length < 4,
            })}
        >
            <div className="last-invoices-list__title">{v_last_invoices}</div>
            <div className="last-invoices-list__container">
                {addRefs(invoices).map((invoice, id) => {
                    return (
                        <Link
                            to={`/invoices/view/${invoice.id}`}
                            key={invoice.id}
                            ref={invoice.innerRef}
                            className={classNames('last-invoices-list-item')}
                            onMouseEnter={() => onHover(invoice.innerRef)}
                            onMouseLeave={() => onBlur(invoice.innerRef)}
                        >
                            <div className="last-invoices-list-item__top">
                                <div className="last-invoices-list-item__header">
                                    <div className="last-invoices-list-item__status-wrap">
                                        <StatusIcon className={invoice.status} vocabulary={vocabulary} />
                                        <div className="last-invoices-list-item__number">
                                            {`#${invoice.invoice_number}`}
                                        </div>
                                    </div>
                                    <div className="last-invoices-list-item__instruments" onClick={prevent}>
                                        <InvoiceInstruments
                                            isMobile={false}
                                            vocabulary={vocabulary}
                                            invoice={invoice}
                                            history={history}
                                            onDropdownShow={() => onDropdownShow(invoice.innerRef)}
                                            onDropdownHide={() => onDropdownHide(invoice.innerRef)}
                                            editConfirmationModalHandler={editConfirmationModalHandler}
                                            confirmationModalHandler={confirmationModalHandler}
                                            partialPaymentModalHandler={partialPaymentModalHandler}
                                            copyInvoice={copyInvoice}
                                            setCurrentInvoice={setCurrentInvoice}
                                            showNotificationAction={showNotificationAction}
                                            toggleSendInvoiceModal={toggleSendInvoiceModal}
                                            openCloseModal={openCloseModal}
                                        />
                                    </div>
                                    <div className="last-invoices-list-item__date">
                                        {moment(invoice.due_date).format(dateFormat)}
                                    </div>
                                </div>
                                <div className="last-invoices-list-item__name">{invoice.to.name}</div>
                            </div>
                            <div className="last-invoices-list-item__bottom">
                                <div className="last-invoices-list-item__total-price">
                                    <div className="last-invoices-list-item__total">{v_total}</div>
                                    <div className="last-invoices-list-item__price">
                                        <span>{invoice.currency}</span>{' '}
                                        <span className="last-invoices-list-item__price-number">
                                            {internationalFormatNum(
                                                fixNumberHundredths(spaceAndFixNumber(invoice.total))
                                            )}
                                        </span>
                                    </div>
                                </div>
                                {(invoice.status === 'overdue' ||
                                    invoice.status === 'awaiting' ||
                                    invoice.status === 'reviewed') && (
                                    <button
                                        onClick={e => {
                                            prevent(e);
                                            setCurrentInvoice(invoice);
                                            confirmationModalHandler();
                                        }}
                                        className="last-invoices-list-item__confirm-button"
                                    >
                                        {v_confirm_payment}
                                    </button>
                                )}
                                {invoice.status === 'draft' && (
                                    <button
                                        onClick={e => {
                                            prevent(e);
                                            toggleSendInvoiceModal(invoice);
                                        }}
                                        className="last-invoices-list-item__confirm-button"
                                    >
                                        {v_send_payment}
                                    </button>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

const mapStateToProps = ({ invoicesReducer, userReducer }) => ({
    isFetching: invoicesReducer.isFetching,
    dateFormat: userReducer.dateFormat,
});

const mapDispatchToProps = {
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LastInvoicesList);
