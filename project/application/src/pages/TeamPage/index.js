import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './style.css';
import LeftBar from '../../components/LeftBar';
import AddToTeamModal from '../../components/AddToTeamModal';
import teamPageAction from '../../actions/TeamPageAction';
import { checkIsAdminByRole, checkIsUserByRole, userLoggedIn, checkIsAdmin } from '../../services/authentication';
import EditTeamModal from '../../components/EditTeamModal';
import { AppConfig } from '../../config';

class TeamPage extends Component {
    headerItems = ['Name', 'E-mail', 'Access', 'Status'];
    state = {
        activeEmail: '',
    };

    openAddUserModal() {
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: !this.props.createUserModal });
    }

    openEditMiodal(item) {
        this.props.teamPageAction('TOGGLE_EDIT_USER_MODAL', { editUserModal: true });
        this.props.teamPageAction('SET_EDIT_USER', { editedUser: item });
    }

    render() {
        let programersArr = this.props.programersArr;
        const headerItemsElements = this.headerItems.map((element, index) => (
            <th key={'team-group-header_' + index}>{element}</th>
        ));
        const items = programersArr.map((element, index) => (
            <tr key={'team-member_' + index}>
                <td>{element.username}</td>
                <td>{element.email}</td>
                <td>
                    {checkIsUserByRole(element.role.title) && (
                        <div className="access_container">{element.role.title}</div>
                    )}
                    {checkIsAdminByRole(element.role.title) && (
                        <div className="access_container red">{element.role.title}</div>
                    )}
                </td>
                <td>
                    <div>{element.is_active ? 'Active' : 'Not active'}</div>
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
                        <div className="page_name">Team</div>
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
        this.setState({ activeEmail: localStorage.getItem('active_email') });
        this.getDataFromServer();
    }

    getDataFromServer(teamPage = this) {
        fetch(AppConfig.apiURL + `user/list`, {
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
                    let data = result.data;
                    teamPage.props.teamPageAction('SET_TABLE_DATA', { programersArr: data.user });
                },
                err => err.text().then(errorMessage => {})
            );
    }
}

const mapStateToProps = store => {
    return {
        programersArr: store.teamPageReducer.programersArr,
        createUserModal: store.teamPageReducer.createUserModal,
        editUserModal: store.teamPageReducer.editUserModal,
        editedUser: store.teamPageReducer.editedUser,
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
