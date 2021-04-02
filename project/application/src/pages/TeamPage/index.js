import React, { Component } from 'react';
import { connect } from 'react-redux';

// dependencies
import classNames from 'classnames';

// Services
import {
    ROLES,
    ROLES_TITLES,
    checkIsAdminByRole,
    checkIsMemberByRole,
    checkIsOwnerByRole,
} from '../../services/authentication';

// Components
import AddToTeamModal from '../../components/AddToTeamModal';
import RenameTeamModal from '../../components/RenameTeamModal';
import EditTeamModal from '../../components/EditTeamModal';
import { Loading } from '../../components/Loading';
import PageHeader from '../../components/PageHeader/index';
import TeamSearchBar from '../../components/TeamSearchBar';
import SelectTeamRoleAccess from '../../components/SelectTeamRoleAccess';

// Actions
import teamPageAction from '../../actions/TeamPageAction';
import { getCurrentTeamDetailedDataAction } from '../../actions/TeamActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

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

class TeamPage extends Component {
    state = {
        renameModal: false,
        teamId: '',
        searchValue: '',
        roleValue: 'all',
        accessValue: 'granted',
        technologyValue: '',
    };

    setSearch = value => {
        this.setState({ searchValue: value });
    };

    setTeamRole = value => {
        this.setState({ roleValue: value });
    };

    setAccess = value => {
        this.setState({ accessValue: value });
    };

    setTechnology = value => {
        this.setState({ technologyValue: value });
    };

    headerItems = () => {
        const { vocabulary } = this.props;
        const { v_name, v_phone } = vocabulary;
        return [
            <span onClick={() => this.setTechnology('')}>{v_name}</span>,
            v_phone,
            'E-mail',
            <SelectTeamRoleAccess type="role" value={this.state.roleValue} setTeamRoleAccess={this.setTeamRole} />,
            <SelectTeamRoleAccess type="access" value={this.state.accessValue} setTeamRoleAccess={this.setAccess} />,
        ];
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
        event.target.nextSibling.style.transform = 'translateY(-88%) scale(1)';
    };

    hideBigAvatar = event => {
        event.target.nextSibling.style.transform = 'translateY(-88%) scale(0)';
    };

    filterData = data => {
        const { searchValue, roleValue, accessValue } = this.state;
        const { vocabulary, owner_id } = this.props;
        const { v_active, v_not_active } = vocabulary;
        return data
            .filter(
                item =>
                    roleValue === 'all' ||
                    (roleValue === 'member' && item.role_collaboration.title === 'ROLE_MEMBER') ||
                    (roleValue === 'admin' &&
                        (item.role_collaboration.title === 'ROLE_ADMIN' ||
                            item.role_collaboration.title === 'ROLE_OWNER'))
            )
            .filter(
                item =>
                    accessValue === 'all' ||
                    (accessValue === 'granted' && item.is_active) ||
                    (accessValue === 'denied' && !item.is_active)
            )
            .filter(
                item =>
                    searchValue === '' ||
                    ((item.user[0] || {}).username || '').toLowerCase().indexOf(searchValue.toLowerCase().trim()) !==
                        -1 ||
                    ((item.user[0] || {}).userTechnologies || []).findIndex(
                        item => item.technology.title.toLowerCase().indexOf(searchValue.toLowerCase().trim()) !== -1
                    ) !== -1 ||
                    ((item.user[0] || {}).email || '').toLowerCase().indexOf(searchValue.toLowerCase().trim()) !== -1 ||
                    ((item.user[0] || {}).phone || '')
                        .replace(/\D/g, '')
                        .indexOf(searchValue.replace(/\D/g, '') || 'none') !== -1 ||
                    ((item.user[0] || {}).id === owner_id &&
                        'owner'.indexOf(searchValue.toLowerCase().trim()) !== -1) ||
                    ((item.user[0] || {}).id !== owner_id &&
                        item.role_collaboration.title
                            .slice(5)
                            .toLowerCase()
                            .indexOf(searchValue.toLowerCase().trim()) !== -1) ||
                    (item.is_active && v_active.toLowerCase().indexOf(searchValue.toLowerCase().trim()) !== -1) ||
                    (!item.is_active && v_not_active.toLowerCase().indexOf(searchValue.toLowerCase().trim()) !== -1)
            );
    };

    sortData = data => {
        const { technologyValue } = this.state;
        let hasTechnology = [];
        let hasntTechnology = [];
        data.forEach(item => {
            if (
                ((item.user[0] || {}).userTechnologies || []).findIndex(
                    item => item.technology.title.toLowerCase().trim() === technologyValue
                ) !== -1
            ) {
                hasTechnology.push(item);
            } else {
                hasntTechnology.push(item);
            }
        });
        return hasTechnology.concat(hasntTechnology);
    };

    transformTechnologiesList = list => {
        let newList = [];
        list.forEach(item => {
            if (!newList.find(tech => tech.technology.title === item.technology.title.toLowerCase().trim())) {
                newList.push({
                    ...item,
                    technology: { ...item.technology, title: item.technology.title.toLowerCase().trim() },
                });
            }
        });
        return newList;
    };

    render() {
        const { isMobile, vocabulary, currentTeamDetailedData, currentTeam, switchTeam, owner_id, user } = this.props;
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
        const filteredItems = this.filterData(currentTeamDetailedData.data);
        const sortedItems = this.sortData(filteredItems);
        const items = sortedItems.map((item, index) => {
            const currentUser = item.user[0] || {};
            const { username, email, phone, avatar, userTechnologies } = currentUser;
            const isActive = item.is_active;

            let role = item.role_collaboration.title;
            if (currentUser) {
                if (currentUser.id === owner_id) {
                    role = ROLES.ROLE_OWNER;
                }
            }
            let currentTeamRole = currentTeam.data.role;
            if (user.id === owner_id) {
                currentTeamRole = ROLES.ROLE_OWNER;
            }

            return (
                <tr key={item.user[0].id}>
                    <td data-label={v_name} className="user-container">
                        {!avatar ? (
                            <div className="avatar-small" />
                        ) : (
                            <>
                                <div
                                    onMouseEnter={this.showBigAvatar}
                                    onMouseLeave={this.hideBigAvatar}
                                    className="avatar-small avatar-cover"
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
                        <div>
                            <div>{username}</div>
                            <div className="technology_container">
                                {this.transformTechnologiesList(userTechnologies || []).map((item, key) => {
                                    return (
                                        <span
                                            key={key}
                                            className="technology"
                                            onClick={() => this.setTechnology(item.technology.title)}
                                        >
                                            {item.technology.title}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </td>
                    <td data-label={v_phone} className="phone_container">
                        {phone ? phone : '-'}
                    </td>
                    <td data-label="E-mail">{email}</td>
                    <td data-label={v_team_role}>
                        <div className="team-access-role">
                            <div className={`access_container ${role || ROLES.ROLE_MEMBER}`}>{ROLES_TITLES[role]}</div>
                        </div>
                    </td>
                    <td data-label={v_team_access}>
                        <div
                            className={classNames('team-access-container', {
                                'team-access-container-admin':
                                    checkIsAdminByRole(currentTeamRole) || checkIsOwnerByRole(currentTeamRole),
                            })}
                            onClick={e =>
                                isMobile &&
                                (checkIsOwnerByRole(currentTeamRole) ||
                                    (checkIsAdminByRole(currentTeamRole) && checkIsMemberByRole(role)))
                                    ? this.openEditModal(item)
                                    : null
                            }
                        >
                            {isActive ? v_active : v_not_active}
                            {(checkIsOwnerByRole(currentTeamRole) ||
                                (checkIsAdminByRole(currentTeamRole) && checkIsMemberByRole(role))) && (
                                <EditIcon className="edit_button item_button" onClick={e => this.openEditModal(item)} />
                            )}
                        </div>
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
                        <EditTeamModal
                            teamPageAction={this.props.teamPageAction}
                            editedUser={this.props.editedUser}
                            isTeamOwner={checkIsOwnerByRole(currentTeam.data.role)}
                        />
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
                        <PageHeader title={`${v_team}: ${currentTeam.data.name}`}>
                            <div className="team_page_main-controls">
                                {(checkIsAdminByRole(currentTeam.data.role) ||
                                    checkIsOwnerByRole(currentTeam.data.role)) && (
                                    <button
                                        className="header-wrapper__child-button"
                                        onClick={e => {
                                            this.openRenameModal();
                                        }}
                                    >
                                        {v_rename_team}
                                    </button>
                                )}

                                {(checkIsAdminByRole(currentTeam.data.role) ||
                                    checkIsOwnerByRole(currentTeam.data.role)) && (
                                    <button
                                        className="header-wrapper__child-button"
                                        onClick={e => {
                                            this.openAddUserModal();
                                        }}
                                    >
                                        {v_invite_to_team}
                                    </button>
                                )}
                            </div>
                        </PageHeader>
                        <div className="team_page_searchBar">
                            <TeamSearchBar search={this.setSearch} />
                        </div>
                        {isMobile && (
                            <div className="role_access_team_page">
                                <SelectTeamRoleAccess
                                    type="role"
                                    value={this.state.roleValue}
                                    setTeamRoleAccess={this.setTeamRole}
                                />
                                <SelectTeamRoleAccess
                                    type="access"
                                    value={this.state.accessValue}
                                    setTeamRoleAccess={this.setAccess}
                                />
                            </div>
                        )}
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
    owner_id: store.teamReducer.currentTeam.data.owner_id,
    user: store.userReducer.user,
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
