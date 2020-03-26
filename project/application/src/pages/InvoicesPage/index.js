import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

// Styles
import './style.scss';

//Components
import { Loading } from '../../components/Loading';
import CustomScrollbar from '../../components/CustomScrollbar';
import LastInvoicesList from '../../components/LastInvoicesList';
import AllInvoicesList from '../../components/AllInvoicesList';
import SendInvoiceModal from '../../components/SendInvoiceModal';

class InvoicesPage extends Component {
    state = {
        isInitialFetching: true,
        sendInvoiceModalData: null,
    };

    componentDidMount() {
        setTimeout(() => this.setState({ isInitialFetching: false }), 500);
    }

    toggleSendInvoiceModal = (sendInvoiceModalData = null) => {
        this.setState({ sendInvoiceModalData });
    };

    render() {
        const { vocabulary, isMobile, invoices } = this.props;
        const { v_invoices, v_add_new_invoice, v_all_invoices } = vocabulary;
        const { isInitialFetching, sendInvoiceModalData } = this.state;
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
                                <AllInvoicesList
                                    toggleSendInvoiceModal={this.toggleSendInvoiceModal}
                                    invoices={invoices}
                                    vocabulary={vocabulary}
                                />
                            </div>
                        </div>
                    </div>
                </CustomScrollbar>
                {sendInvoiceModalData && (
                    <SendInvoiceModal
                        closeModal={this.toggleSendInvoiceModal}
                        vocabulary={vocabulary}
                        invoice={sendInvoiceModalData}
                    />
                )}
            </Loading>
        );
    }
}

const mapStateToProps = ({ invoicesReducer }) => ({
    invoices: invoicesReducer.invoices,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoicesPage);
