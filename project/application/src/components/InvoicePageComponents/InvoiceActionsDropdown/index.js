import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { CopyIcon, CopyLinkIcon, DeleteIcon, EditIcon, SaveIcon, SendIcon } from '../../InvoiceList';

const InvoiceActionsDropdown = ({
    downloadHandler,
    sendHandler,
    deleteHandler,
    shareHandler,
    editHandler,
    copyHandler,
    isMobile,
    vocabulary,
}) => {
    const { v_download, v_delete, v_edit, v_clone, v_send_by_email, v_copy_and_share } = vocabulary;
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
};

export default InvoiceActionsDropdown;
