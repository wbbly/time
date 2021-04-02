import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Actions
import { getInvoicesList, addInvoice, changePage, editInvoicePaymentStatus } from '../../actions/InvoicesActions';

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
import SearchComponent from '../../components/SearchComponent';
import { checkAccessByRole, ROLES } from '../../services/authentication';

class InvoicesPage extends Component {
    state = {
        isInitialFetching: true,
        sendInvoiceModalData: null,
        copiedInvoice: false,
        searchValue: '',
        confirmationWindowFlag: false,
        currentInvoice: null,
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
                this.props.getInvoicesList(0, this.props.limit, this.state.searchValue);
                this.setState({ copiedInvoice: false }, () => {
                    this.props.history.push(`/invoices/update/${this.props.copiedInvoiceId}`);
                });
            } else {
                this.props.getInvoicesList(this.props.page, this.props.limit, this.state.searchValue);
            }
        }
    }

    setSearchValue = value => {
        this.setState({ searchValue: value });
    };

    handleSearch = () => {
        this.props.getInvoicesList(0, this.props.limit, this.state.searchValue);
    };

    handleReset = () => {
        this.setSearchValue('');
        this.props.getInvoicesList(0, this.props.limit);
    };

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
        newObject.reference = oldObject.reference;
        return newObject;
    };

    copyInvoice = oldInvoice => {
        const newInvoice = this.prepareBodyRequest(oldInvoice);
        this.props.addInvoice(newInvoice, true);
        this.setState({ copiedInvoice: true });
    };

    confirmationModalHandler = () => {
        this.setState({ confirmationWindowFlag: !this.state.confirmationWindowFlag });
    };

    setCurrentInvoice = invoice => {
        this.setState({ currentInvoice: invoice });
    };

    confirmPaymentHandler = () => {
        this.props.editInvoicePaymentStatus(this.state.currentInvoice.id, !this.state.currentInvoice.payment_status);
        this.cancelConfirmationHandler();
    };

    cancelConfirmationHandler = () => {
        this.confirmationModalHandler();
        this.setCurrentInvoice(null);
    };

    render() {
        const {
            vocabulary,
            isMobile,
            invoices,
            page,
            pageCount,
            grandTotal,
            isFetching,
            history,
            isInitialFetching,
            userRole,
        } = this.props;
        const {
            v_invoices,
            v_add_new_invoice,
            v_confirm,
            v_cancel,
            v_payment_confirmation_window_confirm,
            v_payment_confirmation_window_cancel,
            v_page_access_denied,
            v_page_access_request_owner,
        } = vocabulary;
        const { sendInvoiceModalData, searchValue, confirmationWindowFlag, currentInvoice } = this.state;

        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar disableTimeEntriesFetch>
                    <div
                        className={classNames('wrapper-invoices-page', {
                            'wrapper-invoices-page--blured': !checkAccessByRole(userRole, [
                                ROLES.ROLE_OWNER,
                                ROLES.ROLE_INVOICES_MANAGER,
                            ]),
                        })}
                    >
                        {confirmationWindowFlag && (
                            <div className="confirmation-modal">
                                <div>
                                    <h2>
                                        {currentInvoice.payment_status
                                            ? v_payment_confirmation_window_cancel
                                            : v_payment_confirmation_window_confirm}
                                    </h2>
                                    <div>
                                        <button onClick={this.confirmPaymentHandler}>{v_confirm}</button>
                                        <button onClick={this.confirmationModalHandler}>{v_cancel}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Loading flag={isFetching} mode="overlay" withLogo={false}>
                            <div
                                className={classNames('invoices-page-top', {
                                    'invoices-page-top--mobile': isMobile,
                                })}
                            >
                                <PageHeader title={v_invoices}>
                                    {checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]) && (
                                        <>
                                            <div className="invoices-page-top__search-input">
                                                <SearchComponent
                                                    value={searchValue}
                                                    setValue={this.setSearchValue}
                                                    handleReset={this.handleReset}
                                                    handleSearch={this.handleSearch}
                                                />
                                            </div>
                                            <Link to="/invoices/create" className="header-wrapper__child-button">
                                                {v_add_new_invoice}
                                            </Link>
                                        </>
                                    )}
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
                                            confirmationModalHandler={this.confirmationModalHandler}
                                            setCurrentInvoice={this.setCurrentInvoice}
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
                                            grandTotal={grandTotal}
                                            confirmationModalHandler={this.confirmationModalHandler}
                                            setCurrentInvoice={this.setCurrentInvoice}
                                        />
                                    </div>
                                </div>
                            )}
                            {invoices &&
                                invoices.length === 0 && (
                                    <img src={blankInvoice} alt="invoice" className="blank-invoice" />
                                )}
                        </Loading>
                    </div>
                    {!checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]) && (
                        <div className="invoices-page__access-blocked">
                            <div className="invoices-page__access-blocked-text-block">
                                <span className="invoices-page__access-blocked-text">{v_page_access_denied}</span>
                                <span className="invoices-page__access-blocked-text">
                                    {v_page_access_request_owner}
                                </span>
                            </div>
                        </div>
                    )}
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

const mapStateToProps = ({ invoicesReducer, userReducer, teamReducer }) => ({
    invoices: invoicesReducer.invoices,
    page: invoicesReducer.page,
    limit: invoicesReducer.limit,
    pageCount: invoicesReducer.pageCount,
    grandTotal: invoicesReducer.grandTotal,
    isFetching: invoicesReducer.isFetching,
    isInitialFetching: invoicesReducer.isInitialFetching,
    senderId: invoicesReducer.senderId,
    defaultUserSender: userReducer.user,
    copiedInvoiceId: invoicesReducer.copiedInvoiceId,
    userRole: teamReducer.currentTeam.data.role,
});

const mapDispatchToProps = {
    getInvoicesList,
    addInvoice,
    changePage,
    editInvoicePaymentStatus,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InvoicesPage)
);
