import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showMobileSupportToastr } from '../../App';

// dependencies
import classNames from 'classnames';

// Services
import { checkIsAdminByRole, checkIsMemberByRole } from '../../services/authentication';

// Components
import AddToTeamModal from '../../components/AddToTeamModal';
import RenameTeamModal from '../../components/RenameTeamModal';
import EditTeamModal from '../../components/EditTeamModal';
import { Loading } from '../../components/Loading';

// Actions
import teamPageAction from '../../actions/TeamPageAction';

// Queries

// Config

// Styles
import './style.scss';

class TeamPage extends Component {
    state = {
        renameModal: false,
        teamId: '',
    };

    headerItems = () => {
        const { vocabulary } = this.props;
        const { v_name, v_team_role, v_team_access } = vocabulary;
        return [v_name, 'E-mail', v_team_role, v_team_access];
    };

    changingName = false;
    teamNameRef = React.createRef();

    nameInput = val => <input ref={this.teamNameRef} type="text" placeholder={val} />;

    openAddUserModal() {
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: !this.props.createUserModal });
    }

    openEditModal(item) {
        this.props.teamPageAction('TOGGLE_EDIT_USER_MODAL', { editUserModal: true });
        this.props.teamPageAction('SET_EDIT_USER', { editedUser: item });
    }

    openRenameModal() {
        this.setState({
            renameModal: true,
        });
    }

    render() {
        const { isMobile, vocabulary, currentTeamDetailedData, currentTeam, switchTeam } = this.props;
        const { v_team, v_rename_team, v_invite_to_team } = vocabulary;
        const headerItemsElements = this.headerItems().map((element, index) => (
            <th key={'team-group-header_' + index}>{element}</th>
        ));
        const items = currentTeamDetailedData.data.map((item, index) => {
            const currentUser = item.user[0] || {};
            const { username, email } = currentUser;
            const role = item.role_collaboration.title;
            const isActive = item.is_active;

            return (
                <tr key={item.user[0].id}>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td>
                        {checkIsMemberByRole(role) && <div className="access_container">{role}</div>}
                        {checkIsAdminByRole(role) && <div className="access_container red">{role}</div>}
                    </td>
                    <td>
                        <div>{isActive ? 'Active' : 'Not active'}</div>
                        {checkIsAdminByRole(currentTeam.data.role) && (
                            <i onClick={e => this.openEditModal(item)} className="edit_button item_button" />
                        )}
                    </td>
                </tr>
            );
        });

        return (
            <Loading
                flag={
                    currentTeamDetailedData.isInitialFetching ||
                    currentTeamDetailedData.isFetching ||
                    switchTeam.isFetching
                }
                mode="parentSize"
                withLogo={false}
            >
                <div
                    className={classNames('wrapper_team_page', {
                        'wrapper_team_page--mobile': isMobile,
                    })}
                >
                    {this.props.createUserModal && <AddToTeamModal teamPageAction={this.props.teamPageAction} />}
                    {this.props.editUserModal && (
                        <EditTeamModal teamPageAction={this.props.teamPageAction} editedUser={this.props.editedUser} />
                    )}
                    {this.state.renameModal && (
                        <RenameTeamModal
                            closeCallback={() =>
                                this.setState({
                                    renameModal: false,
                                })
                            }
                        />
                    )}
                    <div className="data_container_team_page">
                        <div className="team_page_header">
                            <div className="page_name">
                                {v_team}: {currentTeam.data.name}
                            </div>
                            <div className="team_page_main-controls">
                                <div className="invite_container">
                                    {checkIsAdminByRole(currentTeam.data.role) && (
                                        <button
                                            onClick={e => {
                                                this.openRenameModal();
                                            }}
                                        >
                                            {v_rename_team}
                                        </button>
                                    )}
                                </div>
                                <div className="invite_container">
                                    {checkIsAdminByRole(currentTeam.data.role) && (
                                        <button
                                            onClick={e => {
                                                this.openAddUserModal();
                                            }}
                                        >
                                            {v_invite_to_team}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="team_page_data">
                            <table>
                                <thead>
                                    <tr>{headerItemsElements}</tr>
                                </thead>
                                <tbody>{items}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Loading>
        );
    }

    componentDidMount() {
        showMobileSupportToastr();
    }
}

const mapStateToProps = store => ({
    createUserModal: store.teamPageReducer.createUserModal,
    editUserModal: store.teamPageReducer.editUserModal,
    editedUser: store.teamPageReducer.editedUser,
    isMobile: store.responsiveReducer.isMobile,
    vocabulary: store.languageReducer.vocabulary,
    currentTeamDetailedData: store.teamReducer.currentTeamDetailedData,
    currentTeam: store.teamReducer.currentTeam,
    switchTeam: store.teamReducer.switchTeam,
});

const mapDispatchToProps = dispatch => {
    return {
        teamPageAction: (actionType, action) => dispatch(teamPageAction(actionType, action))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamPage);
