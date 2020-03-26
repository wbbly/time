import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

// Styles
import './style.scss';

const LastInvoicesList = ({ invoices, vocabulary }) => {
    const { v_invoice, v_total, v_confirm_payment } = vocabulary;

    return (
        <div className="last-invoices-list">
            {invoices.map(invoice => (
                <div
                    key={invoice.id}
                    className={classNames('last-invoices-list-item', {
                        'last-invoices-list-item--confirmed': invoice.confirmed,
                    })}
                >
                    <div className="last-invoices-list-item__top">
                        <div className="last-invoices-list-item__name">{invoice.name}</div>
                        <div className="last-invoices-list-item__thin-text">
                            {v_invoice} {`#${invoice.number}`}
                        </div>
                    </div>
                    <div className="last-invoices-list-item__bottom">
                        <div>
                            <div className="last-invoices-list-item__total">{v_total}</div>
                            <div className="last-invoices-list-item__price">
                                {invoice.currency} {invoice.price.toLocaleString()}
                            </div>
                            {!invoice.confirmed && (
                                <button className="last-invoices-list-item__confirm-button">{v_confirm_payment}</button>
                            )}
                        </div>
                        <div>
                            <div className="last-invoices-list-item__thin-text">
                                {moment(invoice.deadlineDate).format('MMM Do YYYY')}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LastInvoicesList;
