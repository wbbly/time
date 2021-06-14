import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { spaceAndFixNumber, fixNumberHundredths } from '../../../services/numberHelpers';
import { internationalFormatNum } from '../../../services/numberHelpers';
// Styles
import './style.scss';
import { Loading } from '../../Loading';
import Scrollbars from 'react-custom-scrollbars';

const TotalInvoiceCounersComponent = ({ totalSumm, vocabulary }) => {
    const {
        v_overdue,
        v_total_outstanding,
        v_draft,
        v_currency,
        v_total,
        v_no_overdues,
        v_no_total,
        v_no_drafts,
    } = vocabulary;

    const isCurrencies = totalSumm => {
        let isCurrencies = null;
        if (totalSumm) {
            isCurrencies =
                Object.keys(totalSumm.overdue).length > 1 ||
                Object.keys(totalSumm['total outstanding']).length > 1 ||
                Object.keys(totalSumm.draft).length > 1;
        }
        return isCurrencies;
    };

    return (
        <div className="total-invoice-counters">
            <div className="currency-block">
                <div className="currency-block__title">{v_overdue}</div>
                <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                    <>
                        {totalSumm && (
                            <div className="currency-block__content">
                                <div className="currency-block__content-header">
                                    <div>{v_currency}</div>
                                    <div>{v_total}</div>
                                </div>
                                {Object.keys(totalSumm.overdue).length < 1 && (
                                    <div className="currency-block__empty">{v_no_overdues}</div>
                                )}
                                {Object.keys(totalSumm.overdue).length > 0 && (
                                    <Scrollbars
                                        hideTracksWhenNotNeeded
                                        autoHeight
                                        autoHeightMin={65}
                                        autoHeightMax={165}
                                    >
                                        <ul className="currency-block__currency-list">
                                            {Object.keys(totalSumm.overdue).map((currency, index) => {
                                                return (
                                                    <li className="currency-block__list-item" key={index}>
                                                        <div className="currency-block__currency">
                                                            {currency.toUpperCase()}
                                                        </div>
                                                        <div className="currency-block__value">
                                                            {internationalFormatNum(
                                                                fixNumberHundredths(
                                                                    spaceAndFixNumber(totalSumm.overdue[currency])
                                                                )
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Scrollbars>
                                )}
                            </div>
                        )}
                    </>
                </Loading>
            </div>
            <div className="currency-block">
                <div className="currency-block__title">{v_total_outstanding}</div>
                <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                    <>
                        {totalSumm && (
                            <div className="currency-block__content">
                                <div className="currency-block__content-header">
                                    <div>{v_currency}</div>
                                    <div>{v_total}</div>
                                </div>
                                {Object.keys(totalSumm['total outstanding']).length < 1 && (
                                    <div className="currency-block__empty">{v_no_total}</div>
                                )}
                                {Object.keys(totalSumm['total outstanding']).length > 0 && (
                                    <Scrollbars
                                        hideTracksWhenNotNeeded
                                        autoHeight
                                        autoHeightMin={65}
                                        autoHeightMax={165}
                                    >
                                        <ul className="currency-block__currency-list">
                                            {Object.keys(totalSumm['total outstanding']).map((currency, index) => {
                                                return (
                                                    <li className="currency-block__list-item" key={index}>
                                                        <div className="currency-block__currency">
                                                            {currency.toUpperCase()}
                                                        </div>
                                                        <div className="currency-block__value">
                                                            {internationalFormatNum(
                                                                fixNumberHundredths(
                                                                    spaceAndFixNumber(
                                                                        totalSumm['total outstanding'][currency]
                                                                    )
                                                                )
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Scrollbars>
                                )}
                            </div>
                        )}
                    </>
                </Loading>
            </div>
            <div className="currency-block">
                <div className="currency-block__title">{v_draft}</div>
                <Loading flag={!totalSumm} mode="parentSize" withLogo={false}>
                    <>
                        {totalSumm && (
                            <div className="currency-block__content">
                                <div className="currency-block__content-header">
                                    <div>{v_currency}</div>
                                    <div>{v_total}</div>
                                </div>
                                {Object.keys(totalSumm.draft).length < 1 && (
                                    <div className="currency-block__empty">{v_no_drafts}</div>
                                )}
                                {Object.keys(totalSumm.draft).length > 0 && (
                                    <Scrollbars
                                        hideTracksWhenNotNeeded
                                        autoHeight
                                        autoHeightMin={65}
                                        autoHeightMax={165}
                                    >
                                        <ul className="currency-block__currency-list">
                                            {Object.keys(totalSumm.draft).map((currency, index) => {
                                                return (
                                                    <li className="currency-block__list-item" key={index}>
                                                        <div className="currency-block__currency">
                                                            {currency.toUpperCase()}
                                                        </div>
                                                        <div className="currency-block__value">
                                                            {internationalFormatNum(
                                                                fixNumberHundredths(
                                                                    spaceAndFixNumber(totalSumm.draft[currency])
                                                                )
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Scrollbars>
                                )}
                            </div>
                        )}
                    </>
                </Loading>
            </div>
        </div>
    );
};

export default TotalInvoiceCounersComponent;
