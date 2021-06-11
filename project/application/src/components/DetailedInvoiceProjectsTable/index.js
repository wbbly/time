import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';

import {
    spaceAndFixNumber,
    fixNumberHundredths,
    fixNumberHundredthsLimits8,
    fixNumberHundredthsLimits10,
    internationalFormatNum,
} from '../../services/numberHelpers';

//Styles
import './style.scss';

//Components
import { DeleteIcon, EditIcon, SaveInvoice } from '../InvoicePageComponents/AllInvoicesList';
import { calculateSubtotalWithoutTax } from '../../pages/InvoicesPageDetailed';
import { Loading } from '../Loading';

export const PlusIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M10 4.16602V15.8327" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.16602 10H15.8327" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const emptyProject = {
    id: null,
    projectId: null,
    project_name: '',
    name: '',
    hours: '',
    rate: '',
    tax: '',
};

class DetailedInvoiceProjectsTable extends Component {
    state = {
        newProject: { ...emptyProject },
        editingProject: { ...emptyProject },
        isUpdating: false,
        isAdding: false,
        projectNameError: false,
        isHoursError: false,
        isRateError: false,
        projectNameEditingError: false,
    };

    get isViewMode() {
        return this.props.mode === 'view';
    }

    handleInputChange = (name, e) => {
        this.setState({ projectNameError: false, isHoursError: false, isRateError: false });
        let value = '';
        let isPositiveNumber = e.target.value > -1;
        let isTaxLess30 = e.target.value <= 30 && name === 'tax';
        if (isPositiveNumber && name !== 'tax' && name !== 'project_name') {
            if (name === 'hours') {
                value = fixNumberHundredthsLimits8(+e.target.value);
            } else {
                value = fixNumberHundredthsLimits10(+e.target.value);
            }
        } else if (isTaxLess30 && isPositiveNumber) {
            value = fixNumberHundredthsLimits10(+e.target.value);
        } else if (name === 'project_name') {
            // if (e.target.value.length < 30) {
            value = e.target.value;
            // }
        }
        const { newProject } = this.state;
        this.setState({ newProject: { ...newProject, [name]: value } });
        this.props.onChangeInput();
    };

    onChangeProject = project => {
        const { newProject } = this.state;
        const { id, name } = project;
        this.setState({ newProject: { ...newProject, name, projectId: id } });
    };

    handleEditProject = (name, e) => {
        const { editingProject } = this.state;
        let value = '';
        let isPositiveNumber = e.target.value > -1;
        let isTaxLess30 = e.target.value <= 30 && name === 'tax';
        if (isPositiveNumber && name !== 'tax' && name !== 'project_name') {
            if (name === 'hours') {
                value = fixNumberHundredthsLimits8(+e.target.value);
            } else {
                value = fixNumberHundredthsLimits10(+e.target.value);
            }
        } else if (isTaxLess30 && isPositiveNumber) {
            value = fixNumberHundredthsLimits10(+e.target.value);
        } else if (name === 'project_name') {
            console.log('clear');
            // if (e.target.value.length < 30) {
            value = e.target.value;
            // }
        }

        this.setState({ editingProject: { ...editingProject, [name]: value } });
    };

    initEditing = editingProject => {
        this.setState({ editingProject });
    };

    finishEditing = async (continueEditing = false) => {
        const { editingProject } = this.state;
        // eslint-disable-next-line
        if (editingProject.tax == 0) {
            editingProject.tax = '';
        }
        const { updateProject } = this.props;
        this.setState({ isUpdating: true });
        await updateProject(editingProject);
        this.setState({ isUpdating: false });

        if (!continueEditing) {
            this.setState({ editingProject: { ...emptyProject } });
        }
    };

    addProject = async () => {
        this.props.onChangeInput();
        const { newProject } = this.state;
        // eslint-disable-next-line
        if (newProject.tax == 0) {
            newProject.tax = '';
        }
        const { addProject } = this.props;
        this.setState({ isAdding: true });

        if (!newProject.projectId) {
            newProject.projectId = 'no-project';
        }

        // await this.props.addProject(newProject);
        await addProject({ ...newProject, id: `${Date.now()}` });
        this.setState({ newProject: { ...emptyProject }, isAdding: false });
    };

    removeProject = id => {
        const { removeProject } = this.props;
        removeProject(id);
        this.setState({ editingProject: { ...emptyProject } });
    };

    getProjectValue = (project, name) => {
        const { editingProject } = this.state;
        if (project.id === editingProject.id) {
            return editingProject[name];
        } else {
            if (name === 'tax') {
                return !!project[name] ? `+${project[name]}%` : '';
            }
            if (name === 'rate') {
                return !!+project.rate ? project.rate : '';
            }

            return project[name];
        }
    };
    onChangeProject = projectName => {
        let { newProject } = this.state;
        newProject.project_name = projectName;
        this.setState({ newProject });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.reset !== this.props.reset && this.props.reset) {
            this.setState({ editingProject: { ...emptyProject } });
        }
    }
    render() {
        const {
            newProject,
            editingProject,
            isUpdating,
            isAdding,
            projectNameError,
            isHoursError,
            isRateError,
        } = this.state;
        const { vocabulary, projects, currency, isError } = this.props;
        const {
            v_description,
            v_amount,
            v_rate,
            v_tax,
            v_subtotal,
            v_enter_project,
            v_enter_number,
            v_pic_tax,
        } = vocabulary;
        return (
            <div
                className={classNames('detailed-invoice-projects-table', {
                    'detailed-invoice-projects-table--empty': isError,
                })}
            >
                <div className="detailed-invoice-projects-table__header">
                    <div className="detailed-invoice-projects-table__project-column">
                        <span>{v_description}</span>
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
                    <div className="detailed-invoice-projects-table__tools-column" />
                </div>
                <div className="detailed-invoice-projects-table__body">
                    {projects.map(project => (
                        <div key={project.id} className="detailed-invoice-projects-table__row">
                            <Loading
                                mode="overlay"
                                flag={editingProject.id === project.id && isUpdating}
                                withLogo={false}
                            >
                                <div className="detailed-invoice-projects-table__project-column">
                                    <TextareaAutosize
                                        value={this.getProjectValue(project, 'project_name')}
                                        onChange={e => this.handleEditProject('project_name', e)}
                                        className={classNames('detailed-invoice-projects-table__textarea', {
                                            'detailed-invoice-projects-table__textarea--disabled':
                                                editingProject.id !== project.id,
                                            'detailed-invoice-projects-table__textarea--empty': !this.getProjectValue(
                                                project,
                                                'project_name'
                                            ),
                                        })}
                                        placeholder={v_enter_project}
                                        disabled={editingProject.id !== project.id}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__amount-column">
                                    <input
                                        value={this.getProjectValue(project, 'hours')}
                                        onChange={e => this.handleEditProject('hours', e)}
                                        className={classNames('detailed-invoice-projects-table__input', {
                                            'detailed-invoice-projects-table__input--disabled':
                                                editingProject.id !== project.id,
                                            'detailed-invoice-projects-table__input--empty':
                                                // eslint-disable-next-line
                                                this.getProjectValue(project, 'hours') == 0,
                                        })}
                                        type="text"
                                        onInput={event => {
                                            event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        placeholder={v_enter_number}
                                        disabled={editingProject.id !== project.id}
                                        // onKeyDown={this.handleKeyDown}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__rate-column">
                                    <input
                                        value={this.getProjectValue(project, 'rate')}
                                        onChange={e => this.handleEditProject('rate', e)}
                                        className={classNames('detailed-invoice-projects-table__input', {
                                            'detailed-invoice-projects-table__input--disabled':
                                                editingProject.id !== project.id,
                                            'detailed-invoice-projects-table__input--empty':
                                                // eslint-disable-next-line
                                                this.getProjectValue(project, 'rate') == 0,
                                        })}
                                        type="text"
                                        onInput={event => {
                                            event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        placeholder={editingProject.id !== project.id ? '' : v_enter_number}
                                        disabled={editingProject.id !== project.id}
                                        // onKeyDown={this.handleKeyDown}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__tax-column">
                                    <input
                                        value={this.getProjectValue(project, 'tax')}
                                        onChange={e => this.handleEditProject('tax', e)}
                                        className={classNames('detailed-invoice-projects-table__input', {
                                            'detailed-invoice-projects-table__input--disabled':
                                                editingProject.id !== project.id,
                                        })}
                                        // type={editingProject.id === project.id ? 'number' : 'text'}
                                        type="text"
                                        onInput={event => {
                                            if (editingProject.id === project.id) {
                                                event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                            }
                                        }}
                                        placeholder={editingProject.id !== project.id ? '' : v_enter_number}
                                        disabled={editingProject.id !== project.id}
                                        // onKeyDown={this.handleKeyDown}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__subtotal-column">
                                    <span>{currency.toUpperCase()}</span>
                                    <span>
                                        {internationalFormatNum(
                                            fixNumberHundredths(
                                                spaceAndFixNumber(
                                                    calculateSubtotalWithoutTax(
                                                        editingProject.id === project.id ? editingProject : project
                                                    )
                                                )
                                            )
                                        )}
                                    </span>
                                </div>
                                {!this.isViewMode && (
                                    <div className="detailed-invoice-projects-table__tools-column">
                                        <div>
                                            {editingProject.id === project.id ? (
                                                <SaveInvoice
                                                    onClick={() => {
                                                        const isProjectName = editingProject.project_name.length > 0;
                                                        const isHours = editingProject.hours > 0;
                                                        const isRate = editingProject.rate > 0;
                                                        if (isProjectName && isHours && isRate) {
                                                            this.finishEditing();
                                                        }
                                                    }}
                                                    className="detailed-invoice-projects-table__icon-button"
                                                />
                                            ) : (
                                                <EditIcon
                                                    onClick={async () => {
                                                        const isProjectName = editingProject.project_name.length > 0;
                                                        const isHours = editingProject.hours > 0;
                                                        const isRate = editingProject.rate > 0;
                                                        if (isProjectName && isHours && isRate) {
                                                            await this.finishEditing();
                                                        }
                                                        this.initEditing(project);
                                                    }}
                                                    className="detailed-invoice-projects-table__icon-button"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <DeleteIcon
                                                onClick={() => this.removeProject(project.id)}
                                                className="detailed-invoice-projects-table__icon-button"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Loading>
                        </div>
                    ))}
                    {!this.isViewMode &&
                        !editingProject.id && (
                            <div className="detailed-invoice-projects-table__row">
                                <Loading mode="overlay" flag={isAdding} withLogo={false}>
                                    <div className="detailed-invoice-projects-table__project-column">
                                        <TextareaAutosize
                                            value={newProject.project_name}
                                            onChange={e => this.handleInputChange('project_name', e)}
                                            className={classNames('detailed-invoice-projects-table__textarea', {
                                                'detailed-invoice-projects-table__textarea--empty': projectNameError,
                                            })}
                                            placeholder={v_enter_project}
                                        />
                                    </div>
                                    <div className="detailed-invoice-projects-table__amount-column">
                                        <input
                                            value={newProject.hours}
                                            onChange={e => {
                                                this.handleInputChange('hours', e);
                                            }}
                                            className={classNames('detailed-invoice-projects-table__input', {
                                                'detailed-invoice-projects-table__input--empty': isHoursError,
                                            })}
                                            type="text"
                                            onInput={event => {
                                                event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                            }}
                                            placeholder={v_enter_number}
                                        />
                                    </div>
                                    <div className="detailed-invoice-projects-table__rate-column">
                                        <input
                                            value={newProject.rate}
                                            onChange={e => this.handleInputChange('rate', e)}
                                            className={classNames('detailed-invoice-projects-table__input', {
                                                'detailed-invoice-projects-table__input--empty': isRateError,
                                            })}
                                            type="text"
                                            onInput={event => {
                                                event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                            }}
                                            placeholder={v_enter_number}
                                        />
                                    </div>
                                    <div className="detailed-invoice-projects-table__tax-column">
                                        <input
                                            value={newProject.tax}
                                            onChange={e => this.handleInputChange('tax', e)}
                                            className="detailed-invoice-projects-table__input"
                                            type="text"
                                            onInput={event => {
                                                event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                            }}
                                            placeholder={v_pic_tax}
                                        />
                                    </div>
                                    <div className="detailed-invoice-projects-table__subtotal-column">
                                        <span className="detailed-invoice-projects-table__subtotal-column-currency">
                                            {currency.toUpperCase()}
                                        </span>
                                        <span className="detailed-invoice-projects-table__subtotal-column-price">
                                            {internationalFormatNum(
                                                fixNumberHundredths(calculateSubtotalWithoutTax(newProject))
                                            )}
                                        </span>
                                    </div>
                                    <div className="detailed-invoice-projects-table__tools-column">
                                        <PlusIcon
                                            onClick={() => {
                                                const isProjectName =
                                                    newProject.project_name.length > 0 ||
                                                    editingProject.project_name.length > 0;
                                                const isHours = newProject.hours > 0;
                                                const isRate = newProject.rate > 0;
                                                if (isProjectName && isHours && isRate) {
                                                    this.addProject();
                                                } else {
                                                    if (!isProjectName) {
                                                        this.setState({ projectNameError: true });
                                                    }
                                                    if (!isHours) {
                                                        this.setState({ isHoursError: true });
                                                    }
                                                    if (!isRate) {
                                                        this.setState({ isRateError: true });
                                                    }
                                                }
                                            }}
                                            className="detailed-invoice-projects-table__icon-button"
                                        />
                                    </div>
                                </Loading>
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
    currency: PropTypes.string.isRequired,
    updateProject: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired,
    removeProject: PropTypes.func.isRequired,
};

export default DetailedInvoiceProjectsTable;
