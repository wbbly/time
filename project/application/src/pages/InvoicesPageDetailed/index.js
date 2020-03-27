import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Styles
import './style.scss';

//Components
import { Loading } from '../../components/Loading';
import { CopyIcon, DeleteIcon, EditIcon, SaveIcon, SendIcon } from '../../components/AllInvoicesList';
import CustomScrollbar from '../../components/CustomScrollbar';
import DetailedInvoiceProjectsTable from '../../components/DetailedInvoiceProjectsTable';
import classNames from 'classnames';

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

class InvoicesPageDetailed extends Component {
    state = {
        isInitialFetching: true,
        invoice: {
            number: null,
            dateFrom: null,
            dateTo: null,
            currency: 'usd',
            projects: [
                {
                    id: '1',
                    name: 'Zulu',
                    amount: 200,
                    rate: 100,
                    tax: 15,
                    currency: 'usd',
                },
                {
                    id: '2',
                    name: 'Ultra',
                    amount: 300,
                    rate: 20,
                    tax: 10,
                    currency: 'usd',
                },
            ],
        },
    };

    componentDidMount() {
        setTimeout(() => this.setState({ isInitialFetching: false }), 500);
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

    render() {
        const { vocabulary, mode } = this.props;
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
            v_pic_date,
        } = vocabulary;
        const { isInitialFetching, invoice } = this.state;
        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar>
                    <div className="invoices-page-detailed">
                        <div className="invoices-page-detailed__header">
                            <div className="invoices-page-detailed__back-button">
                                <ArrowLeftIcon />
                            </div>
                            <div className="invoices-page-detailed__title">{v_invoice}</div>
                        </div>
                        <div className="invoices-page-detailed__top">
                            <div className="invoices-page-detailed__main-data">
                                <div className="invoices-page-detailed__left">
                                    <div className="invoices-page-detailed__logo">LOGO</div>
                                    <div className="invoices-page-detailed__main-data-form">
                                        <div>
                                            <label>{`${v_invoice_number}:`}</label>
                                            <input
                                                className="invoices-page-detailed__input"
                                                type="text"
                                                placeholder={v_enter_number}
                                                disabled={this.isViewMode}
                                            />
                                        </div>
                                        <div>
                                            <label>{`${v_invoice_date}:`}</label>
                                            <input
                                                className="invoices-page-detailed__input"
                                                type="text"
                                                placeholder={v_pic_date}
                                                disabled={this.isViewMode}
                                            />
                                        </div>
                                        <div>
                                            <label>{`${v_invoice_due}:`}</label>
                                            <input
                                                className="invoices-page-detailed__input"
                                                type="text"
                                                placeholder={v_pic_date}
                                                disabled={this.isViewMode}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="invoices-page-detailed__tools">
                                    {this.isViewMode && (
                                        <div className="invoices-page-detailed__tools-container">
                                            <button className="invoices-page-detailed__tool-button">
                                                <EditIcon className="invoices-page-detailed__icon-button" />
                                                <span>{v_edit}</span>
                                            </button>
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
                                    <div
                                        className={classNames(
                                            'invoices-page-detailed__personal-information-card-body',
                                            { 'invoices-page-detailed--disabled': this.isViewMode }
                                        )}
                                    />
                                </div>
                                <div className="invoices-page-detailed__personal-information-card">
                                    <div className="invoices-page-detailed__subtitle">{v_to}</div>
                                    <div
                                        className={classNames(
                                            'invoices-page-detailed__personal-information-card-body',
                                            { 'invoices-page-detailed--disabled': this.isViewMode }
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <DetailedInvoiceProjectsTable mode={mode} vocabulary={vocabulary} projects={invoice.projects} />

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
                                    <span className="invoices-page-detailed__summary-title">
                                        {v_total}
                                        <span className="invoices-page-detailed__summary-currency">
                                            {invoice.currency.toUpperCase()}
                                        </span>
                                    </span>
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
                                className="invoices-page-detailed__input invoices-page-detailed__textarea"
                                disabled={this.isViewMode}
                            />
                        </div>
                        {!this.isViewMode && (
                            <div className="invoices-page-detailed__actions">
                                <button className="invoices-page-detailed__action-button">{v_save}</button>
                                <button className="invoices-page-detailed__action-button">
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

export default InvoicesPageDetailed;
