import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Actions
import {
    getInvoicesList,
    addInvoice,
    changePage,
    editInvoicePaymentStatus,
    deleteInvoiceById,
    getInvoicesCountsByStatusAction,
    resetInvoicesParams,
    changeInitialLoaderAction,
} from '../../actions/InvoicesActions';

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
import DeleteInvoiceModal from '../../components/DeleteInvoiceModal/index';
import FilterByStatus from '../../components/FilterByStatus';
import AddPaymentModal from '../../components/InvoicePageComponents/AddPaymentModal';

//Functions
import { calculateTotal } from '../InvoicesPageDetailed';
import ConfirmationModal from '../../components/ConfirmationModal';

class InvoicesPage extends Component {
    state = {
        sendInvoiceModalData: null,
        copiedInvoice: false,
        searchValue: '',
        confirmationWindowFlag: false,
        editConfirmationWindowFlag: false,
        currentInvoice: null,
        modalOpeningId: false,
        filterStatus: 'all',
        partialPaymentModal: false,
    };

    componentDidMount() {
        if (
            this.props.userRole &&
            checkAccessByRole(this.props.userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER])
        ) {
            this.props.getInvoicesList({
                page: 0,
                limit: this.props.limit,
                isInitialFetching: true,
                status: this.state.filterStatus,
            });
            this.props.getInvoicesCountsByStatusAction();
        } else {
            this.props.changeInitialLoaderAction(false);
        }
    }

    componentWillUnmount() {
        this.props.resetInvoicesParams();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userRole !== this.props.userRole) {
            if (checkAccessByRole(this.props.userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER])) {
                this.props.getInvoicesList({
                    page: 0,
                    limit: this.props.limit,
                    isInitialFetching: true,
                    status: this.state.filterStatus,
                });
                this.props.getInvoicesCountsByStatusAction();
            } else {
                this.props.changeInitialLoaderAction(false);
            }
        }
        if (prevProps.isFetching !== this.props.isFetching && !this.props.isFetching) {
            if (this.state.copiedInvoice) {
                this.props.getInvoicesList({
                    page: this.props.page,
                    limit: this.props.limit,
                    searchValue: this.state.searchValue,
                    status: this.state.filterStatus,
                });
                this.setState({ copiedInvoice: false }, () => {
                    this.props.history.push(`/invoices/update/${this.props.copiedInvoiceId}`);
                });
            }
        }
    }

    openCloseModal = value => {
        this.setState({ modalOpeningId: value });
    };

    getInvocesListWithCounts = () => {
        this.props.getInvoicesList({
            page: this.props.page,
            limit: this.props.limit,
            searchValue: this.state.searchValue,
            status: this.state.filterStatus,
        });
        this.props.getInvoicesCountsByStatusAction();
    };

    deleteInvoice = id => {
        this.openCloseModal(false);
        this.props.deleteInvoiceById(id);
        this.getInvocesListWithCounts();
    };

    setSearchValue = value => {
        this.setState({ searchValue: value });
    };

    handleSearch = () => {
        this.props.changePage(0);
        this.props.getInvoicesList({
            page: 0,
            limit: this.props.limit,
            searchValue: this.state.searchValue,
            status: this.state.filterStatus,
        });
    };

    handleReset = () => {
        this.setSearchValue('');
        this.props.changePage(0);
        this.props.getInvoicesList({
            page: 0,
            limit: this.props.limit,
            status: this.state.filterStatus,
        });
    };

    toggleSendInvoiceModal = (sendInvoiceModalData = null) => {
        this.setState({ sendInvoiceModalData });
    };

    changePage = page => {
        this.props.changePage(page.selected);
        this.props.getInvoicesList({
            page: page.selected,
            limit: this.props.limit,
            searchValue: this.state.searchValue,
            status: this.state.filterStatus,
        });
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

    editConfirmationModalToggler = () => {
        this.setState({ editConfirmationWindowFlag: !this.state.editConfirmationWindowFlag });
    };

    editConfirmationModalHandler = invoice => {
        this.setCurrentInvoice(invoice);
        this.editConfirmationModalToggler();
    };

    confirmEditHandler = () => {
        this.editConfirmationModalToggler();
        this.props.history.push(`/invoices/update/${this.state.currentInvoice.id}`);
    };

    cancelEditHandler = () => {
        this.editConfirmationModalToggler();
        this.setCurrentInvoice(null);
    };

    setCurrentInvoice = invoice => {
        this.setState({ currentInvoice: invoice });
    };

    confirmPaymentHandler = async (invoiceId, isPaid) => {
        if (this.state.confirmationWindowFlag) {
            this.cancelConfirmationHandler();
        }
        await this.props.editInvoicePaymentStatus(invoiceId, isPaid);
        this.getInvocesListWithCounts();
    };

    cancelConfirmationHandler = () => {
        this.confirmationModalHandler();
        this.setCurrentInvoice(null);
    };

    setFilterStatus = status => {
        this.setState({ filterStatus: status });
        this.props.changePage(0);
        this.props.getInvoicesList({
            page: 0,
            limit: this.props.limit,
            searchValue: this.state.searchValue,
            status,
        });
    };

    partialPaymentModalHandler = () => {
        this.setState({ partialPaymentModal: !this.state.partialPaymentModal });
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
            totalSumm,
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
            v_edit_confirmation_window,
            v_filter_all_invoices,
            v_filter_draft,
            v_filter_awaiting,
            v_filter_reviewed,
            v_filter_paid,
            v_filter_overdue,
        } = vocabulary;

        const {
            sendInvoiceModalData,
            searchValue,
            confirmationWindowFlag,
            editConfirmationWindowFlag,
            currentInvoice,
            modalOpeningId,
            filterStatus,
        } = this.state;

        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar disableTimeEntriesFetch>
                    <div
                        className={classNames('wrapper-invoices-page', {
                            'wrapper-invoices-page--blured':
                                userRole &&
                                !checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]),
                        })}
                    >
                        <Loading flag={isFetching} mode="overlay" withLogo={false}>
                            <div
                                className={classNames('invoices-page-top', {
                                    'invoices-page-top--mobile': isMobile,
                                })}
                            >
                                <PageHeader title={v_invoices}>
                                    {userRole &&
                                        checkAccessByRole(userRole, [
                                            ROLES.ROLE_OWNER,
                                            ROLES.ROLE_INVOICES_MANAGER,
                                        ]) && (
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
                                        <TotalInvoiceCounersComponent totalSumm={totalSumm} vocabulary={vocabulary} />
                                    </div>
                                )}

                                {!!invoices.length && (
                                    <div className="invoices-page-top__last-invoices">
                                        <LastInvoicesList
                                            isMobile={isMobile}
                                            history={history}
                                            copyInvoice={this.copyInvoice}
                                            openCloseModal={this.openCloseModal}
                                            invoicesNumber={invoices.length}
                                            invoices={invoices.slice(0, 4)}
                                            vocabulary={vocabulary}
                                            toggleSendInvoiceModal={this.toggleSendInvoiceModal}
                                            confirmationModalHandler={this.confirmationModalHandler}
                                            editConfirmationModalHandler={this.editConfirmationModalHandler}
                                            setCurrentInvoice={this.setCurrentInvoice}
                                            partialPaymentModalHandler={this.partialPaymentModalHandler}
                                        />
                                    </div>
                                )}
                            </div>
                            <FilterByStatus
                                status={filterStatus}
                                onClick={this.setFilterStatus}
                                items={[
                                    {
                                        id: 'all',
                                        text: v_filter_all_invoices,
                                    },
                                    {
                                        id: 'draft',
                                        text: v_filter_draft,
                                    },
                                    {
                                        id: 'awaiting',
                                        text: v_filter_awaiting,
                                    },
                                    {
                                        id: 'reviewed',
                                        text: v_filter_reviewed,
                                    },
                                    {
                                        id: 'paid',
                                        text: v_filter_paid,
                                    },
                                    {
                                        id: 'overdue',
                                        text: v_filter_overdue,
                                    },
                                ]}
                            />
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
                                            openCloseModal={this.openCloseModal}
                                            changePage={this.changePage}
                                            grandTotal={grandTotal}
                                            confirmationModalHandler={this.confirmationModalHandler}
                                            editConfirmationModalHandler={this.editConfirmationModalHandler}
                                            setCurrentInvoice={this.setCurrentInvoice}
                                            partialPaymentModalHandler={this.partialPaymentModalHandler}
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
                    {userRole &&
                        !checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]) && (
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
                {confirmationWindowFlag && (
                    <ConfirmationModal
                        vocabulary={vocabulary}
                        confirmHandler={() =>
                            this.confirmPaymentHandler(currentInvoice.id, !currentInvoice.payment_status)
                        }
                        cancelHandler={this.confirmationModalHandler}
                    >
                        {currentInvoice.payment_status
                            ? v_payment_confirmation_window_cancel
                            : v_payment_confirmation_window_confirm}
                    </ConfirmationModal>
                )}
                {editConfirmationWindowFlag && (
                    <ConfirmationModal
                        vocabulary={vocabulary}
                        confirmHandler={this.confirmEditHandler}
                        cancelHandler={this.cancelEditHandler}
                    >
                        {v_edit_confirmation_window}
                    </ConfirmationModal>
                )}
                {sendInvoiceModalData && (
                    <SendInvoiceModal
                        closeModal={this.toggleSendInvoiceModal}
                        vocabulary={vocabulary}
                        invoice={sendInvoiceModalData}
                        getInvoices={this.getInvocesListWithCounts}
                    />
                )}
                {modalOpeningId && (
                    <DeleteInvoiceModal
                        deleteInvoice={this.deleteInvoice}
                        openCloseModal={this.openCloseModal}
                        modalOpeningId={modalOpeningId}
                    />
                )}
                {this.state.partialPaymentModal && (
                    <AddPaymentModal
                        addPaymentModalHandler={this.partialPaymentModalHandler}
                        confirmPaymentHandler={() => this.confirmPaymentHandler(this.state.currentInvoice.id, true)}
                        invoiceId={this.state.currentInvoice.id}
                        total={calculateTotal(this.state.currentInvoice.projects, this.state.currentInvoice.discount)}
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
    totalSumm: invoicesReducer.totalSumm,
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
    deleteInvoiceById,
    getInvoicesCountsByStatusAction,
    resetInvoicesParams,
    changeInitialLoaderAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InvoicesPage)
);
