import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';
import { useOutsideClick } from '../../../services/hookHelpers';

const InvoiceCopyLinkModal = ({ invoiceLink, handleClose, vocabulary }) => {
    const [value, setValue] = useState('');
    const [showNotif, setShowNotif] = useState(false);

    const { v_copy_the_link, v_copy_link, v_done, v_link_copied } = vocabulary;

    useEffect(
        () => {
            if (invoiceLink) {
                setValue(invoiceLink);
            }
        },
        [invoiceLink]
    );

    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useOutsideClick(wrapperRef, () => handleClose());

    const copyToClipBoard = () => {
        inputRef.current.select();
        document.execCommand('copy');
        inputRef.current.blur();
    };

    const handleCopyAction = () => {
        if (showNotif) return;
        copyToClipBoard();
        setShowNotif(true);
        setTimeout(() => {
            setShowNotif(false);
        }, 2000);
    };

    return (
        <div className="copy-link-modal">
            <div className="copy-link-modal__container" ref={wrapperRef}>
                <div
                    className={classnames('copy-link-modal__container-notification', {
                        'copy-link-modal__container-notification--visible': showNotif,
                    })}
                >
                    {v_link_copied}
                </div>
                <div className="copy-link-modal__container-header">
                    <div className="copy-link-modal__container-header-title">{v_copy_the_link}</div>
                    <i className="copy-link-modal__container-header-close" onClick={handleClose} />
                </div>
                <div className="copy-link-modal__container-main">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="copy-link-modal__container-main-input"
                    />
                    <div className="copy-link-modal__container-main-btn" onClick={handleCopyAction}>
                        {v_copy_link}
                    </div>
                </div>
                <div className="copy-link-modal__container-done" onClick={handleClose}>
                    {v_done}
                </div>
            </div>
        </div>
    );
};

InvoiceCopyLinkModal.propTypes = {
    invoiceLink: PropTypes.string,
    handleClose: PropTypes.func,
    vocabulary: PropTypes.object,
    handleCopy: PropTypes.func,
};

export default InvoiceCopyLinkModal;
