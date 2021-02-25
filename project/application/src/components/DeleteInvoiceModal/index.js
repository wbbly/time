import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.scss';

class DeleteInvoiceModal extends Component {
    state = {
        logoFile: null,
    };

    render() {
        const { vocabulary, deleteInvoice, openCloseModal, modalOpeningId } = this.props;
        const { v_delete_invoice, v_prompt, v_delete } = vocabulary;

        return (
            <div className="delete-modal">
                <div className="delete-modal__background" />

                <div className="delete-modal__container">
                    <div className="delete-modal__container-header">
                        <div className="delete-modal__container-header-title">{v_delete_invoice}</div>
                        <i className="delete-modal__container-header-close" onClick={() => openCloseModal(false)} />
                    </div>
                    <div className="delete-modal__container-content">{v_prompt}</div>
                    <div
                        className="delete-modal__container-btn"
                        onClick={() => {
                            deleteInvoice(modalOpeningId);
                        }}
                    >
                        <div>
                            <span>{v_delete}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});
const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteInvoiceModal);
