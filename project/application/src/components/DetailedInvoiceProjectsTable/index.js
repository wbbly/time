import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

//Styles
import './style.scss';

//Components
import { DeleteIcon, EditIcon } from '../InvoicePageComponents/AllInvoicesList';
import { calculateSubtotal } from '../../pages/InvoicesPageDetailed';
import ProjectsSelect from '../ProjectsSelect';
import { Loading } from '../Loading';

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

const emptyProject = {
    id: null,
    projectId: null,
    name: '',
    amount: '',
    rate: '',
    tax: '',
};

class DetailedInvoiceProjectsTable extends Component {
    state = {
        newProject: { ...emptyProject },
        editingProject: { ...emptyProject },
        isUpdating: false,
        isAdding: false,
    };

    get isViewMode() {
        return this.props.mode === 'view';
    }

    handleInputChange = (name, e) => {
        let value = e.target.value;
        const { newProject } = this.state;
        this.setState({ newProject: { ...newProject, [name]: value } });
    };

    onChangeProject = project => {
        const { newProject } = this.state;
        const { id, name } = project;
        this.setState({ newProject: { ...newProject, name, projectId: id } });
    };

    handleEditProject = (name, e) => {
        const { editingProject } = this.state;
        if (name === 'project') {
            const { name, id } = e;
            console.log(name, id);
            this.setState({ editingProject: { ...editingProject, name, projectId: id } });
            return this.finishEditing(true);
        }

        const value = e.target.value;

        this.setState({ editingProject: { ...editingProject, [name]: value } });
    };

    handleKeyDown = e => {
        if (e.keyCode === 13) {
            e.target.blur();
            this.finishEditing();
        }
    };

    initEditing = editingProject => {
        this.setState({ editingProject });
    };

    finishEditing = async (continueEditing = false) => {
        const { editingProject } = this.state;
        const { updateProject } = this.props;
        this.setState({ isUpdating: true });
        await updateProject(editingProject);
        this.setState({ isUpdating: false });

        if (!continueEditing) {
            this.setState({ editingProject: { ...emptyProject } });
        }
    };

    addProject = async () => {
        const { newProject } = this.state;
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
    };

    getProjectValue = (project, name) => {
        const { editingProject } = this.state;
        if (project.id === editingProject.id) {
            return editingProject[name];
        } else {
            if (name === 'tax') {
                return `+${project[name]}%`;
            }
            if (name === 'amount') {
                return project.amount ? project.amount : project.hours;
            }
            // TODO: Remove this hacks when project object in response invoice object will have
            // projectId, not only project_name. Or rework ProjectsSelect to work with project_name instead projectId
            if (project[name]) return project[name];
            return project.project_name;
            // -------------------------------------------------------------------------------------------------
        }
    };

    render() {
        const { newProject, editingProject, isUpdating, isAdding } = this.state;
        const { vocabulary, projects, currency } = this.props;
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
                        <div key={project.id} className="detailed-invoice-projects-table__row">
                            <Loading
                                mode="overlay"
                                flag={editingProject.id === project.id && isUpdating}
                                withLogo={false}
                            >
                                <div className="detailed-invoice-projects-table__project-column">
                                    <ProjectsSelect
                                        onChange={project => this.handleEditProject('project', project)}
                                        selectedProjectId={this.getProjectValue(project, 'projectId')}
                                        placeholder={v_enter_project}
                                        disabled={editingProject.id !== project.id}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__amount-column">
                                    <input
                                        value={this.getProjectValue(project, 'amount')}
                                        onChange={e => this.handleEditProject('amount', e)}
                                        className={classNames('detailed-invoice-projects-table__input', {
                                            'detailed-invoice-projects-table__input--disabled':
                                                editingProject.id !== project.id,
                                        })}
                                        type="number"
                                        placeholder={v_enter_number}
                                        disabled={editingProject.id !== project.id}
                                        onKeyDown={this.handleKeyDown}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__rate-column">
                                    <input
                                        value={this.getProjectValue(project, 'rate')}
                                        onChange={e => this.handleEditProject('rate', e)}
                                        className={classNames('detailed-invoice-projects-table__input', {
                                            'detailed-invoice-projects-table__input--disabled':
                                                editingProject.id !== project.id,
                                        })}
                                        type="number"
                                        placeholder={v_enter_number}
                                        disabled={editingProject.id !== project.id}
                                        onKeyDown={this.handleKeyDown}
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
                                        type={editingProject.id === project.id ? 'number' : 'text'}
                                        placeholder={v_enter_number}
                                        disabled={editingProject.id !== project.id}
                                        onKeyDown={this.handleKeyDown}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__subtotal-column">
                                    <span>{currency.toUpperCase()}</span>
                                    <span>
                                        {calculateSubtotal(editingProject.id === project.id ? editingProject : project)}
                                    </span>
                                </div>
                                {!this.isViewMode && (
                                    <div className="detailed-invoice-projects-table__tools-column">
                                        <EditIcon
                                            onClick={() =>
                                                editingProject.id === project.id
                                                    ? this.finishEditing()
                                                    : this.initEditing(project)
                                            }
                                            className="detailed-invoice-projects-table__icon-button"
                                        />
                                        <DeleteIcon
                                            onClick={() => this.removeProject(project.id)}
                                            className="detailed-invoice-projects-table__icon-button"
                                        />
                                    </div>
                                )}
                            </Loading>
                        </div>
                    ))}
                    {!this.isViewMode && (
                        <div className="detailed-invoice-projects-table__row">
                            <Loading mode="overlay" flag={isAdding} withLogo={false}>
                                <div className="detailed-invoice-projects-table__project-column">
                                    <ProjectsSelect
                                        onChange={this.onChangeProject}
                                        selectedProjectId={newProject.projectId}
                                        placeholder={v_enter_project}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__amount-column">
                                    <input
                                        value={newProject.amount}
                                        onChange={e => this.handleInputChange('amount', e)}
                                        className="detailed-invoice-projects-table__input"
                                        type="number"
                                        placeholder={v_enter_number}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__rate-column">
                                    <input
                                        value={newProject.rate}
                                        onChange={e => this.handleInputChange('rate', e)}
                                        className="detailed-invoice-projects-table__input"
                                        type="number"
                                        placeholder={v_pic_tax}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__tax-column">
                                    <input
                                        value={newProject.tax}
                                        onChange={e => this.handleInputChange('tax', e)}
                                        className="detailed-invoice-projects-table__input"
                                        type="number"
                                        placeholder={v_pic_tax}
                                    />
                                </div>
                                <div className="detailed-invoice-projects-table__subtotal-column">
                                    <span>{currency.toUpperCase()}</span>
                                    <span>{calculateSubtotal(newProject)}</span>
                                </div>
                                <div className="detailed-invoice-projects-table__tools-column">
                                    <PlusIcon
                                        onClick={this.addProject}
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
