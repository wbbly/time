import React, { Component } from 'react';
import { connect } from 'react-redux';
import defaultLogo from '../../images/icons/Group20.svg';

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
import { getCurrentTeamDetailedDataAction } from '../../actions/TeamActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

const roleMap = {
    ROLE_ADMIN: 'Admin',
    ROLE_MEMBER: 'Member',
};

class TeamPage extends Component {
    state = {
        renameModal: false,
        teamId: '',
    };

    headerItems = () => {
        const { vocabulary } = this.props;
        const { v_name, v_team_role, v_team_access, v_phone } = vocabulary;
        return [v_name, v_phone, 'E-mail', v_team_role, v_team_access];
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

    showBigAvatar = event => {
        event.target.nextSibling.style.transform = 'scale(1)';
    };

    hideBigAvatar = event => {
        event.target.nextSibling.style.transform = 'scale(0)';
    };

    render() {
        const { isMobile, vocabulary, currentTeamDetailedData, currentTeam, switchTeam } = this.props;
        const {
            v_team,
            v_rename_team,
            v_invite_to_team,
            v_active,
            v_not_active,
            v_name,
            v_team_role,
            v_team_access,
            v_phone,
        } = vocabulary;
        const headerItemsElements = this.headerItems().map((element, index) => (
            <th key={'team-group-header_' + index}>{element}</th>
        ));
        const items = currentTeamDetailedData.data.map((item, index) => {
            const currentUser = item.user[0] || {};
            const { username, email, phone, avatar } = currentUser;
            const role = item.role_collaboration.title;
            const isActive = item.is_active;

            return (
                <tr key={item.user[0].id}>
                    <td data-label={v_name} className="user-container">
                        {!avatar ? (
                            <img src={defaultLogo} className="avatar-small" />
                        ) : (
                            <>
                                <div
                                    onMouseEnter={this.showBigAvatar}
                                    onMouseLeave={this.hideBigAvatar}
                                    className="avatar-small"
                                    style={{
                                        backgroundImage: `url(${AppConfig.apiURL}${avatar})`,
                                    }}
                                />
                                <div
                                    className="avatar-big"
                                    style={{
                                        backgroundImage: `url(${AppConfig.apiURL}${avatar})`,
                                    }}
                                />
                            </>
                        )}
                        <span>{username}</span>
                    </td>
                    <td data-label={v_phone} className="phone_container">
                        {phone ? phone : '-'}
                    </td>
                    <td data-label="E-mail">{email}</td>
                    <td data-label={v_team_role}>
                        {checkIsMemberByRole(role) && <div className="access_container">{roleMap[role]}</div>}
                        {checkIsAdminByRole(role) && <div className="access_container red">{roleMap[role]}</div>}
                    </td>
                    <td data-label={v_team_access}>
                        <div
                            className={classNames('team-access-container', {
                                'team-access-container-admin': checkIsAdminByRole(currentTeam.data.role),
                            })}
                            onClick={e =>
                                isMobile && checkIsAdminByRole(currentTeam.data.role) ? this.openEditModal(item) : null
                            }
                        >
                            {isActive ? v_active : v_not_active}
                        </div>
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
        const { getCurrentTeamDetailedDataAction } = this.props;
        getCurrentTeamDetailedDataAction();
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
        getCurrentTeamDetailedDataAction: () => dispatch(getCurrentTeamDetailedDataAction()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamPage);
