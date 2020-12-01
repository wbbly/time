import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';
import { useOutsideClick } from '../../../services/hookHelpers';

const CloseSVG = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18.5023 0.132198C18.326 -0.0440659 18.0375 -0.0440659 17.8612 0.132198L11.3205 6.67289C11.1443 6.84916 10.8557 6.84916 10.6795 6.67289L4.13891 0.132198C3.96265 -0.0440659 3.67414 -0.0440659 3.49787 0.132198L0.132198 3.49775C-0.0440659 3.67401 -0.0440659 3.96252 0.132198 4.13879L6.67289 10.6795C6.84916 10.8557 6.84916 11.1443 6.67289 11.3205L0.132198 17.8612C-0.0440659 18.0375 -0.0440659 18.326 0.132198 18.5023L3.49775 21.8678C3.67401 22.0441 3.96252 22.0441 4.13879 21.8678L10.6795 15.3271C10.8557 15.1508 11.1443 15.1508 11.3205 15.3271L17.8611 21.8677C18.0374 22.0439 18.3259 22.0439 18.5021 21.8677L21.8677 18.5021C22.0439 18.3259 22.0439 18.0374 21.8677 17.8611L15.3271 11.3205C15.1508 11.1443 15.1508 10.8557 15.3271 10.6795L21.8677 4.13891C22.0439 3.96265 22.0439 3.67414 21.8677 3.49787L18.5023 0.132198Z"
            fill="#828282"
        />
    </svg>
);

const InvoiceCopyLinkModal = ({ invoiceLink, handleClose, vocabulary }) => {
    const [value, setValue] = useState('');
    const [showNotif, setShowNotif] = useState(false);

    const { v_copy_link, v_done, v_copy, v_link_copied } = vocabulary;

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
                    <div className="copy-link-modal__container-header-title">{v_copy_link}</div>
                    <div className="copy-link-modal__container-header-close" onClick={handleClose}>
                        <CloseSVG />
                    </div>
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
                        {v_copy}
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
