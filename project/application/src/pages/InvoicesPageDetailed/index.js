import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { addInvoice, getInvoice, updateInvoice } from '../../actions/InvoicesActions';

//Styles
import './style.scss';

//Components
import { Loading } from '../../components/Loading';
import {
    CopyIcon,
    DeleteIcon,
    EditIcon,
    SaveIcon,
    SendIcon,
} from '../../components/InvoicePageComponents/AllInvoicesList';
import CustomScrollbar from '../../components/CustomScrollbar';
import DetailedInvoiceProjectsTable from '../../components/DetailedInvoiceProjectsTable';
import classNames from 'classnames';
import { getProjectsListActions } from '../../actions/ProjectsActions';
import { connect } from 'react-redux';
import CurrencySelect from '../../components/CurrencySelect';
import CalendarSelect from '../../components/CalendarSelect';
import { getCurrentTeamDetailedDataAction } from '../../actions/TeamActions';
import PersonSelect from '../../components/PersonSelect';
import { getClientsAction } from '../../actions/ClientsActions';
import ImagePicker from '../../components/ImagePicker';

const ArrowLeftIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="42"
        height="24"
        viewBox="0 0 42 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M0.939339 10.9393C0.353554 11.5251 0.353554 12.4749 0.939339 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939339 10.9393ZM42 10.5L2 10.5V13.5L42 13.5V10.5Z"
            fill="white"
        />
    </svg>
);

//todo move to queries.js if needed
export const calculateTaxSum = ({ amount, rate, tax }) => ((amount * rate) / 100) * tax;

//todo move to queries.js if needed
export const calculateSubtotal = ({ amount, rate, tax }) => amount * rate + calculateTaxSum({ amount, rate, tax });

//todo move to queries.js if needed
export const calculateSubtotals = projects => projects.reduce((sum, { amount, rate }) => sum + amount * rate, 0);

//todo move to queries.js if needed
export const calculateTaxesSum = projects => projects.reduce((sum, project) => sum + calculateTaxSum(project), 0);

//todo move to queries.js if needed
export const calculateSubtotalsWithTax = projects =>
    projects.reduce((sum, project) => sum + calculateSubtotal(project), 0);

const parseUsersData = users => {
    return users.data.map(user => user.user[0]);
};

const emptyInvoice = {
    id: `${Date.now()}`,
    number: null,
    dateFrom: new Date(),
    dateDue: new Date(),
    currency: 'usd',
    sender: null,
    recipient: null,
    image: null,
    projects: [],
    comment: '',
};

class InvoicesPageDetailed extends Component {
    state = {
        isInitialFetching: true,
        invoice: emptyInvoice,
    };

    async componentDidMount() {
        setTimeout(() => this.setState({ isInitialFetching: false }), 500);
        const {
            getProjectsListActions,
            getCurrentTeamDetailedDataAction,
            getClientsAction,
            getInvoice,
            invoice,
            match: { params },
        } = this.props;

        if (this.isUpdateMode || this.isViewMode) {
            getInvoice(params['invoiceId']);
        }
        await getProjectsListActions();
        await getCurrentTeamDetailedDataAction();
        await getClientsAction();
    }

    static getDerivedStateFromProps(props, state) {
        const { invoice } = props;
        console.log({ invoice });

        const stateInvoice = state.invoice;
        if (!stateInvoice.id && invoice) {
            console.log({ props });
            return {
                invoice,
            };
        }

        return null;
    }

    componentWillUnmount() {
        this.setState({ invoice: emptyInvoice });
    }

    get isCreateMode() {
        return this.props.mode === 'create';
    }

    get isViewMode() {
        return this.props.mode === 'view';
    }

    get isUpdateMode() {
        return this.props.mode === 'update';
    }
    handleInputChange = (name, e) => {
        let value = e.target.value;
        const { invoice } = this.state;
        this.setState({ invoice: { ...invoice, [name]: value } });
    };

    handleUpdateProject = project => {
        let { invoice } = this.state;

        invoice.projects.forEach((p, i) => {
            if (p.id === project.id) {
                invoice.projects[i] = project;
            }
        });

        this.setState({ invoice });

        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    };

    handleAddProject = project => {
        let { invoice } = this.state;

        invoice.projects.push(project);
        this.setState({ invoice });

        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    };

    handleRemoveProject = id => {
        let { invoice } = this.state;
        invoice.projects = invoice.projects.filter(project => project.id !== id);
        this.setState({ invoice });
    };

    onChangeCurrency = currency => {
        let { invoice } = this.state;
        invoice.currency = currency;

        this.setState({ invoice });
    };

    handleDateChange = (name, value) => {
        let { invoice } = this.state;
        invoice[name] = value;
        this.setState({ invoice });
    };

    handlePersonChange = (name, value) => {
        let { invoice } = this.state;
        invoice[name] = value.id;
        this.setState({ invoice });
    };

    handleFileLoad = image => {
        const { invoice } = this.state;
        this.setState({ invoice: { ...invoice, image } });
    };

    handleFileDelete = () => {
        const { invoice } = this.state;
        this.setState({ invoice: { ...invoice, image: null } });
    };

    handleSaveAction = () => {
        const { invoice } = this.state;
        const { updateInvoice, addInvoice } = this.props;

        if (this.isUpdateMode) {
            updateInvoice(invoice);
        } else if (this.isCreateMode) {
            addInvoice({
                ...invoice,
                price: calculateSubtotalsWithTax(invoice.projects),
            });
        }

        this.goBack();
    };

    goBack = () => this.props.history.goBack();

    render() {
        const { vocabulary, mode, currentTeamDetailedData } = this.props;
        const {
            v_invoice,
            v_tax,
            v_subtotal,
            v_enter_number,
            v_invoice_summary,
            v_total,
            v_comments,
            v_save,
            v_cancel,
            v_invoice_number,
            v_invoice_date,
            v_invoice_due,
            v_edit,
            v_send,
            v_clone,
            v_delete,
            v_download,
            v_from,
            v_to,
            v_choose_sender,
            v_choose_recipient,
            v_select_logo_file,
        } = vocabulary;
        const { isInitialFetching, invoice } = this.state;

        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar>
                    <div
                        className={classNames('invoices-page-detailed', {
                            'invoices-page-detailed--horizontal-padding': this.isViewMode,
                        })}
                    >
                        <div
                            className={classNames('invoices-page-detailed__header', {
                                'invoices-page-detailed__header--no-horizontal-padding': this.isViewMode,
                            })}
                        >
                            {this.isViewMode && (
                                <div onClick={this.goBack} className="invoices-page-detailed__back-button">
                                    <ArrowLeftIcon />
                                </div>
                            )}
                            <div className="invoices-page-detailed__title">{v_invoice}</div>
                        </div>
                        <div className="invoices-page-detailed__top">
                            <div className="invoices-page-detailed__main-data">
                                <div className="invoices-page-detailed__left">
                                    <div
                                        className={classNames('invoices-page-detailed__logo', {
                                            'invoices-page-detailed__logo--empty': !invoice.image,
                                        })}
                                    >
                                        <ImagePicker
                                            onFileLoaded={this.handleFileLoad}
                                            onDeleteImage={this.handleFileDelete}
                                            placeholder={v_select_logo_file}
                                        />
                                    </div>
                                    <div className="invoices-page-detailed__main-data-form">
                                        <div>
                                            <label>{`${v_invoice_number}:`}</label>
                                            <input
                                                value={invoice.number}
                                                onChange={e => this.handleInputChange('number', e)}
                                                className="invoices-page-detailed__input"
                                                type="text"
                                                placeholder={v_enter_number}
                                                disabled={this.isViewMode}
                                            />
                                        </div>
                                        <div>
                                            <label>{`${v_invoice_date}:`}</label>
                                            <div className="invoices-page-detailed__calendar-select">
                                                <CalendarSelect
                                                    onChangeDate={date => this.handleDateChange('dateFrom', date)}
                                                    date={invoice.dateFrom}
                                                    disabled={this.isViewMode}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label>{`${v_invoice_due}:`}</label>
                                            <div className="invoices-page-detailed__calendar-select">
                                                <CalendarSelect
                                                    onChangeDate={date => this.handleDateChange('dateDue', date)}
                                                    date={invoice.dateDue}
                                                    disabled={this.isViewMode}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="invoices-page-detailed__tools">
                                    {this.isViewMode && (
                                        <div className="invoices-page-detailed__tools-container">
                                            <Link
                                                to={`/invoices/update/${invoice.id}`}
                                                className="invoices-page-detailed__tool-button"
                                            >
                                                <EditIcon className="invoices-page-detailed__icon-button" />
                                                <span>{v_edit}</span>
                                            </Link>
                                            <button className="invoices-page-detailed__tool-button">
                                                <SendIcon className="invoices-page-detailed__icon-button" />
                                                <span>{v_send}</span>
                                            </button>
                                            <button className="invoices-page-detailed__tool-button">
                                                <CopyIcon className="invoices-page-detailed__icon-button" />
                                                <span>{v_clone}</span>
                                            </button>
                                            <button className="invoices-page-detailed__tool-button">
                                                <DeleteIcon className="invoices-page-detailed__icon-button" />
                                                <span>{v_delete}</span>
                                            </button>
                                            <button className="invoices-page-detailed__tool-button">
                                                <SaveIcon className="invoices-page-detailed__icon-button" />
                                                <span>{v_download}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="invoices-page-detailed__personal-information">
                                <div className="invoices-page-detailed__personal-information-card">
                                    <div className="invoices-page-detailed__subtitle">{v_from}</div>
                                    <PersonSelect
                                        personsList={parseUsersData(currentTeamDetailedData)}
                                        selectedPersonId={invoice.sender}
                                        onChange={person => this.handlePersonChange('sender', person)}
                                        placeholder={v_choose_sender}
                                        disabled={this.isViewMode}
                                    />
                                </div>
                                <div className="invoices-page-detailed__personal-information-card">
                                    <div className="invoices-page-detailed__subtitle">{v_to}</div>
                                    <PersonSelect
                                        personsList={parseUsersData(currentTeamDetailedData)}
                                        selectedPersonId={invoice.recipient}
                                        onChange={person => this.handlePersonChange('recipient', person)}
                                        placeholder={v_choose_recipient}
                                        disabled={this.isViewMode}
                                    />
                                </div>
                            </div>
                        </div>

                        <DetailedInvoiceProjectsTable
                            mode={mode}
                            vocabulary={vocabulary}
                            projects={invoice.projects}
                            currency={invoice.currency}
                            updateProject={this.handleUpdateProject}
                            addProject={this.handleAddProject}
                            removeProject={this.handleRemoveProject}
                        />

                        <div className="invoices-page-detailed__summary">
                            <div className="invoices-page-detailed__subtitle">{v_invoice_summary}</div>
                            <div className="invoices-page-detailed__summary-table">
                                <div className="invoices-page-detailed__summary-table-row">
                                    <span className="invoices-page-detailed__summary-title">{v_subtotal}</span>
                                    <div>
                                        {invoice.currency.toUpperCase()}
                                        <span className="invoices-page-detailed__summary-price">
                                            {calculateSubtotals(invoice.projects)}
                                        </span>
                                    </div>
                                </div>
                                <div className="invoices-page-detailed__summary-table-row">
                                    <span className="invoices-page-detailed__summary-title">{v_tax}</span>
                                    <div>
                                        {invoice.currency.toUpperCase()}
                                        <span className="invoices-page-detailed__summary-price">
                                            {calculateTaxesSum(invoice.projects)}
                                        </span>
                                    </div>
                                </div>
                                <div className="invoices-page-detailed__summary-table-row">
                                    <div className="invoices-page-detailed__summary-total">
                                        <span className="invoices-page-detailed__summary-title">{v_total}</span>
                                        {/*<span className="invoices-page-detailed__summary-currency">*/}
                                        {/*    {invoice.currency.toUpperCase()}*/}
                                        {/*</span>*/}
                                        <CurrencySelect
                                            selectedCurrency={invoice.currency}
                                            onChange={this.onChangeCurrency}
                                        />
                                    </div>

                                    <div>
                                        {invoice.currency.toUpperCase()}
                                        <span className="invoices-page-detailed__summary-price">
                                            {calculateSubtotalsWithTax(invoice.projects)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="invoices-page-detailed__comments">
                            <div className="invoices-page-detailed__subtitle">{v_comments}</div>

                            <textarea
                                value={invoice.comment}
                                onChange={e => this.handleInputChange('comment', e)}
                                className="invoices-page-detailed__input invoices-page-detailed__textarea"
                                disabled={this.isViewMode}
                            />
                        </div>
                        {!this.isViewMode && (
                            <div className="invoices-page-detailed__actions">
                                <button
                                    onClick={this.handleSaveAction}
                                    className="invoices-page-detailed__action-button"
                                >
                                    {v_save}
                                </button>
                                <button onClick={this.goBack} className="invoices-page-detailed__action-button">
                                    {v_cancel.toLowerCase()}
                                </button>
                            </div>
                        )}
                    </div>
                </CustomScrollbar>
            </Loading>
        );
    }
}

InvoicesPageDetailed.propTypes = {
    mode: PropTypes.oneOf(['create', 'view', 'update']).isRequired,
};

const mapStateToProps = ({ teamReducer, clientsReducer, invoicesReducer }) => ({
    currentTeamDetailedData: teamReducer.currentTeamDetailedData,
    clientsList: clientsReducer.clientsList,
    invoice: invoicesReducer.invoice,
});

const mapDispatchToProps = {
    getProjectsListActions,
    getCurrentTeamDetailedDataAction,
    getClientsAction,
    getInvoice,
    updateInvoice,
    addInvoice,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InvoicesPageDetailed)
);
