import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './style.css';
import LeftBar from '../../components/LeftBar';
import AddToTeamModal from '../../components/AddToTeamModal';
import RenameTeamModal from '../../components/RenameTeamModal';
import teamPageAction from '../../actions/TeamPageAction';
import { checkIsAdminByRole, checkIsMemberByRole, userLoggedIn, checkIsAdmin } from '../../services/authentication';
import EditTeamModal from '../../components/EditTeamModal';
import { AppConfig } from '../../config';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';

import { getCurrentTeamDataFromLocalStorage } from '../../services/teamStorageService';

class TeamPage extends Component {
    headerItems = ['Name', 'E-mail', 'Team Access', 'Wobbly Active Status'];

    changingName = false;
    teamNameRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            renameModal: false,
            teamName: 'Loading...',
            teamId: '',
        };
    }

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

    openRenameModal() {
        this.setState({
            renameModal: true,
        });
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
                teamId: this.state.teamId,
                newName: this.teamNameRef.current.value,
            }),
        })
            .then(res => {
                res.json().then(response => {
                    this.changingName = false;
                    this.forceUpdate();
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        let programersArr = this.props.programersArr;
        const headerItemsElements = this.headerItems.map((element, index) => (
            <th key={'team-group-header_' + index}>{element}</th>
        ));
        const items = programersArr.map((element, index) => {
            element.user[0].role = element.role_collaboration.title;
            return (
                <tr key={'team-member_' + index}>
                    <td>{element.user[0].username}</td>
                    <td>{element.user[0].email}</td>
                    <td>
                        {checkIsMemberByRole(element.role_collaboration.title) && (
                            <div className="access_container">{element.role_collaboration.title}</div>
                        )}
                        {checkIsAdminByRole(element.role_collaboration.title) && (
                            <div className="access_container red">{element.role_collaboration.title}</div>
                        )}
                    </td>
                    <td>
                        <div>{element.user[0].is_active ? 'Active' : 'Not active'}</div>
                        {checkIsAdmin() && (
                            <i
                                onClick={e => this.openEditMiodal(element.user[0])}
                                className="edit_button item_button"
                            />
                        )}
                    </td>
                </tr>
            );
        });

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
                        teamId={this.state.teamId}
                    />
                )}
                {this.state.renameModal && (
                    <RenameTeamModal
                        teamId={this.state.teamId}
                        refreshTeamName={() => {
                            fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(
                                res => {
                                    res.json().then(response => {
                                        this.setState({
                                            teamName: response.data.user_team[0].team.name,
                                            teamId: response.data.user_team[0].team.id,
                                        });
                                    });
                                }
                            );
                        }}
                        closeCallback={() =>
                            this.setState({
                                renameModal: false,
                            })
                        }
                    />
                )}
                <LeftBar />
                <div className="data_container_team_page">
                    <div className="team_page_header">
                        <div className="page_name">{this.state.teamName}</div>
                        <div className="invite_container">
                            {checkIsAdmin() && (
                                <button
                                    onClick={e => {
                                        this.openRenameModal();
                                    }}
                                >
                                    Rename Team
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
        //@TODO Get Saved value from localStorage
        let teamData = getCurrentTeamDataFromLocalStorage();

        this.setState({
            teamName: teamData.name,
            teamId: teamData.id,
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
