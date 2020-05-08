import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { spaceAndFixNumber } from '../../../services/numberHelpers';

// Styles
import './style.scss';
import { Loading } from '../../Loading';

const VectorSVG = () => (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="chevron-down"
        class="svg-inline--fa fa-chevron-down fa-w-14"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        width="100%"
        height="100%"
    >
        <path
            fill="#FFFFFF"
            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
        />
    </svg>
);

const TotalInvoiceCounersComponent = ({ invoices }) => {
    const [totalSumm, setTotalSumm] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

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
    const countTotals = invoices => {
        const initialObject = {
            overdue: {
                usd: 0,
                eur: 0,
                uah: 0,
            },
            total: {
                usd: 0,
                eur: 0,
                uah: 0,
            },
            draft: {
                usd: 0,
                eur: 0,
                uah: 0,
            },
        };
        return invoices.reduce((acc, invoice) => {
            if (getInvoiceType(invoice) === 'overdue') {
                acc.overdue[invoice.currency] += invoice.total;
                acc.total[invoice.currency] += invoice.total;
                return acc;
            }
            if (getInvoiceType(invoice) === 'draft') {
                acc.draft[invoice.currency] += invoice.total;
                acc.total[invoice.currency] += invoice.total;
                return acc;
            }
            return acc;
        }, initialObject);
    };
    useEffect(() => {
        setTotalSumm(countTotals(invoices));
    }, invoices);

    return (
        <div className="total-invoice-counters__container">
            <div className="total-invoice-counters__block">
                <div className="total-invoice-counters__block-title">Overdue</div>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames('total-invoice-counters__block-summ-container', {
                        'total-invoice-counters__block-summ-container--opened': isOpen,
                    })}
                >
                    <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                        <>
                            <div
                                className={classNames('total-invoice-counters__dropdown-arrow', {
                                    'total-invoice-counters__dropdown-arrow--rotate': isOpen,
                                })}
                            >
                                <VectorSVG />
                            </div>
                            {totalSumm && (
                                <div className="total-invoice-counters__block-summ">
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.overdue.usd)} USD
                                    </span>
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.overdue.eur)} EUR
                                    </span>
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.overdue.uah)} UAH
                                    </span>
                                </div>
                            )}
                        </>
                    </Loading>
                </div>
            </div>
            <div className="total-invoice-counters__block">
                <div className="total-invoice-counters__block-title">Total outstanding</div>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames('total-invoice-counters__block-summ-container', {
                        'total-invoice-counters__block-summ-container--opened': isOpen,
                    })}
                >
                    <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                        <>
                            <div
                                className={classNames('total-invoice-counters__dropdown-arrow', {
                                    'total-invoice-counters__dropdown-arrow--rotate': isOpen,
                                })}
                            >
                                <VectorSVG />
                            </div>
                            {totalSumm && (
                                <div className="total-invoice-counters__block-summ">
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.total.usd)} USD
                                    </span>
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.total.eur)} EUR
                                    </span>
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.total.uah)} UAH
                                    </span>
                                </div>
                            )}
                        </>
                    </Loading>
                </div>
            </div>
            <div className="total-invoice-counters__block">
                <div className="total-invoice-counters__block-title">Draft</div>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames('total-invoice-counters__block-summ-container', {
                        'total-invoice-counters__block-summ-container--opened': isOpen,
                    })}
                >
                    <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                        <>
                            <div
                                className={classNames('total-invoice-counters__dropdown-arrow', {
                                    'total-invoice-counters__dropdown-arrow--rotate': isOpen,
                                })}
                            >
                                <VectorSVG />
                            </div>
                            {totalSumm && (
                                <div className="total-invoice-counters__block-summ">
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.draft.usd)} USD
                                    </span>
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.draft.eur)} EUR
                                    </span>
                                    <span className="total-invoice-counters__block-summ-number">
                                        {spaceAndFixNumber(totalSumm.draft.uah)} UAH
                                    </span>
                                </div>
                            )}
                        </>
                    </Loading>
                </div>
            </div>
        </div>
    );
};

export default TotalInvoiceCounersComponent;
