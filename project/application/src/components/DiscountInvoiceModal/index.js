import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.scss';

class DiscountInvoiceModal extends Component {
    state = {
        discountField: 0,
    };

    componentDidMount() {
        this.setState({ discountField: this.props.initDiscount });
    }

    onDiscountChange = e => {
        if (e.target.value < 0 || e.target.value > 100) return;

        this.setState({ discountField: e.target.value });
    };

    render() {
        const { closeModal, vocabulary, saveDiscount } = this.props;
        const { discountField } = this.state;
        const { v_add_discount, v_discount_subtotal, v_cancel } = vocabulary;

        return (
            <div className="discount-modal">
                <div className="discount-modal__background" onClick={() => closeModal()} />
                <div className="discount-modal__container">
                    <div className="discount-modal__container-header">
                        <div className="discount-modal__container-header-title">{v_add_discount}</div>
                        <i className="discount-modal__container-header-close" onClick={() => closeModal()} />
                    </div>

                    <div className="discount-modal__main">
                        <div className="discount-modal__main-input-container">
                            <input
                                className="discount-modal__main-input"
                                onChange={this.onDiscountChange}
                                value={discountField}
                                type="number"
                            />
                            <div className="discount-modal__main-precent">%</div>
                        </div>
                        <span>{v_discount_subtotal}</span>
                    </div>

                    <div className="discount-modal__footer">
                        <button
                            className="discount-modal__container-btn discount-modal__btn-save"
                            onClick={() => {
                                saveDiscount(discountField);
                            }}
                        >
                            {v_add_discount}
                        </button>
                        <button
                            className="discount-modal__container-btn discount-modal__btn-cancel"
                            onClick={() => {
                                closeModal();
                            }}
                        >
                            {v_cancel}
                        </button>
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
)(DiscountInvoiceModal);
