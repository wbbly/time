import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Services
// import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
// import { checkIsAdminByRole, checkIsOwnerByRole } from '../../services/authentication';

// Components
import EditProjectModal from '../EditProjectModal/index';

// Actions
import { getProjectsListActions } from '../../actions/ProjectsActions';
// Queries

// Config

// Styles
import './style.css';
import ProjectsDataRow from '../ProjectsDataRow';
import Scrollbars from 'react-custom-scrollbars';
import Spinner from '../Spinner';

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

    handleScrollFrame = values => {
        const { listFetching, isListEnded, getProjectsListActions, page } = this.props;
        const { top } = values;
        if (top > 0.7 && !listFetching && !isListEnded) {
            getProjectsListActions({
                page: page + 1,
                withPagination: true,
                withTimerList: false,
            });
        }
    };

    render() {
        const { currentTeam, vocabulary, durationTimeFormat, listFetching } = this.props;
        const { v_project_name, v_time, v_client } = vocabulary;

        const tableHeader = [
            {
                key: 4,
                value: '',
                className: 'table-project-toggle',
            },
            {
                key: 1,
                value: v_project_name,
                className: 'table-project-name',
            },
            {
                key: 5,
                value: '',
                className: 'table-project-color',
            },
            {
                key: 2,
                value: v_client,
                className: 'table-project-client',
            },
            {
                key: 3,
                value: '',
                className: 'table-project-time',
            },
        ];
        const tableInfoElements = this.props.tableInfo.map(item => (
            <ProjectsDataRow
                key={item.id}
                projectData={item}
                vocabulary={vocabulary}
                setEditItem={item => this.setEdiItem(item)}
                currentTeam={currentTeam}
                durationTimeFormat={durationTimeFormat}
                expandedStatus={this.props.tableInfo.length === 1}
                changeProjectActiveStatus={this.props.changeProjectActiveStatus}
            />
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
                    />
                )}
                <Scrollbars autoHide hideTracksWhenNotNeeded onScrollFrame={this.handleScrollFrame}>
                    <table>
                        <thead>
                            <tr>{tableHeaderElements}</tr>
                        </thead>
                        <tbody>{tableInfoElements}</tbody>
                    </table>
                    {listFetching && (
                        <div style={{ position: 'relative', paddingTop: '10px' }}>
                            <Spinner mode="inline" withLogo={false} />
                        </div>
                    )}
                </Scrollbars>
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
    isListEnded: state.projectReducer.pagination.isListEnded,
    listFetching: state.projectReducer.pagination.listFetching,
    page: state.projectReducer.pagination.page,
});

const mapDispatchToProps = {
    getProjectsListActions,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectData);
