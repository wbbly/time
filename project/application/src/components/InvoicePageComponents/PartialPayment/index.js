import React from 'react';
import './style.scss';
import { PlusIcon } from '../../DetailedInvoiceProjectsTable';
import { spaceAndFixNumber, fixNumberHundredths, internationalFormatNum } from '../../../services/numberHelpers';
import moment from 'moment';

const PartialPayment = ({ invoice, payments, calculateTotal, addPaymentModalHandler, vocabulary }) => {
    const {
        v_added_payments,
        v_date,
        v_comments,
        v_currency,
        v_paid,
        v_outstanding,
        v_no_payments,
        v_total,
    } = vocabulary;
    const prettyNum = num => internationalFormatNum(fixNumberHundredths(spaceAndFixNumber(num)));
    return (
        <div className="partial-payment">
            <div className="partial-payment__action">
                <p>{v_added_payments}</p>
                <PlusIcon onClick={addPaymentModalHandler} />
            </div>
            <div className="partial-payment__list">
                <div className="partial-payment__list-sides">
                    <div className="partial-payment__date">{v_date}</div>
                    <div className="partial-payment__comment">{v_comments}</div>
                    <div className="partial-payment__currency">{v_currency}</div>
                    <div className="partial-payment__paid">{v_paid}</div>
                    <div className="partial-payment__outstanding">{v_outstanding}</div>
                </div>
                <div>
                    {payments.data.length ? (
                        payments.data.map(payment => {
                            return (
                                <div key={payment.id} className="partial-payment__payment">
                                    <div className="partial-payment__date">
                                        {moment(payment.date).format('DD.MM.YYYY')}
                                    </div>
                                    <div className="partial-payment__comment">{payment.comment}</div>
                                    <div className="partial-payment__currency">{payment.currency.toUpperCase()}</div>
                                    <div className="partial-payment__paid">{prettyNum(payment.sum)}</div>
                                    <div className="partial-payment__outstanding">{prettyNum(payment.outstanding)}</div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="partial-payment__payment">{v_no_payments}</div>
                    )}
                </div>
                <div className="partial-payment__list-sides">
                    <div className="partial-payment__total">{v_total}</div>
                    <div />
                    <div className="partial-payment__currency">{invoice.currency.toUpperCase()}</div>
                    <div className="partial-payment__paid">
                        {prettyNum(payments.data.reduce((acc, { sum }) => acc + sum, 0))}
                    </div>
                    <div className="partial-payment__outstanding">
                        {prettyNum(
                            calculateTotal(invoice.projects, invoice.discount) -
                                payments.data.reduce((acc, { sum }) => acc + sum, 0)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartialPayment;
