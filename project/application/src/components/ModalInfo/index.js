import React, { Component } from 'react';

import classNames from 'classnames';

import './style.scss';

class ModalInfo extends Component {
    render() {
        return (
            <div
                className={classNames('modal-info', { 'modal-info--hidden': !this.props.modalInfoVisible })}
                onClick={this.props.onClick}
            >
                <div className={classNames('modal-info-icon', `modal-info-icon--${this.props.modalInfoType}`)} />
                <div className="modal-info-text">
                    <p>{this.props.modalInfoText}</p>
                </div>
            </div>
        );
    }
}

export default ModalInfo;
