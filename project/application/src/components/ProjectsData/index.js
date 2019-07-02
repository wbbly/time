import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Services
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { checkIsAdmin } from '../../services/authentication';
import { Trans } from 'react-i18next';

// Components
import EditProjectModal from '../EditProjectModal/index';

// Actions

// Queries

// Config

// Styles
import './style.css';

export default class ProjectData extends Component {
    setEdiItem(item) {
        this.props.projectsPageAction('SET_EDIT_PROJECT', { tableData: item });
        this.props.projectsPageAction('TOGGLE_EDIT_PROJECT_MODAL', { tableData: true });
    }

    render() {
        const tableHeader = [
            {
                key: 1,
                value: 'Project_name',
            },
            {
                key: 2,
                value: 'Time',
            },
        ];
        const tableInfoElements = this.props.tableInfo.map((item, index) => (
            <tr key={'table-header_' + index}>
                <td>{item.name}</td>
                <td>
                    {getTimeDurationByGivenTimestamp(item.totalTime)}
                    {checkIsAdmin() && <i className="edit_button" onClick={e => this.setEdiItem(item)} />}
                </td>
            </tr>
        ));
        const tableHeaderElements = tableHeader.map((item, index) => (
            <th key={'table-info_' + index}>
                <Trans i18nKey={item.value}>{item.value}</Trans>
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
