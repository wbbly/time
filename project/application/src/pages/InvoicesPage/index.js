import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Actions
import { getInvoicesList, addInvoice, changePage } from '../../actions/InvoicesActions';

// Styles
import './style.scss';

//Components
import { Loading } from '../../components/Loading';
import CustomScrollbar from '../../components/CustomScrollbar';
import LastInvoicesList from '../../components/InvoicePageComponents/LastInvoicesList';
import AllInvoicesList from '../../components/InvoicePageComponents/AllInvoicesList';
import SendInvoiceModal from '../../components/InvoicePageComponents/SendInvoiceModal';
import TotalInvoiceCounersComponent from '../../components/InvoicePageComponents/TotalInvoiceCounersComponent';
import blankInvoice from '../../images/invoice_picture.png';
import PageHeader from '../../components/PageHeader/index';

class InvoicesPage extends Component {
    state = {
        isInitialFetching: true,
        sendInvoiceModalData: null,
        copiedInvoice: false,
    };

    componentDidMount() {
        setTimeout(() => this.setState({ isInitialFetching: false }), 500);
        this.props.getInvoicesList(this.props.page, this.props.limit);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (prevProps.isFetching !== this.props.isFetching && !this.props.isFetching) ||
            prevProps.page !== this.props.page
        ) {
            if (this.state.copiedInvoice) {
                this.props.getInvoicesList(0, this.props.limit);
                this.setState({ copiedInvoice: false }, () => {
                    this.props.history.push(`/invoices/update/${this.props.copiedInvoiceId}`);
                });
            } else {
                this.props.getInvoicesList(this.props.page, this.props.limit);
            }
        }
    }

    toggleSendInvoiceModal = (sendInvoiceModalData = null) => {
        this.setState({ sendInvoiceModalData });
    };

    changePage = page => {
        this.props.changePage(page.selected);
    };

    prepareBodyRequest = oldObject => {
        let dateDue = new Date();
        dateDue.setDate(dateDue.getDate() + 1);
        let newObject = {};
        newObject.vendorId = this.props.defaultUserSender.id;
        newObject.sender = oldObject.invoice_vendor;
        newObject.recipient = oldObject.to;
        newObject.dateFrom = new Date();
        newObject.dateDue = dateDue;
        newObject.timezoneOffset = oldObject.timezone_offset;
        newObject.currency = oldObject.currency;
        newObject.comment = oldObject.comment;
        newObject.projects = oldObject.projects;
        newObject.image = oldObject.logo;
        newObject.discount = oldObject.discount;
        return newObject;
    };

    copyInvoice = oldInvoice => {
        const newInvoice = this.prepareBodyRequest(oldInvoice);
        this.props.addInvoice(newInvoice, true);
        this.setState({ copiedInvoice: true });
    };

    render() {
        const { vocabulary, isMobile, invoices, page, pageCount, isFetching, history, isInitialFetching } = this.props;
        const { v_invoices, v_add_new_invoice, v_no_invoices } = vocabulary;
        const { sendInvoiceModalData } = this.state;
        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar disableTimeEntriesFetch>
                    <div className="wrapper-invoices-page">
                        <Loading flag={isFetching} mode="overlay" withLogo={false}>
                            <div
                                className={classNames('invoices-page-top', {
                                    'invoices-page-top--mobile': isMobile,
                                })}
                            >
                                <PageHeader title={v_invoices}>
                                    <Link to="/invoices/create" className="header-wrapper__child-button">
                                        {v_add_new_invoice}
                                    </Link>
                                </PageHeader>

                                {!!invoices.length && (
                                    <div className="invoices-page-top__totals">
                                        <TotalInvoiceCounersComponent invoices={invoices} vocabulary={vocabulary} />
                                    </div>
                                )}

                                {!!invoices.length && (
                                    <div className="invoices-page-top__last-invoices">
                                        <LastInvoicesList
                                            invoicesNumber={invoices.length}
                                            invoices={invoices.slice(0, 4)}
                                            vocabulary={vocabulary}
                                            toggleSendInvoiceModal={this.toggleSendInvoiceModal}
                                        />
                                    </div>
                                )}
                            </div>

                            {!!invoices.length && (
                                <div className="invoices-page-bottom">
                                    <div className="invoices-page-bottom__all-invoices">
                                        <AllInvoicesList
                                            toggleSendInvoiceModal={this.toggleSendInvoiceModal}
                                            invoices={invoices}
                                            vocabulary={vocabulary}
                                            history={history}
                                            copyInvoice={this.copyInvoice}
                                            isMobile={isMobile}
                                            page={page}
                                            pageCount={pageCount}
                                            changePage={this.changePage}
                                        />
                                    </div>
                                </div>
                            )}
                            {invoices && invoices.length === 0 && <img src={blankInvoice} className="blank-invoice" />}
                        </Loading>
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

const mapStateToProps = ({ invoicesReducer, userReducer }) => ({
    invoices: invoicesReducer.invoices,
    page: invoicesReducer.page,
    limit: invoicesReducer.limit,
    pageCount: invoicesReducer.pageCount,
    isFetching: invoicesReducer.isFetching,
    isInitialFetching: invoicesReducer.isInitialFetching,
    senderId: invoicesReducer.senderId,
    defaultUserSender: userReducer.user,
    copiedInvoiceId: invoicesReducer.copiedInvoiceId,
});

const mapDispatchToProps = {
    getInvoicesList,
    addInvoice,
    changePage,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InvoicesPage)
);
