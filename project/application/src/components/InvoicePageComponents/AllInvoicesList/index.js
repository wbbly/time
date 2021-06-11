import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import InvoiceList from '../../InvoiceList/index';
import CustomPagination from '../../CustomPagination/index';
import { spaceAndFixNumber, fixNumberHundredths, internationalFormatNum } from '../../../services/numberHelpers';

// Styles
import './style.scss';

export const CheckIcon = ({ className, onClick, fill }) => {
    if (className === 'paid') {
        return (
            <svg
                className={className}
                onClick={onClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="9" fill="white" />
                <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                    fill={fill}
                />
            </svg>
        );
    } else if (className === 'overdue') {
        return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill="#EB5757"
                />
            </svg>
        );
    } else if (className === 'awaiting') {
        return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill="#F3AD26"
                />
            </svg>
        );
    }
};

export const CopyLinkIcon = ({ className, onClick, valueTip }) => (
    <svg
        onClick={onClick}
        className={className}
        data-tip={valueTip}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.33398 10.834C8.69186 11.3124 9.14845 11.7083 9.67278 11.9947C10.1971 12.2812 10.7769 12.4516 11.3729 12.4942C11.9688 12.5369 12.567 12.4509 13.1268 12.2421C13.6866 12.0333 14.1949 11.7065 14.6173 11.284L17.1173 8.78396C17.8763 7.99811 18.2963 6.9456 18.2868 5.85312C18.2773 4.76063 17.8391 3.71558 17.0666 2.94304C16.294 2.17051 15.249 1.73231 14.1565 1.72281C13.064 1.71332 12.0115 2.1333 11.2257 2.89229L9.79232 4.31729"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.6659 9.16702C11.308 8.68858 10.8514 8.2927 10.3271 8.00623C9.80274 7.71977 9.22293 7.54942 8.62698 7.50674C8.03103 7.46406 7.43287 7.55004 6.87307 7.75887C6.31327 7.96769 5.80493 8.29446 5.38252 8.71702L2.88252 11.217C2.12353 12.0029 1.70355 13.0554 1.71305 14.1479C1.72254 15.2403 2.16075 16.2854 2.93328 17.0579C3.70581 17.8305 4.75086 18.2687 5.84335 18.2782C6.93584 18.2877 7.98835 17.8677 8.77419 17.1087L10.1992 15.6837"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const EditIcon = ({ className, onClick, valueTip }) => (
    <svg
        data-tip={valueTip}
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SaveInvoice = ({ className, onClick }) => (
    <svg
        onClick={onClick}
        className={className}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M17 21V13H7V21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 3V8H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SaveIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M17.5 12.5L17.5 15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5L4.16667 17.5C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333L2.5 12.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.83268 8.33398L9.99935 12.5007L14.166 8.33398"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M10 12.5L10 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CopyIcon = ({ className, onClick, color }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.16602 12.4993H3.33268C2.89065 12.4993 2.46673 12.3238 2.15417 12.0112C1.84161 11.6986 1.66602 11.2747 1.66602 10.8327V3.33268C1.66602 2.89065 1.84161 2.46673 2.15417 2.15417C2.46673 1.84161 2.89065 1.66602 3.33268 1.66602H10.8327C11.2747 1.66602 11.6986 1.84161 12.0112 2.15417C12.3238 2.46673 12.4993 2.89065 12.4993 3.33268V4.16602"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const DeleteIcon = ({ className, onClick, color }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2.5 5H4.16667H17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
            d="M6.66602 4.99935V3.33268C6.66602 2.89065 6.84161 2.46673 7.15417 2.15417C7.46673 1.84161 7.89066 1.66602 8.33268 1.66602H11.666C12.108 1.66602 12.532 1.84161 12.8445 2.15417C13.1571 2.46673 13.3327 2.89065 13.3327 3.33268V4.99935M15.8327 4.99935V16.666C15.8327 17.108 15.6571 17.532 15.3445 17.8445C15.032 18.1571 14.608 18.3327 14.166 18.3327H5.83268C5.39065 18.3327 4.96673 18.1571 4.65417 17.8445C4.34161 17.532 4.16602 17.108 4.16602 16.666V4.99935H15.8327Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.33398 9.16602V14.166"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.666 9.16602V14.166"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SendIcon = ({ className, onClick, color }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M18.3327 1.66602L9.16602 10.8327"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M18.3327 1.66602L12.4993 18.3327L9.16602 10.8327L1.66602 7.49935L18.3327 1.66602Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const AllInvoicesList = ({
    invoices,
    vocabulary,
    isMobile,
    toggleSendInvoiceModal,
    history,
    copyInvoice,
    page,
    pageCount,
    changePage,
    grandTotal,
    confirmationModalHandler,
    editConfirmationModalHandler,
    setCurrentInvoice,
    openCloseModal,
    partialPaymentModalHandler,
}) => {
    const {
        v_draft,
        v_paid,
        v_overdue,
        v_invoice,
        v_client,
        v_price,
        v_invoice_date,
        v_invoice_due,
        v_status,
    } = vocabulary;

    const getInvoice = invoice => {
        if (invoice.payment_status) {
            return v_paid;
        } else {
            if (moment().isBefore(moment(invoice.due_date))) {
                return v_draft;
            } else {
                return v_overdue;
            }
        }
    };

    return (
        <div className="all-invoices-list">
            <div className="all-invoices-list__title-wrapper">
                <div className="data-wrapper">
                    <div className="invoice-number-title">
                        {`# ${v_invoice}`}
                        <span className="mobile-slash-separator">&nbsp;/</span>
                    </div>
                    <div className="invoice-client-title">{v_client}</div>
                </div>
                <div className="data-wrapper">
                    <div className="invoice-price-title-wrapper">
                        <div className="invoice-price-title">{v_price}</div>
                    </div>
                    <div className="date-wrapper">
                        <div className="invoice-issued-title">
                            {v_invoice_date}
                            <span className="mobile-slash-separator">&nbsp;/</span>
                        </div>
                        <div className="invoice-due-title">{v_invoice_due}</div>
                    </div>
                </div>
                <div className="invoice-status-title">{v_status}</div>
                <div className="invoice-instruments-title" />
            </div>
            {invoices.map((invoice, id) => {
                return (
                    <InvoiceList
                        invoice={invoice}
                        isMobile={isMobile}
                        openCloseModal={openCloseModal}
                        toggleSendInvoiceModal={toggleSendInvoiceModal}
                        getInvoice={getInvoice}
                        copyInvoice={copyInvoice}
                        history={history}
                        key={id}
                        confirmationModalHandler={confirmationModalHandler}
                        editConfirmationModalHandler={editConfirmationModalHandler}
                        setCurrentInvoice={setCurrentInvoice}
                        partialPaymentModalHandler={partialPaymentModalHandler}
                    />
                );
            })}
            {Object.keys(grandTotal).length && (
                <div className="all-invoices-list__grand-total-wrapper">
                    <div className="all-invoices-list__grand-total">
                        <div className="all-invoices-list__grand-total-title">Grand total:</div>
                        {Object.keys(grandTotal).map((currencyCode, key) => {
                            return (
                                <div className="all-invoices-list__grand-total-currency" key={key}>
                                    {currencyCode.toUpperCase()}{' '}
                                    {internationalFormatNum(
                                        fixNumberHundredths(spaceAndFixNumber(grandTotal[currencyCode]))
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {pageCount > 1 && <CustomPagination page={page} pageCount={pageCount} changePage={changePage} />}
        </div>
    );
};

const mapStateToProps = ({ invoicesReducer, userReducer }) => ({});

export default connect(mapStateToProps)(AllInvoicesList);
