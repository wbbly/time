import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

import { getInvoiceViewDataThunk } from '../../actions/InvoicesActions';
import { AppConfig } from '../../config';
import { spaceAndFixNumber, fixNumberHundredths, internationalFormatNum } from '../../services/numberHelpers';
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
import { connect } from 'react-redux';
import CurrencySelect from '../../components/CurrencySelect';
import CalendarSelect from '../../components/CalendarSelect';
import PersonSelect from '../../components/PersonSelect';
import ImagePicker from '../../components/ImagePicker';
import SendInvoiceModal from '../../components/InvoicePageComponents/SendInvoiceModal';
import { downloadPDF } from '../../services/downloadPDF';
import { downloadInvoicePDF } from '../../configAPI';

//todo move to queries.js if needed
export const calculateTaxSum = ({ amount, rate, tax, hours }) => (((amount || hours) * rate) / 100) * tax;

//todo move to queries.js if needed
export const calculateSubtotal = ({ amount, rate, tax, hours }) =>
    (amount || hours) * rate + calculateTaxSum({ amount, rate, tax, hours }) || 0;
export const calculateSubtotalWithoutTax = ({ amount, rate, tax, hours }) => {
    return spaceAndFixNumber((amount || hours) * rate);
};
//todo move to queries.js if needed
export const calculateSubtotals = projects =>
    projects.reduce((sum, { amount, rate, hours }) => sum + (amount || hours) * rate, 0) || 0;

//todo move to queries.js if needed
export const calculateTaxesSum = projects => projects.reduce((sum, project) => sum + calculateTaxSum(project), 0) || 0;

//todo move to queries.js if needed
export const calculateSubtotalsWithTax = projects =>
    projects.reduce((sum, project) => sum + calculateSubtotal(project), 0);

const parseUsersData = users => {
    return users.data.map(user => user.user[0]);
};

class InvoiceViewPage extends Component {
    state = {
        isInitialFetching: true,
        invoice: {
            id: ``,
            number: '',
            dateFrom: new Date(),
            dateDue: new Date(),
            timezoneOffset: new Date().getTimezoneOffset() * 60 * 1000,
            currency: 'usd',
            sender: {
                city: '',
                company_name: '',
                country: '',
                email: '',
                id: '',
                language: '',
                phone: '',
                state: '',
                zip: '',
            },
            recipient: null,
            image: null,
            projects: [],
            comment: '',
            removeFile: false,
        },
        errors: {
            sender: false,
            recipient: false,
            projects: false,
            hours: false,
        },
        sendInvoiceModalData: false,
    };

    async componentDidMount() {
        setTimeout(() => this.setState({ isInitialFetching: false }), 500);
        const { getInvoiceViewDataThunk } = this.props;

        let invoiceId = this.props.match.params.invoiceId;

        await getInvoiceViewDataThunk(invoiceId);

        this.setState({ invoice: this.props.invoice }, () => {
            console.log(this.state.invoice);
        });
    }

    get isViewMode() {
        var paramsString = '?token=c873efc0-0993-4dad-89f1-4e14a240e4c6';
        var searchParams = new URLSearchParams(paramsString);
        const token = searchParams.get('token');
        return token;
    }

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

    handleFileLoad = image => {
        const { invoice } = this.state;
        this.setState({ invoice: { ...invoice, image } });
    };

    handleFileDelete = () => {
        const { invoice } = this.state;
        this.setState({ invoice: { ...invoice, image: null, removeFile: true } });
    };

    render() {
        const { vocabulary, currentTeamDetailedData, clientsList, isFetching, showNotificationAction } = this.props;
        const {
            v_invoice,
            v_tax,
            v_subtotal,
            v_invoice_summary,
            v_total,
            v_comments,
            v_save,
            v_cancel,
            v_invoice_number,
            v_invoice_date,
            v_invoice_due,
            v_from,
            v_to,
            v_add_client,
            v_select_logo_file,
            v_will_generate,
        } = vocabulary;
        const { isInitialFetching, invoice, errors } = this.state;

        return (
            <Loading flag={isInitialFetching || isFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar disableTimeEntriesFetch>
                    <div className="invoices-page-detailed-wrapper">
                        <div className={classNames('invoices-page-detailed-wrapper__header', {})}>
                            {!this.isViewMode && (
                                <div
                                    onClick={() => this.props.history.push('/invoices')}
                                    className="invoices-page-detailed__back-button"
                                />
                            )}
                            <div className="invoices-page-detailed__title">{v_invoice}</div>
                        </div>
                        <div className="invoices-page-detailed-form-wrapper">
                            <div
                                className={classNames('invoices-page-detailed', {
                                    'invoices-page-detailed--horizontal-padding': this.isViewMode,
                                })}
                            >
                                <div className="invoices-page-detailed__top">
                                    <div className="invoices-page-detailed__main-data">
                                        <div className="invoices-page-detailed__left">
                                            <div
                                                className={classNames('invoices-page-detailed__logo', {
                                                    'invoices-page-detailed__logo--empty': !invoice.logo,
                                                })}
                                            >
                                                <ImagePicker
                                                    onDeleteImage={this.handleFileDelete}
                                                    onFileLoaded={this.handleFileLoad}
                                                    placeholder={v_select_logo_file}
                                                    imageUrl={
                                                        invoice.logo ? `${AppConfig.apiURL}${invoice.logo}` : null
                                                    }
                                                    isViewMode={this.isViewMode}
                                                    disabled={false}
                                                />
                                            </div>
                                            <div className="invoices-page-detailed__main-data-form">
                                                <div className="input-wrapper">
                                                    <div>
                                                        <label>{`${v_invoice_number}:`}</label>
                                                        <input
                                                            value={
                                                                invoice.invoice_number && `#${invoice.invoice_number}`
                                                            }
                                                            onChange={e => this.handleInputChange('number', e)}
                                                            className="invoices-page-detailed__input"
                                                            type="text"
                                                            placeholder={v_will_generate}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="input-wrapper__second-input">
                                                        <label>{`${v_invoice_due}:`}</label>
                                                        <div className="invoices-page-detailed__calendar-select">
                                                            <CalendarSelect
                                                                onChangeDate={date =>
                                                                    this.handleDateChange('dateDue', date)
                                                                }
                                                                date={invoice.dateDue}
                                                                disabled={this.isViewMode}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="second-input-wrapper">
                                                    <label>{`${v_invoice_date}:`}</label>
                                                    <div className="invoices-page-detailed__calendar-select">
                                                        <CalendarSelect
                                                            onChangeDate={date =>
                                                                this.handleDateChange('dateFrom', date)
                                                            }
                                                            date={invoice.dateFrom}
                                                            disabled={this.isViewMode}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="invoices-page-detailed__personal-information">
                                        <div className="invoices-page-detailed__personal-information-card">
                                            <div className="invoices-page-detailed__subtitle">{v_from}</div>
                                            <PersonSelect
                                                personsList={parseUsersData(currentTeamDetailedData)}
                                                invoice={invoice}
                                                userSender={invoice.invoice_vendor}
                                                onChange={person => {
                                                    this.setState(prevState => ({
                                                        ...prevState,
                                                        errors: {
                                                            ...prevState.errors,
                                                            sender: false,
                                                        },
                                                    }));
                                                    this.handlePersonChange('sender', person);
                                                }}
                                                disabled={this.isViewMode}
                                                isErrorSender={errors.sender}
                                            />
                                        </div>
                                        <div className="invoices-page-detailed__personal-information-card">
                                            <div className="invoices-page-detailed__subtitle">{v_to}</div>
                                            <PersonSelect
                                                personsList={clientsList}
                                                selectedRecipient={invoice.recipient || invoice.to}
                                                onChange={person => {
                                                    this.setState(prevState => ({
                                                        ...prevState,
                                                        errors: {
                                                            ...prevState.errors,
                                                            recipient: false,
                                                        },
                                                    }));
                                                    this.handlePersonChange('recipient', person);
                                                }}
                                                placeholder={v_add_client}
                                                disabled={this.isViewMode}
                                                isError={errors.recipient}
                                                withAddLink
                                            />
                                        </div>
                                    </div>
                                </div>

                                <DetailedInvoiceProjectsTable
                                    mode={'view'}
                                    vocabulary={vocabulary}
                                    projects={invoice.projects}
                                    currency={invoice.currency}
                                    updateProject={this.handleUpdateProject}
                                    addProject={this.handleAddProject}
                                    removeProject={this.handleRemoveProject}
                                    onChangeInput={() => {
                                        this.setState(prevState => ({
                                            ...prevState,
                                            errors: {
                                                ...prevState.errors,
                                                projects: false,
                                            },
                                        }));
                                    }}
                                    isError={errors.projects}
                                />
                                <div className="invoices-page-detailed__wrapper">
                                    <div className="invoices-page-detailed__wrapper-summary">
                                        <div className="invoices-page-detailed__subtitle">{v_invoice_summary}</div>
                                        <div className="invoices-page-detailed__summary-table">
                                            <div className="invoices-page-detailed__summary-table-row">
                                                <span className="invoices-page-detailed__summary-title">
                                                    {v_subtotal}
                                                </span>
                                                <div className="invoices-page-detailed__summary-price">
                                                    <div>{invoice.currency.toUpperCase()}</div>
                                                    <span>
                                                        {internationalFormatNum(
                                                            fixNumberHundredths(
                                                                spaceAndFixNumber(calculateSubtotals(invoice.projects))
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="invoices-page-detailed__summary-table-row">
                                                <span className="invoices-page-detailed__summary-title">{v_tax}</span>
                                                <div className="invoices-page-detailed__summary-price">
                                                    {invoice.currency.toUpperCase()}
                                                    <span>
                                                        {internationalFormatNum(
                                                            fixNumberHundredths(
                                                                spaceAndFixNumber(calculateTaxesSum(invoice.projects))
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="invoices-page-detailed__summary-table-row">
                                                <div className="invoices-page-detailed__summary-total">
                                                    <span className="invoices-page-detailed__summary-title">
                                                        {v_total}
                                                    </span>
                                                    <CurrencySelect
                                                        selectedCurrency={invoice.currency}
                                                        onChange={this.onChangeCurrency}
                                                        isViewMode={this.isViewMode}
                                                    />
                                                </div>

                                                <div className="invoices-page-detailed__summary-price">
                                                    {invoice.currency.toUpperCase()}
                                                    <span>
                                                        {internationalFormatNum(
                                                            fixNumberHundredths(
                                                                spaceAndFixNumber(
                                                                    calculateSubtotalsWithTax(invoice.projects)
                                                                )
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="invoices-page-detailed__comments">
                                    <div className="invoices-page-detailed__subtitle">{v_comments}</div>

                                    <TextareaAutosize
                                        value={invoice.comment || ''}
                                        onChange={e => this.handleInputChange('comment', e)}
                                        className="invoices-page-detailed__input invoices-page-detailed__textarea"
                                        disabled={this.isViewMode}
                                    />
                                </div>
                                {this.state.sendInvoiceModalData && (
                                    <SendInvoiceModal
                                        closeModal={this.toggleSendInvoiceModal}
                                        vocabulary={vocabulary}
                                        invoice={this.props.invoice}
                                    />
                                )}
                                {!this.isViewMode && (
                                    <div className="invoices-page-detailed__actions">
                                        <button
                                            onClick={this.handleSaveAction}
                                            className="invoices-page-detailed__action-button"
                                        >
                                            {v_save}
                                        </button>
                                        <button onClick={this.goBack} className="invoices-page-detailed__action-button">
                                            {v_cancel}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="invoices-page-detailed__tools">
                                <div className="invoices-page-detailed__tools-container">
                                    <button className="invoices-page-detailed__tool-button">
                                        <SaveIcon
                                            className="invoices-page-detailed__icon-button"
                                            onClick={async () => {
                                                try {
                                                    let responce = await downloadInvoicePDF(invoice.id);
                                                    downloadPDF(responce.data, `invoice-${invoice.invoice_number}.pdf`);
                                                } catch (error) {
                                                    console.log(error);
                                                    showNotificationAction({
                                                        type: 'error',
                                                        text: error.message,
                                                    });
                                                }
                                            }}
                                        />
                                    </button>
                                </div>
                                {!this.isViewMode && (
                                    <div className="invoices-page-detailed__tools-container">
                                        <Link
                                            to={`/invoices/update/${invoice.id}`}
                                            className="invoices-page-detailed__tool-button"
                                        >
                                            <EditIcon className="invoices-page-detailed__icon-button" />
                                        </Link>
                                        <button className="invoices-page-detailed__tool-button">
                                            <SendIcon
                                                className="invoices-page-detailed__icon-button"
                                                onClick={() => {
                                                    this.setState({ sendInvoiceModalData: true });
                                                }}
                                            />
                                        </button>
                                        <button
                                            className="invoices-page-detailed__tool-button"
                                            onClick={() => this.handleCloneInvoice()}
                                        >
                                            <CopyIcon className="invoices-page-detailed__icon-button" />
                                        </button>
                                        <button
                                            className="invoices-page-detailed__tool-button"
                                            onClick={this.handleDeleteInvoice}
                                        >
                                            <DeleteIcon className="invoices-page-detailed__icon-button" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CustomScrollbar>
            </Loading>
        );
    }
}

const mapStateToProps = ({ teamReducer, clientsReducer, invoicesReducer, userReducer }) => ({
    currentTeamDetailedData: teamReducer.currentTeamDetailedData,
    clientsList: clientsReducer.clientsList,
    invoice: invoicesReducer.invoice,
    isFetching: invoicesReducer.isFetching,
});

const mapDispatchToProps = {
    getInvoiceViewDataThunk,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InvoiceViewPage)
);
