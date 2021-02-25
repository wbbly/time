import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Services
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { checkIsAdminByRole, checkIsOwnerByRole } from '../../services/authentication';

// Components
import EditProjectModal from '../EditProjectModal/index';

// Actions

// Queries

// Config

// Styles
import './style.css';

const EditIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

class ProjectData extends Component {
    setEdiItem(item) {
        this.props.projectsPageAction('SET_EDIT_PROJECT', { tableData: item });
        this.props.projectsPageAction('TOGGLE_EDIT_PROJECT_MODAL', { tableData: true });
    }

    getClientFullName(client, listView = true) {
        const { company_name, name } = client;
        // returns 'Company (Client Name)' for list visualization, or 'company clientname' for search
        if (listView) {
            return company_name ? `${company_name}${name ? ` (${name})` : ''}` : name;
        } else {
            return (company_name ? `${company_name}${name ? ` ${name}` : ''}` : name).toLowerCase();
        }
    }

    render() {
        const { currentTeam, vocabulary, durationTimeFormat } = this.props;
        const { v_project_name, v_time, v_client } = vocabulary;

        const tableHeader = [
            {
                key: 1,
                value: v_project_name,
                className: 'table-project-name',
            },
            {
                key: 2,
                value: v_client,
                className: 'table-project-client',
            },
            {
                key: 3,
                value: v_time,
                className: 'table-project-time',
            },
        ];
        const tableInfoElements = this.props.tableInfo.map((item, index) => (
            <tr key={'table-header_' + index}>
                <td data-label={`${v_project_name}: `}>{item.name}</td>
                <td data-label={`${v_client}: `}>{item.client ? this.getClientFullName(item.client) : '-'}</td>
                <td data-label={`${v_time}: `}>
                    {getTimeDurationByGivenTimestamp(item.totalTime, durationTimeFormat)}
                    {(checkIsAdminByRole(currentTeam.data.role) || checkIsOwnerByRole(currentTeam.data.role)) && (
                        <EditIcon className="edit_button" onClick={e => this.setEdiItem(item)} />
                    )}
                </td>
            </tr>
        ));
        const tableHeaderElements = tableHeader.map((item, index) => (
            <th key={'table-info_' + index} className={item.className}>
                {item.value}
            </th>
        ));

        return (
            <div className="project_data_wrapper">
                {this.props.editProjectModal && (
                    <EditProjectModal
                        editedProject={this.props.editedProject}
                        projectsPageAction={this.props.projectsPageAction}
                        getProjects={this.props.getProjects}
                    />
                )}
                <table>
                    <thead>
                        <tr>{tableHeaderElements}</tr>
                    </thead>
                    <tbody>{tableInfoElements}</tbody>
                </table>
            </div>
        );
    }
}

ProjectData.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    currentTeam: state.teamReducer.currentTeam,
    vocabulary: state.languageReducer.vocabulary,
    durationTimeFormat: state.userReducer.durationTimeFormat,
});

export default connect(mapStateToProps)(ProjectData);
