import React, { Component } from 'react';
import classNames from 'classnames';

// Styles
import './style.scss';

//Сomponents
import { Loading } from '../../components/Loading';
import CustomScrollbar from '../../components/CustomScrollbar';
import { connect } from 'react-redux';
import LastInvoicesList from '../../components/LastInvoicesList';
import AllInvoicesList from '../../components/AllInvoicesList';
import SendInvoiceModal from "../../components/SendInvoiceModal";
import {toggleSendInvoiceModal} from "../../actions/InvoicesActions";

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
                <div
                    className={classNames('wrapper_invoices_page', {
                        'wrapper_invoices_page--mobile': isMobile,
                    })}
                >
                    <div className="data_container_invoices_page">
                        <div className="invoices_page__header">
                            <div className="invoices_page__title">{v_invoices}</div>
                            <button className="add_invoice_button" onClick={null}>
                                {v_add_new_invoice}
                            </button>
                        </div>

                        <div className="invoices_page__last_invoices">
                            <LastInvoicesList invoices={invoices.slice(0, 4)} vocabulary={vocabulary} />
                        </div>
                    </div>

                    <div className="invoices_page__all_invoices">
                        <div className="all_invoices__title">{v_all_invoices}</div>
                            <div className="all_invoices__list">
                                <AllInvoicesList invoices={invoices} vocabulary={vocabulary} />
                            </div>
                    </div>
                </div>
                </CustomScrollbar>
                {sendInvoiceModalToggle && <SendInvoiceModal
                    closeModal={toggleSendInvoiceModal}
                    vocabulary={vocabulary}
                />}
            </Loading>
        );
    }
}

const mapStateToProps = ({invoicesReducer}) => ({
    invoices: invoicesReducer.invoices,
    sendInvoiceModalToggle: invoicesReducer.sendInvoiceModalToggle,
});

const mapDispatchToProps = {
    toggleSendInvoiceModal,
};



export default connect(mapStateToProps, mapDispatchToProps)(InvoicesPage);
