import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import './style.scss';
import { EditIcon, CopyIcon, MoreIcon } from '../SvgIcons';
import { useOutsideClick } from '../../services/hookHelpers';
import InvoiceActionsDropdown from '../InvoicePageComponents/InvoiceActionsDropdown';
import InvoiceCopyLinkModal from '../InvoicePageComponents/InvoiceCopyLinkModal';
import { downloadInvoicePDF } from '../../configAPI';
import { downloadPDF } from '../../services/downloadPDF';

const InvoiceInstruments = ({
    vocabulary,
    invoice,
    history,
    editConfirmationModalHandler,
    partialPaymentModalHandler,
    copyInvoice,
    setCurrentInvoice,
    confirmationModalHandler,
    showNotificationAction,
    toggleSendInvoiceModal,
    openCloseModal,
    onDropdownShow,
    onDropdownHide,
    isMobile,
}) => {
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const wrapperRef = useRef(null);

    const { v_edit, v_clone, v_show_more, v_link_copied } = vocabulary;

    const handleCloseActionsMenu = () => {
        if (onDropdownHide) {
            onDropdownHide();
        }
        setShowActionsMenu(false);
    };

    const handleShowActionsMenu = () => {
        if (onDropdownShow) {
            onDropdownShow();
        }
        setShowActionsMenu(true);
    };

    const checkInvoceStatus = invoice => {
        if (invoice.status === 'awaiting' || invoice.status === 'reviewed') {
            editConfirmationModalHandler(invoice);
        } else {
            history.push(`/invoices/update/${invoice.id}`);
        }
    };

    const copyToClipBoard = invoice => {
        const el = document.createElement('textarea');
        el.value = `${window.location.origin}/invoice/${invoice && invoice.id}`;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShowNotif(true);
        setTimeout(() => {
            setShowNotif(false);
        }, 2000);
    };

    useOutsideClick(wrapperRef, handleCloseActionsMenu);

    return (
        <div className="invoice-instruments">
            {!isMobile && (
                <>
                    <div>
                        <EditIcon
                            valueTip={v_edit}
                            className="all-invoices-list-item__icon-button"
                            onClick={e => checkInvoceStatus(invoice)}
                        />
                    </div>
                    <div>
                        <CopyIcon
                            valueTip={v_clone}
                            className="all-invoices-list-item__icon-button"
                            onClick={() => copyInvoice(invoice)}
                        />
                    </div>
                </>
            )}
            <div className="all-invoices-list-item__more-icon" ref={wrapperRef}>
                <MoreIcon
                    valueTip={v_show_more}
                    className={classNames('all-invoices-list-item__icon-button icon-stroke', {
                        'icon-stroke--active': showActionsMenu,
                        'icon-stroke--rotated': isMobile,
                    })}
                    onClick={() => {
                        ReactTooltip.hide();
                        if (!showActionsMenu) {
                            handleShowActionsMenu();
                        } else {
                            handleCloseActionsMenu();
                        }
                    }}
                />
                {showActionsMenu && (
                    <InvoiceActionsDropdown
                        isMobile={isMobile}
                        vocabulary={vocabulary}
                        editHandler={() => {
                            handleCloseActionsMenu();
                            checkInvoceStatus(invoice);
                        }}
                        copyHandler={() => {
                            handleCloseActionsMenu();
                            copyInvoice(invoice);
                        }}
                        downloadHandler={async () => {
                            handleCloseActionsMenu();
                            try {
                                let responce = await downloadInvoicePDF(invoice.id);
                                downloadPDF(responce.data, `invoice-${invoice.invoice_number}.pdf`);
                            } catch (error) {
                                console.log(error);
                                showNotificationAction({
                                    type: 'error',
                                    text: error.message,
                                });
                            }
                        }}
                        sendHandler={() => {
                            toggleSendInvoiceModal(invoice);
                            handleCloseActionsMenu();
                        }}
                        deleteHandler={() => {
                            openCloseModal(invoice.id);
                            handleCloseActionsMenu();
                        }}
                        shareHandler={() => {
                            handleCloseActionsMenu();
                            if (isMobile) {
                                copyToClipBoard(invoice);
                            } else {
                                setShowCopyModal(true);
                            }
                        }}
                        confirmed={invoice.status === 'paid'}
                        confirmPayment={() => {
                            setShowActionsMenu(false);
                            confirmationModalHandler();
                            setCurrentInvoice(invoice);
                        }}
                        addPartialPaymentHandler={() => {
                            setShowActionsMenu(false);
                            partialPaymentModalHandler();
                            setCurrentInvoice(invoice);
                        }}
                    />
                )}
            </div>
            {showCopyModal && (
                <InvoiceCopyLinkModal
                    handleClose={() => setShowCopyModal(false)}
                    invoiceLink={`${window.location.origin}/invoice/${invoice && invoice.id}`}
                    vocabulary={vocabulary}
                />
            )}
            {showNotif && <div className="all-invoices-list-item__mobile-notif">{v_link_copied}</div>}
            {!isMobile && (
                <ReactTooltip className={'tool-tip'} arrowColor={' #FFFFFF'} place="right" effect={'solid'} />
            )}
        </div>
    );
};

export default InvoiceInstruments;
