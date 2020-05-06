import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import moment from 'moment';
// Styles
import './style.scss';

const prevent = e => {
    e.preventDefault();
    e.stopPropagation();
};

const LastInvoicesList = ({ invoices, vocabulary }) => {
    const { v_invoice, v_total, v_confirm_payment } = vocabulary;

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
                        // TODO: enable when will have functionality for different types on backend
                        // 'last-invoices-list-item--confirmed': invoice.status === 'paid',
                        // 'last-invoices-list-item--overdue': invoice.status === 'overdue',
                        // 'last-invoices-list-item--draft': invoice.status === 'draft',
                        'last-invoices-list-item--confirmed': invoice.payment_status,
                        'last-invoices-list-item--overdue': !invoice.payment_status,
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
                                {invoice.currency} {invoice.total.toFixed()}
                            </div>
                            {!invoice.payment_status && (
                                <button onClick={prevent} className="last-invoices-list-item__confirm-button">
                                    {v_confirm_payment}
                                </button>
                            )}
                            {/* TODO: enable when will have functionality for different types on backend */}
                            {/* {invoice.status === 'draft' && (
                                <button onClick={prevent} className="last-invoices-list-item__confirm-button">
                                    Send Payment
                                </button>
                            )} */}
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

export default LastInvoicesList;
