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
        const { currentTeam } = this.props;

        const tableHeader = [
            {
                key: 1,
                value: 'Project name',
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
                    {checkIsAdminByRole(currentTeam.data.role) && (
                        <i className="edit_button" onClick={e => this.setEdiItem(item)} />
                    )}
                </td>
            </tr>
        ));
        const tableHeaderElements = tableHeader.map((item, index) => <th key={'table-info_' + index}>{item.value}</th>);

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
});

export default connect(mapStateToProps)(ProjectData);
