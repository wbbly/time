import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
//Styles
import './style.scss';
//Actions
import { getPartialPaymentsRequest, addPartialPayments } from '../../../actions/InvoicesActions';

//Components
import ModalPortal from '../../ModalPortal';
import CalendarSelect from '../../../components/CalendarSelect';

const AddPaymentModal = ({
    addPaymentModalHandler,
    vocabulary,
    invoiceId,
    payments,
    getPartialPaymentsRequest,
    total,
    addPartialPayments,
    confirmPaymentHandler,
}) => {
    const [modalValues, setModalValues] = useState({
        sum: '',
        date: new Date(),
        comments: '',
    });
    const [sumError, setSumError] = useState(null);

    useEffect(
        () => {
            getPartialPaymentsRequest(invoiceId);
        },
        [getPartialPaymentsRequest, invoiceId]
    );

    const {
        v_v_required,
        v_no_zero_error,
        v_no_negative,
        v_not_less,
        v_add_a_payment,
        v_sum,
        v_date,
        v_comments,
        v_cancel,
        v_add_payment,
    } = vocabulary;
    const changeDateHandler = date => {
        setModalValues({ ...modalValues, date: date });
    };
    const inputChangeHandler = e => {
        if (e.target.name === 'sum') {
            setSumError(null);
            setModalValues({ ...modalValues, [e.target.name]: e.target.value.replace(/^(-)?0+(0\.|\d)/, '$1$2') });
        } else setModalValues({ ...modalValues, [e.target.name]: e.target.value });
    };
    const addPartialPaymentsHandler = () => {
        const outstanding = total - payments.data.reduce((acc, { sum }) => acc + sum, 0);
        if (modalValues.sum) {
            if (modalValues.sum == 0) {
                setSumError(v_no_zero_error);
            } else if (+modalValues.sum < 0) {
                setSumError(v_no_negative);
            } else if (+modalValues.sum > outstanding) {
                setSumError(v_not_less);
            } else if (+modalValues.sum === outstanding) {
                addPartialPayments({ invoiceId: invoiceId, ...modalValues }).then(() => addPaymentModalHandler());
                confirmPaymentHandler();
            } else {
                addPartialPayments({ invoiceId: invoiceId, ...modalValues }).then(() => addPaymentModalHandler());
            }
        } else setSumError(v_v_required);
    };

    return (
        <ModalPortal>
            <div className="partial-modal">
                <div className="partial-modal__background" />

                <div className="partial-modal__container">
                    <div className="partial-modal__header">
                        <p>{v_add_a_payment}</p>
                        <i className="partial-modal__close-icon" onClick={addPaymentModalHandler} />
                    </div>
                    <div className="partial-modal__body">
                        <label>
                            {v_sum}
                            <input
                                name="sum"
                                type="number"
                                className="partial-modal__sum-input"
                                placeholder="$0.00"
                                value={modalValues.sum}
                                onChange={e => inputChangeHandler(e)}
                            />
                            {sumError && <div className="partial-modal__error">{sumError}</div>}
                        </label>
                        <label>
                            {v_date}
                            <div className="partial-modal__calendar">
                                <CalendarSelect date={modalValues.date} onChangeDate={changeDateHandler} />
                            </div>
                        </label>
                        <label>
                            {v_comments}
                            <input
                                name="comments"
                                className="partial-modal__input"
                                placeholder={v_comments}
                                value={modalValues.comments}
                                onChange={inputChangeHandler}
                            />
                        </label>
                        <div className="partial-modal__button-container">
                            <button className="partial-modal__button-confirm" onClick={addPartialPaymentsHandler}>
                                {v_add_payment}
                            </button>
                            <button className="partial-modal__button-cancel" onClick={addPaymentModalHandler}>
                                {v_cancel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

const mapStateToProps = ({ languageReducer, invoicesReducer }) => ({
    vocabulary: languageReducer.vocabulary,
    payments: invoicesReducer.partialPayments,
});

const mapDispatchToProps = { getPartialPaymentsRequest, addPartialPayments };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPaymentModal);
