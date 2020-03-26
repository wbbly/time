import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

// Styles
import './style.scss';

//Сomponents
import { Loading } from '../../components/Loading';
import CustomScrollbar from '../../components/CustomScrollbar';
import LastInvoicesList from '../../components/LastInvoicesList';
import AllInvoicesList from '../../components/AllInvoicesList';
import SendInvoiceModal from '../../components/SendInvoiceModal';
import { toggleSendInvoiceModal } from '../../actions/InvoicesActions';

class InvoicesPage extends Component {
    state = {
        isInitialFetching: true,
    };

    componentDidMount() {
        setTimeout(() => this.setState({ isInitialFetching: false }), 500);
    }

    render() {
        const { vocabulary, isMobile, invoices, sendInvoiceModalToggle, toggleSendInvoiceModal, user } = this.props;
        const { v_invoices, v_add_new_invoice, v_all_invoices } = vocabulary;
        const { isInitialFetching } = this.state;
        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar>
                    <div className="wrapper-invoices-page">
                        <div
                            className={classNames('invoices-page-top', {
                                'invoices-page-top--mobile': isMobile,
                            })}
                        >
                            <div className="invoices-page-top__header">
                                <div className="invoices-page-top__title">{v_invoices}</div>
                                <button className="invoices-page-top__add-invoice-button" onClick={null}>
                                    {v_add_new_invoice}
                                </button>
                            </div>

                            <div className="invoices-page-top__last-invoices">
                                <LastInvoicesList invoices={invoices.slice(0, 4)} vocabulary={vocabulary} />
                            </div>
                        </div>

                        <div className="invoices-page-bottom">
                            <div className="invoices-page-bottom__title">{v_all_invoices}</div>
                            <div className="invoices-page-bottom__all-invoices">
                                <AllInvoicesList invoices={invoices} vocabulary={vocabulary} />
                            </div>
                        </div>
                    </div>
                </CustomScrollbar>
                {sendInvoiceModalToggle && (
                    <SendInvoiceModal closeModal={toggleSendInvoiceModal} vocabulary={vocabulary} />
                )}
            </Loading>
        );
    }
}

const mapStateToProps = ({ invoicesReducer }) => ({
    invoices: invoicesReducer.invoices,
    sendInvoiceModalToggle: invoicesReducer.sendInvoiceModalToggle,
});

const mapDispatchToProps = {
    toggleSendInvoiceModal,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoicesPage);
