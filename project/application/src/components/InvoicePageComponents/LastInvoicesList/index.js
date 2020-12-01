import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { editInvoicePaymentStatus } from '../../../actions/InvoicesActions';
import { spaceAndFixNumber, fixNumberHundredths, internationalFormatNum } from '../../../services/numberHelpers';

// Styles
import './style.scss';

const prevent = e => {
    e.preventDefault();
    e.stopPropagation();
};

const LastInvoicesList = ({
    invoices,
    vocabulary,
    toggleSendInvoiceModal,
    editInvoicePaymentStatus,
    dateFormat,
    invoicesNumber,
}) => {
    const { v_invoice, v_total, v_confirm_payment, v_send_payment } = vocabulary;

    moment.lang(vocabulary.lang.short);
    return (
        <div
            className="last-invoices-list"
            className={classNames('last-invoices-list', {
                'last-invoices-list--not-full': invoices.length < 4,
            })}
        >
            {invoices.map((invoice, id) => {
                return (
                    <Link
                        to={`/invoices/view/${invoice.id}`}
                        key={invoice.id}
                        className={classNames('last-invoices-list-item', {
                            'last-invoices-list-item--confirmed': invoice.status === 'paid',
                            'last-invoices-list-item--overdue': invoice.status === 'overdue',
                            'last-invoices-list-item--draft': invoice.status === 'draft',
                            'last-invoices-list-item--awaiting': invoice.status === 'awaiting',
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
                                        {internationalFormatNum(fixNumberHundredths(spaceAndFixNumber(invoice.total)))}
                                    </span>
                                </div>
                                {(invoice.status === 'overdue' || invoice.status === 'awaiting') && (
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
                            <div>
                                <div className="last-invoices-list-item__thin-text">
                                    {moment(invoice.due_date).format(dateFormat)}
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

const mapStateToProps = ({ invoicesReducer, userReducer }) => ({
    isFetching: invoicesReducer.isFetching,
    dateFormat: userReducer.dateFormat,
});

const mapDispatchToProps = {
    editInvoicePaymentStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LastInvoicesList);
