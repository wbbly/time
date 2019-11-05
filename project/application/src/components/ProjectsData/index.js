import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Services
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { checkIsAdminByRole } from '../../services/authentication';

// Components
import EditProjectModal from '../EditProjectModal/index';

// Actions

// Queries

// Config

// Styles
import './style.css';

class ProjectData extends Component {
    setEdiItem(item) {
        this.props.projectsPageAction('SET_EDIT_PROJECT', { tableData: item });
        this.props.projectsPageAction('TOGGLE_EDIT_PROJECT_MODAL', { tableData: true });
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
                <td data-label={`${v_client}: `}>{item.client ? item.client.name : '-'}</td>
                <td data-label={`${v_time}: `}>
                    {getTimeDurationByGivenTimestamp(item.totalTime, durationTimeFormat)}
                    {checkIsAdminByRole(currentTeam.data.role) && (
                        <i className="edit_button" onClick={e => this.setEdiItem(item)} />
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
