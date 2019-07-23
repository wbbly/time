import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import noConnection from '../../images/icons/no-wifi.svg';
import connectionRestored from '../../images/icons/wifi.svg';

import './style.scss';

class ModalInfo extends Component {
    state = {
        showModal: false,
        modalInfoContent: {
            type: 'lost-connection',
        },
    };

    componentDidMount() {
        window.addEventListener('online', this.connectionRestore);
        window.addEventListener('offline', this.connectionLost);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.connectionRestore);
        window.removeEventListener('offline', this.connectionLost);
    }

    connectionRestore = e => {
        const { v_connection_restored } = this.props.vocabulary;
        this.showModalInfo(v_connection_restored, 'connection-restored');
    };

    connectionLost = e => {
        const { v_connection_problem } = this.props.vocabulary;
        this.showModalInfo(v_connection_problem, 'lost-connection');
    };

    showModalInfo = (text, type) => {
        this.setState({ showModal: true, modalInfoContent: { text, type } });
    };

    hideModalInfo = () => {
        this.setState({
            showModal: false,
            modalInfoContent: {
                type: 'lost-connection',
            },
        });
    };

    render() {
        const { showModal, modalInfoContent } = this.state;
        return (
            <div
                className={classNames(
                    'modal-info',
                    { 'modal-info--mobile': this.props.isMobile },
                    { 'modal-info--hidden': !showModal }
                )}
                onClick={this.hideModalInfo}
            >
                <div className={classNames('modal-info-icon', `modal-info-icon--${modalInfoContent.type}`)}>
                    <img src={modalInfoContent.type === 'lost-connection' ? noConnection : connectionRestored} />
                </div>
                <div className="modal-info-text">
                    <p>{modalInfoContent.text}</p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
});

export default connect(mapStateToProps)(ModalInfo);
