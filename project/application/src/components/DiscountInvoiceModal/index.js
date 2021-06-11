import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.scss';

class DiscountInvoiceModal extends Component {
    state = {
        discountField: '',
    };

    componentDidMount() {
        this.setState({ discountField: Number(this.props.initDiscount) > 0 ? this.props.initDiscount : '' });
    }

    onDiscountChange = e => {
        let val = e.target.value;

        if (val.length > 0 && val.search('^[1-9]{1}[0-9]?[0]?$') < 0) return;
        if (val > 100) return;

        this.setState({ discountField: val });
    };

    render() {
        const { closeModal, vocabulary, saveDiscount } = this.props;
        const { discountField } = this.state;
        const { v_add_a_discount, v_add_discount, v_discount_subtotal, v_cancel } = vocabulary;

        return (
            <div className="discount-modal">
                <div className="discount-modal__background" onClick={() => closeModal()} />
                <div className="discount-modal__container">
                    <div className="discount-modal__container-header">
                        <div className="discount-modal__container-header-title">{v_add_a_discount}</div>
                        <i className="discount-modal__container-header-close" onClick={() => closeModal()} />
                    </div>

                    <div className="discount-modal__main">
                        <div className="discount-modal__main-input-container">
                            <input
                                type="text"
                                placeholder="0"
                                className="discount-modal__main-input"
                                value={discountField}
                                onChange={this.onDiscountChange}
                            />
                            <div className="discount-modal__main-precent">%</div>
                        </div>
                        <span>{v_discount_subtotal}</span>
                    </div>

                    <div className="discount-modal__footer">
                        <button
                            className="discount-modal__container-btn discount-modal__btn-save"
                            onClick={() => {
                                if (!discountField) {
                                    saveDiscount(0);
                                } else {
                                    saveDiscount(Number(discountField));
                                }
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
