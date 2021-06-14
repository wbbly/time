import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { CopyIcon, CopyLinkIcon, DeleteIcon, EditIcon, SaveIcon, SendIcon } from '../../SvgIcons';

const ConfirmSvg = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M11.5 19H3C1.89543 19 1 18.1046 1 17V5C1 3.89543 1.89543 3 3 3H21C22.1046 3 23 3.89543 23 5V14"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M1 7H23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="16" r="6.25" strokeWidth="1.5" />
        <path d="M14.5 16.5L16.5 18.5L19.5 13.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CancelConfirmSVG = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M11.5 19H3C1.89543 19 1 18.1046 1 17V5C1 3.89543 1.89543 3 3 3H21C22.1046 3 23 3.89543 23 5V14"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M1 7H23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="16" r="6.25" strokeWidth="1.5" />
        <path d="M14.5 16H19.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AddPaymentSVG = ({ className }) => (
    <svg
        width="18"
        height="18"
        className={className}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.625 14.25H2.25C1.42157 14.25 0.75 13.5784 0.75 12.75V3.75C0.75 2.92157 1.42157 2.25 2.25 2.25H15.75C16.5784 2.25 17.25 2.92157 17.25 3.75V10.5"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M0.75 5.25H17.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12.75" cy="12" r="4.5" stroke="black" strokeWidth="1.5" />
        <path
            d="M10.875 12.0002H14.625"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12.75 13.8752L12.75 10.1252"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const InvoiceActionsDropdown = ({
    downloadHandler,
    sendHandler,
    deleteHandler,
    shareHandler,
    editHandler,
    copyHandler,
    isMobile,
    vocabulary,
    confirmPayment,
    confirmed,
    addPartialPaymentHandler,
}) => {
    const {
        v_download,
        v_delete,
        v_edit,
        v_clone,
        v_send_by_email,
        v_copy_and_share,
        v_confirm_payment,
        v_cancel_confirm,
        v_add_part_of_payment,
    } = vocabulary;
    return (
        <div className="invoice-action-dropdown__wrapper">
            <div className="invoice-action-dropdown">
                <div className="invoice-action-dropdown__icon-arrow" />
                {isMobile && (
                    <>
                        <div className="invoice-action-dropdown__item" onClick={editHandler}>
                            <div className="invoice-action-dropdown__item-icon-block">
                                <EditIcon className="invoice-action-dropdown__item-icon action-icon" />
                            </div>
                            <div className="invoice-action-dropdown__item-text">{v_edit}</div>
                        </div>
                        <div className="invoice-action-dropdown__item" onClick={copyHandler}>
                            <div className="invoice-action-dropdown__item-icon-block">
                                <CopyIcon className="invoice-action-dropdown__item-icon action-icon" />
                            </div>
                            <div className="invoice-action-dropdown__item-text">{v_clone}</div>
                        </div>
                    </>
                )}
                <div className="invoice-action-dropdown__item" onClick={downloadHandler}>
                    <div className="invoice-action-dropdown__item-icon-block">
                        <SaveIcon className="invoice-action-dropdown__item-icon action-icon" />
                    </div>
                    <div className="invoice-action-dropdown__item-text">{v_download}</div>
                </div>
                {!confirmed ? (
                    <div className="invoice-action-dropdown__item" onClick={confirmPayment}>
                        <div className="invoice-action-dropdown__item-icon-block">
                            <ConfirmSvg className="invoice-action-dropdown__item-icon action-icon" />
                        </div>
                        <div className="invoice-action-dropdown__item-text">{v_confirm_payment}</div>
                    </div>
                ) : (
                    <div className="invoice-action-dropdown__item" onClick={confirmPayment}>
                        <div className="invoice-action-dropdown__item-icon-block">
                            <CancelConfirmSVG className="invoice-action-dropdown__item-icon action-icon" />
                        </div>
                        <div className="invoice-action-dropdown__item-text">{v_cancel_confirm}</div>
                    </div>
                )}

                <div className="invoice-action-dropdown__item" onClick={sendHandler}>
                    <div className="invoice-action-dropdown__item-icon-block">
                        <SendIcon className="invoice-action-dropdown__item-icon action-icon" />
                    </div>
                    <div className="invoice-action-dropdown__item-text">{v_send_by_email}</div>
                </div>
                <div className="invoice-action-dropdown__item" onClick={deleteHandler}>
                    <div className="invoice-action-dropdown__item-icon-block">
                        <DeleteIcon className="invoice-action-dropdown__item-icon action-icon" />
                    </div>
                    <div className="invoice-action-dropdown__item-text">{v_delete}</div>
                </div>
                <div className="invoice-action-dropdown__item" onClick={shareHandler}>
                    <div className="invoice-action-dropdown__item-icon-block">
                        <CopyLinkIcon className="invoice-action-dropdown__item-icon copy-icon" />
                    </div>
                    <div className="invoice-action-dropdown__item-text">{v_copy_and_share}</div>
                </div>
                {!confirmed && (
                    <div className="invoice-action-dropdown__item" onClick={addPartialPaymentHandler}>
                        <div className="invoice-action-dropdown__item-icon-block">
                            <AddPaymentSVG className="invoice-action-dropdown__item-icon action-icon" />
                        </div>
                        <div className="invoice-action-dropdown__item-text">{v_add_part_of_payment}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

InvoiceActionsDropdown.propTypes = {
    downloadHandler: PropTypes.func,
    sendHandler: PropTypes.func,
    deleteHandler: PropTypes.func,
    shareHandler: PropTypes.func,
    editHandler: PropTypes.func,
    copyHandler: PropTypes.func,
    isMobile: PropTypes.bool,
    vocabulary: PropTypes.object,
    confirmPayment: PropTypes.func,
    confirmed: PropTypes.bool,
};

export default InvoiceActionsDropdown;
