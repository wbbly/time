import React from 'react';
import classNames from "classnames";

// Styles
import './style.scss';
import moment from "moment";

const LastInvoicesList = ({invoices, vocabulary}) => {

    const {v_invoice, v_total, v_confirm_payment} = vocabulary;

    return (
        <div className="last_invoices_list">
            {invoices.map(invoice => (
                <div className={classNames('list_item', {
                    'confirmed': invoice.confirmed,
                })}>
                    <div className="top">
                        <div className="name">{invoice.name}</div>
                        <div className="thin_text">{v_invoice} #{invoice.number}</div>
                    </div>
                    <div className="bottom">
                        <div>
                            <div className="total">{v_total}</div>
                            <div className="price">{invoice.currency} {invoice.price.toLocaleString()}</div>
                            {!invoice.confirmed && <button className="confirm_button">{v_confirm_payment}</button>}
                        </div>
                        <div>
                            <div className="thin_text">{moment(invoice.deadlineDate).format("MMM Do YYYY")}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default LastInvoicesList;
