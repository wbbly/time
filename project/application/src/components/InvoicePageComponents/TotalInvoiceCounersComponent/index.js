import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

// Styles
import './style.scss';

const TotalInvoiceCounersComponent = () => {
    return (
        <div className="total-invoice-counters__container">
            <div className="total-invoice-counters__block">
                <div className="total-invoice-counters__block-title">Overdue</div>
                <div className="total-invoice-counters__block-summ">12 343 Euro</div>
            </div>
            <div className="total-invoice-counters__block">
                <div className="total-invoice-counters__block-title">Total outstanding</div>
                <div className="total-invoice-counters__block-summ">34 004 Euro</div>
            </div>
            <div className="total-invoice-counters__block">
                <div className="total-invoice-counters__block-title">Draft</div>
                <div className="total-invoice-counters__block-summ">23 043 Euro</div>
            </div>
        </div>
    );
};

export default TotalInvoiceCounersComponent;
