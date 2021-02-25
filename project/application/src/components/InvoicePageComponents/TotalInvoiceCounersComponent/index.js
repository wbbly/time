import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { spaceAndFixNumber, fixNumberHundredths } from '../../../services/numberHelpers';
import { internationalFormatNum } from '../../../services/numberHelpers';
// Styles
import './style.scss';
import { Loading } from '../../Loading';

const VectorSVG = () => (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="chevron-down"
        className="svg-inline--fa fa-chevron-down fa-w-14"
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

const TotalInvoiceCounersComponent = ({ invoices, vocabulary }) => {
    const [totalSumm, setTotalSumm] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { v_overdue, v_total_outstanding, v_draft } = vocabulary;

    const countTotals = invoices => {
        const initialObject = {
            overdue: {},
            total: {},
            draft: {},
        };

        return invoices.reduce((acc, invoice) => {
            if (invoice.status === 'overdue') {
                if (acc.overdue[invoice.currency] === undefined) {
                    acc.overdue[invoice.currency] = 0;
                }
                acc.overdue[invoice.currency] += invoice.total;
                return acc;
            }
            if (invoice.status === 'awaiting') {
                if (acc.total[invoice.currency] === undefined) {
                    acc.total[invoice.currency] = 0;
                }
                acc.total[invoice.currency] += invoice.total;
                return acc;
            }
            if (invoice.status === 'draft') {
                if (acc.draft[invoice.currency] === undefined) {
                    acc.draft[invoice.currency] = 0;
                }
                acc.draft[invoice.currency] += invoice.total;
                return acc;
            }

            return acc;
        }, initialObject);
    };
    useEffect(
        () => {
            setTotalSumm(countTotals(invoices));
        },
        [invoices]
    );

    let isCurrencies = null;
    if (totalSumm) {
        isCurrencies =
            Object.keys(totalSumm.overdue).length > 1 ||
            Object.keys(totalSumm.total).length > 1 ||
            Object.keys(totalSumm.draft).length > 1;
    }
    return (
        <div className="total-invoice-counters__container">
            <div className="total-invoice-counters__block">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames('total-invoice-counters__block-summ-container', {
                        'total-invoice-counters__block-summ-container--opened': isOpen && isCurrencies,
                    })}
                    style={isCurrencies ? { cursor: 'pointer' } : { cursor: 'default' }}
                >
                    <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                        <>
                            {totalSumm && (
                                <div className="total-invoice-counters__block-summ">
                                    <div className="total-invoice-counters__block-title">{v_overdue}</div>
                                    {Object.keys(totalSumm.overdue).length < 1 && (
                                        <span
                                            className="total-invoice-counters__block-summ-number"
                                            style={{ textAlign: 'center' }}
                                        >
                                            -
                                        </span>
                                    )}
                                    {Object.keys(totalSumm.overdue).map((currency, index) => {
                                        return (
                                            <span className="total-invoice-counters__block-summ-number" key={index}>
                                                {`${internationalFormatNum(
                                                    fixNumberHundredths(spaceAndFixNumber(totalSumm.overdue[currency]))
                                                )}  ${currency.toUpperCase()}`}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    </Loading>
                </div>
                {isCurrencies && (
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={classNames('total-invoice-counters__dropdown-arrow', {
                            'total-invoice-counters__dropdown-arrow--rotate': isOpen && isCurrencies,
                        })}
                    >
                        <VectorSVG />
                    </div>
                )}
            </div>
            <div className="total-invoice-counters__block">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames('total-invoice-counters__block-summ-container', {
                        'total-invoice-counters__block-summ-container--opened': isOpen && isCurrencies,
                    })}
                    style={isCurrencies ? { cursor: 'pointer' } : { cursor: 'default' }}
                >
                    <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                        <>
                            {totalSumm && (
                                <div className="total-invoice-counters__block-summ">
                                    <div className="total-invoice-counters__block-title">{v_total_outstanding}</div>
                                    {Object.keys(totalSumm.total).length < 1 && (
                                        <span
                                            className="total-invoice-counters__block-summ-number"
                                            style={{ textAlign: 'center' }}
                                        >
                                            -
                                        </span>
                                    )}
                                    {Object.keys(totalSumm.total).map((currency, index) => {
                                        return (
                                            <span className="total-invoice-counters__block-summ-number" key={index}>
                                                {`${internationalFormatNum(
                                                    fixNumberHundredths(spaceAndFixNumber(totalSumm.total[currency]))
                                                )}  ${currency.toUpperCase()}`}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    </Loading>
                </div>
                {isCurrencies && (
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={classNames('total-invoice-counters__dropdown-arrow', {
                            'total-invoice-counters__dropdown-arrow--rotate': isOpen && isCurrencies,
                        })}
                    >
                        <VectorSVG />
                    </div>
                )}
            </div>
            <div className="total-invoice-counters__block">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames('total-invoice-counters__block-summ-container', {
                        'total-invoice-counters__block-summ-container--opened': isOpen && isCurrencies,
                    })}
                    style={isCurrencies ? { cursor: 'pointer' } : { cursor: 'default' }}
                >
                    <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                        <>
                            {totalSumm && (
                                <div className="total-invoice-counters__block-summ">
                                    <div className="total-invoice-counters__block-title">{v_draft}</div>
                                    {Object.keys(totalSumm.draft).length < 1 && (
                                        <span
                                            className="total-invoice-counters__block-summ-number"
                                            style={{ textAlign: 'center' }}
                                        >
                                            -
                                        </span>
                                    )}
                                    {Object.keys(totalSumm.draft).map((currency, index) => {
                                        return (
                                            <span className="total-invoice-counters__block-summ-number" key={index}>
                                                {`${internationalFormatNum(
                                                    fixNumberHundredths(spaceAndFixNumber(totalSumm.draft[currency]))
                                                )}  ${currency.toUpperCase()}`}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    </Loading>
                </div>
                {isCurrencies && (
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={classNames('total-invoice-counters__dropdown-arrow', {
                            'total-invoice-counters__dropdown-arrow--rotate': isOpen && isCurrencies,
                        })}
                    >
                        <VectorSVG />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TotalInvoiceCounersComponent;
