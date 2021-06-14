import React from 'react';
import './style.scss';

const ConfirmationModal = ({ children, vocabulary, confirmHandler, cancelHandler }) => {
    return (
        <div className="confirmation-modal">
            <div className="confirmation-modal__background" />
            <div className="confirmation-modal__container">
                <h2 className="confirmation-modal__text">{children}</h2>
                <div className="confirmation-modal__buttons-wrap">
                    <button
                        className="confirmation-modal__button confirmation-modal__button--confirm"
                        onClick={confirmHandler}
                    >
                        {vocabulary.v_confirm}
                    </button>
                    <button
                        className="confirmation-modal__button confirmation-modal__button--cancel"
                        onClick={cancelHandler}
                    >
                        {vocabulary.v_cancel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
