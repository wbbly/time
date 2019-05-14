import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './style.css';
import LeftBar from '../../components/LeftBar';
import AddToTeamModal from '../../components/AddToTeamModal';
import teamPageAction from '../../actions/TeamPageAction';
import {
    checkIsAdminByRole,
    checkIsUserByRole,
    userLoggedIn,
    checkIsAdmin,
    checkIsUserByCollaborationRole,
} from '../../services/authentication';
import EditTeamModal from '../../components/EditTeamModal';
import { AppConfig } from '../../config';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import { Input } from '@material-ui/core';

class TeamPage extends Component {
    headerItems = ['Name', 'E-mail', 'Access', 'Team Access', 'Status'];
    teamName = 'Loading...';
    teamId = '';
    changingName = false;
    teamNameRef = React.createRef();

    nameInput = val => {
        return (
            <React.Fragment>
                <input ref={this.teamNameRef} type="text" placeholder={val} />
            </React.Fragment>
        );
    };

    openAddUserModal() {
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: !this.props.createUserModal });
    }

    openEditMiodal(item) {
        this.props.teamPageAction('TOGGLE_EDIT_USER_MODAL', { editUserModal: true });
        this.props.teamPageAction('SET_EDIT_USER', { editedUser: item });
    }

    renameTeam(e) {
        e.preventDefault();
        this.changingName = true;
        this.forceUpdate();
    }

    processRenameTeam(e) {
        fetch(AppConfig.apiURL + 'team/rename', {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamId: this.teamId,
                newName: this.teamNameRef.current.value,
            }),
        }).then(res => {
            res.json().then(response => {
                this.changingName = false;
                this.forceUpdate();
            });
        });
    }

    render() {
        let programersArr = this.props.programersArr;
        const headerItemsElements = this.headerItems.map((element, index) => (
            <th key={'team-group-header_' + index}>{element}</th>
        ));
        const items = programersArr.map((element, index) => (
            <tr key={'team-member_' + index}>
                <td>{element.user[0].username}</td>
                <td>{element.user[0].email}</td>
                <td>
                    {checkIsUserByRole(element.user[0].role.title) && (
                        <div className="access_container">{element.user[0].role.title}</div>
                    )}
                    {checkIsAdminByRole(element.user[0].role.title) && (
                        <div className="access_container red">{element.user[0].role.title}</div>
                    )}
                </td>
                <td>
                    {checkIsUserByCollaborationRole(element.role_collaboration.title) && (
                        <div className="access_container">{element.role_collaboration.title}</div>
                    )}
                    {checkIsAdminByRole(element.role_collaboration.title) && (
                        <div className="access_container red">{element.role_collaboration.title}</div>
                    )}
                </td>
                <td>
                    <div>{element.user[0].is_active ? 'Active' : 'Not active'}</div>
                    {checkIsAdmin() && (
                        <i onClick={e => this.openEditMiodal(element)} className="edit_button item_button" />
                    )}
                </td>
            </tr>
        ));

        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        return (
            <div className="wrapper_team_page">
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
                    />
                )}
                <LeftBar />
                <div className="data_container_team_page">
                    <div className="team_page_header">
                        <div className="page_name">
                            {this.changingName ? this.nameInput(this.teamName) : this.teamName}

                            {this.changingName ? (
                                <button onClick={e => this.processRenameTeam(e)}>EDIT</button>
                            ) : (
                                <button onClick={e => this.renameTeam(e)}>EDIT</button>
                            )}
                        </div>

                        <div className="invite_container">
                            {checkIsAdmin() && (
                                <button
                                    onClick={e => {
                                        this.openAddUserModal();
                                    }}
                                >
                                    Add to team
                                </button>
                            )}
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
        this.getDataFromServer();
        fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(res => {
            res.json().then(response => {
                this.teamName = response.data.user_team[0].team.name;
                this.teamId = response.data.user_team[0].team.id;
            });
        });
    }

    getDataFromServer(teamPage = this) {
        //Obtaining current team ID
        fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(res => {
            res.json().then(res => {
                let teamId = res.data.user_team[0].team.id;
                //@TODO: Fetch Team Data > http://API/team/teamId/data
                fetch(AppConfig.apiURL + `team/${teamId}/data`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
                    .then(res => {
                        if (!res.ok) {
                            throw res;
                        }
                        return res.json();
                    })
                    .then(
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
        });
    }
}

const mapStateToProps = store => {
    return {
        programersArr: store.teamPageReducer.programersArr,
        createUserModal: store.teamPageReducer.createUserModal,
        editUserModal: store.teamPageReducer.editUserModal,
        editedUser: store.teamPageReducer.editedUser,
        currentTeam: store.teamReducer.currentTeam,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        teamPageAction: (actionType, action) => dispatch(teamPageAction(actionType, action))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamPage);
