import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Styles
import './style.scss';
import { DeleteIcon, EditIcon } from '../AllInvoicesList';
import { calculateSubtotal } from '../../pages/InvoicesPageDetailed';

const PlusIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white" />
    </svg>
);

class DetailedInvoiceProjectsTable extends Component {
    state = {
        newProject: {
            name: '',
            amount: 0,
            rate: 0,
            tax: 0,
            currency: 'usd',
        },
    };

    get isViewMode() {
        return this.props.mode === 'view';
    }

    render() {
        const { newProject } = this.state;
        const { vocabulary, projects } = this.props;
        const {
            v_project,
            v_amount,
            v_rate,
            v_tax,
            v_subtotal,
            v_enter_project,
            v_enter_number,
            v_pic_tax,
        } = vocabulary;
        return (
            <div className="detailed-invoice-projects-table">
                <div className="detailed-invoice-projects-table__header">
                    <div className="detailed-invoice-projects-table__project-column">
                        <span>{v_project}</span>
                    </div>
                    <div className="detailed-invoice-projects-table__amount-column">
                        <span>{v_amount}</span>
                    </div>
                    <div className="detailed-invoice-projects-table__rate-column">
                        <span>{v_rate}</span>
                    </div>
                    <div className="detailed-invoice-projects-table__tax-column">
                        <span>{v_tax}</span>
                    </div>
                    <div className="detailed-invoice-projects-table__subtotal-column">
                        <span>{v_subtotal}</span>
                    </div>
                    {!this.isViewMode && <div className="detailed-invoice-projects-table__tools-column" />}
                </div>
                <div className="detailed-invoice-projects-table__body">
                    {projects.map(project => (
                        <div className="detailed-invoice-projects-table__row">
                            <div className="detailed-invoice-projects-table__project-column">
                                <span>{project.name}</span>
                            </div>
                            <div className="detailed-invoice-projects-table__amount-column">
                                <span>{project.amount}</span>
                            </div>
                            <div className="detailed-invoice-projects-table__rate-column">
                                <span>{project.rate}</span>
                            </div>
                            <div className="detailed-invoice-projects-table__tax-column">
                                <span>{`+${project.tax}%`}</span>
                            </div>
                            <div className="detailed-invoice-projects-table__subtotal-column">
                                <span>{project.currency.toUpperCase()}</span>
                                <span>{calculateSubtotal(project)}</span>
                            </div>
                            {!this.isViewMode && (
                                <div className="detailed-invoice-projects-table__tools-column">
                                    <EditIcon className="detailed-invoice-projects-table__icon-button" />
                                    <DeleteIcon className="detailed-invoice-projects-table__icon-button" />
                                </div>
                            )}
                        </div>
                    ))}
                    {!this.isViewMode && (
                        <div className="detailed-invoice-projects-table__row">
                            <div className="detailed-invoice-projects-table__project-column">
                                <input
                                    className="detailed-invoice-projects-table__input"
                                    type="text"
                                    placeholder={v_enter_project}
                                />
                            </div>
                            <div className="detailed-invoice-projects-table__amount-column">
                                <input
                                    className="detailed-invoice-projects-table__input"
                                    type="number"
                                    placeholder={v_enter_number}
                                />
                            </div>
                            <div className="detailed-invoice-projects-table__rate-column">
                                <input
                                    className="detailed-invoice-projects-table__input"
                                    type="number"
                                    placeholder={v_pic_tax}
                                />
                            </div>
                            <div className="detailed-invoice-projects-table__tax-column">
                                <input
                                    className="detailed-invoice-projects-table__input"
                                    type="number"
                                    placeholder={v_pic_tax}
                                />
                            </div>
                            <div className="detailed-invoice-projects-table__subtotal-column">
                                <span>{newProject.currency.toUpperCase()}</span>
                                <span>{calculateSubtotal(newProject)}</span>
                            </div>
                            <div className="detailed-invoice-projects-table__tools-column">
                                <PlusIcon className="detailed-invoice-projects-table__icon-button" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

DetailedInvoiceProjectsTable.propTypes = {
    mode: PropTypes.oneOf(['create', 'view', 'update']).isRequired,
    vocabulary: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
};

export default DetailedInvoiceProjectsTable;
