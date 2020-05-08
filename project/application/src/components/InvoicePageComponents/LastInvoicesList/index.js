import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { editInvoicePaymentStatus } from '../../../actions/InvoicesActions';
import { spaceAndFixNumber } from '../../../services/numberHelpers';

// Styles
import './style.scss';

const prevent = e => {
    e.preventDefault();
    e.stopPropagation();
};

const LastInvoicesList = ({ invoices, vocabulary, toggleSendInvoiceModal, editInvoicePaymentStatus }) => {
    const { v_invoice, v_total, v_confirm_payment } = vocabulary;

    const getInvoiceType = invoice => {
        if (invoice.payment_status) {
            return 'paid';
        } else {
            if (moment().isBefore(moment(invoice.due_date))) {
                return 'draft';
            } else {
                return 'overdue';
            }
        }
    };

    return (
        <div
            className="last-invoices-list"
            className={classNames('last-invoices-list', {
                'last-invoices-list--not-full': invoices.length < 4,
            })}
        >
            {invoices.map(invoice => (
                <Link
                    to={`/invoices/view/${invoice.id}`}
                    key={invoice.id}
                    className={classNames('last-invoices-list-item', {
                        'last-invoices-list-item--confirmed': getInvoiceType(invoice) === 'paid',
                        'last-invoices-list-item--overdue': getInvoiceType(invoice) === 'overdue',
                        'last-invoices-list-item--draft': getInvoiceType(invoice) === 'draft',
                    })}
                >
                    <div className="last-invoices-list-item__top">
                        <div className="last-invoices-list-item__name">{invoice.to.name}</div>
                        <div className="last-invoices-list-item__thin-text">
                            {v_invoice} {`#${invoice.invoice_number}`}
                        </div>
                    </div>
                    <div className="last-invoices-list-item__bottom">
                        <div>
                            <div className="last-invoices-list-item__total">{v_total}</div>
                            <div className="last-invoices-list-item__price">
                                <span>{invoice.currency}</span>{' '}
                                <span className="last-invoices-list-item__price-number">
                                    {spaceAndFixNumber(invoice.total)}
                                </span>
                            </div>
                            {getInvoiceType(invoice) === 'overdue' && (
                                <button
                                    onClick={e => {
                                        prevent(e);
                                        editInvoicePaymentStatus(invoice.id, !invoice.payment_status);
                                    }}
                                    className="last-invoices-list-item__confirm-button"
                                >
                                    {v_confirm_payment}
                                </button>
                            )}
                            {getInvoiceType(invoice) === 'draft' && (
                                <button
                                    onClick={e => {
                                        prevent(e);
                                        toggleSendInvoiceModal(invoice);
                                    }}
                                    className="last-invoices-list-item__confirm-button"
                                >
                                    Send Payment
                                </button>
                            )}
                        </div>
                        <div>
                            <div className="last-invoices-list-item__thin-text">
                                {moment(invoice.due_date).format('MMM Do YYYY')}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const mapStateToProps = ({ invoicesReducer }) => ({
    isFetching: invoicesReducer.isFetching,
});

const mapDispatchToProps = {
    editInvoicePaymentStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LastInvoicesList);
