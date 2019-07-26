import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showMobileSupportToastr } from '../../App';

// dependencies
import classNames from 'classnames';

// Services
import { checkIsAdminByRole, checkIsMemberByRole, checkIsAdmin } from '../../services/authentication';
import { removeAvailableTeamsFromLocalStorage } from '../../services/availableTeamsStorageService';
import {
    getCurrentTeamDataFromLocalStorage,
    setCurrentTeamDataToLocalStorage,
} from '../../services/currentTeamDataStorageService';
import { apiCall } from '../../services/apiService';

// Components
import AddToTeamModal from '../../components/AddToTeamModal';
import RenameTeamModal from '../../components/RenameTeamModal';
import EditTeamModal from '../../components/EditTeamModal';

// Actions
import teamPageAction from '../../actions/TeamPageAction';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class TeamPage extends Component {
    state = {
        renameModal: false,
        teamName: 'Loading...',
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
        const { isMobile, setTeamsUpdateTimestamp, vocabulary } = this.props;
        const { v_team, v_rename_team, v_invite_to_team } = vocabulary;
        let programersArr = this.props.programersArr;
        const headerItemsElements = this.headerItems().map((element, index) => (
            <th key={'team-group-header_' + index}>{element}</th>
        ));
        const items = programersArr.map((item, index) => {
            const currentUser = item.user[0] || {};
            const { username, email } = currentUser;
            const role = item.role_collaboration.title;
            const isActive = item.is_active;

            return (
                <tr key={'team-member_' + index}>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td>
                        {checkIsMemberByRole(role) && <div className="access_container">{role}</div>}
                        {checkIsAdminByRole(role) && <div className="access_container red">{role}</div>}
                    </td>
                    <td>
                        <div>{isActive ? 'Active' : 'Not active'}</div>
                        {checkIsAdmin() && (
                            <i onClick={e => this.openEditModal(item)} className="edit_button item_button" />
                        )}
                    </td>
                </tr>
            );
        });

        return (
            <div
                className={classNames('wrapper_team_page', {
                    'wrapper_team_page--mobile': isMobile,
                })}
            >
                {this.props.createUserModal && (
                    <AddToTeamModal
                        programersArr={this.props.programersArr}
                        teamPageAction={this.props.teamPageAction}
                        getData={this.getDataFromServer}
                    />
                )}
                {this.props.editUserModal && (
                    <EditTeamModal
                        teamPageAction={this.props.teamPageAction}
                        editedUser={this.props.editedUser}
                        getDataFromServer={this.getDataFromServer}
                        teamPage={this}
                        teamId={this.state.teamId}
                    />
                )}
                {this.state.renameModal && (
                    <RenameTeamModal
                        teamId={this.state.teamId}
                        refreshTeamName={result => {
                            const currentTeam = result.data.update_team.returning[0] || {};
                            this.setState({
                                teamId: currentTeam.id,
                                teamName: currentTeam.name,
                            });

                            const currentTeamDataFromLocalStorage = getCurrentTeamDataFromLocalStorage();
                            setCurrentTeamDataToLocalStorage({
                                id: currentTeam.id,
                                name: currentTeam.name,
                                role: currentTeamDataFromLocalStorage.role,
                            });
                            removeAvailableTeamsFromLocalStorage();
                            setTeamsUpdateTimestamp(new Date().getTime());
                        }}
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
                            {v_team}: {this.state.teamName}
                        </div>
                        <div className="team_page_main-controls">
                            <div className="invite_container">
                                {checkIsAdmin() && (
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
                                {checkIsAdmin() && (
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
        );
    }

    componentDidMount() {
        showMobileSupportToastr();
        this.getDataFromServer();
    }

    getDataFromServer(teamPage = this) {
        apiCall(AppConfig.apiURL + `team/current`).then(res => {
            const currentTeam = res.data.user_team[0] || {};
            const currentTeamInfo = currentTeam.team || {};
            const currentTeamRoleCollaboration = currentTeam.role_collaboration || {};

            const teamId = currentTeamInfo.id;
            const teamName = currentTeamInfo.name;
            teamPage.setState({
                teamId,
                teamName,
            });
            setCurrentTeamDataToLocalStorage({
                id: teamId,
                name: teamName,
                role: currentTeamRoleCollaboration.title,
            });

            apiCall(AppConfig.apiURL + `team/current/detailed-data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(
                result => {
                    let data = result.data.team[0].team_users;
                    teamPage.props.teamPageAction('SET_TABLE_DATA', { programersArr: data });
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => console.log(errorMessage));
                    } else {
                        console.log(err);
                    }
                }
            );
        });
    }
}

const mapStateToProps = store => ({
    programersArr: store.teamPageReducer.programersArr,
    createUserModal: store.teamPageReducer.createUserModal,
    editUserModal: store.teamPageReducer.editUserModal,
    editedUser: store.teamPageReducer.editedUser,
    currentTeam: store.teamReducer.currentTeam,
    isMobile: store.responsiveReducer.isMobile,
    vocabulary: store.languageReducer.vocabulary,
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
