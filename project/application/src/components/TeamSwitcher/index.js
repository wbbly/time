import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import {
    getAvailableTeamsFromLocalStorage,
    setAvailableTeamsToLocalStorage,
} from '../../services/availableTeamsStorageService';
import {
    getCurrentTeamDataFromLocalStorage,
    setCurrentTeamDataToLocalStorage,
} from '../../services/currentTeamDataStorageService';

// Components
import TeamAdd from '../TeamAdd';

// Actions
import teamAction from '../../actions/TeamAction';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class TeamSwitcher extends Component {
    state = {
        currentTeamId: '',
        currentTeamName: '',
        availableTeams: [],
    };

    handleChange = e => {
        e.preventDefault();
        let teamId = e.target.getAttribute('data-id');

        const currentTeamData = getCurrentTeamDataFromLocalStorage();
        const currentTeamId = currentTeamData.id;
        if (currentTeamId !== teamId) {
            fetch(AppConfig.apiURL + `team/switch`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: getUserIdFromLocalStorage(),
                    teamId: teamId,
                }),
            }).then(res =>
                res.json().then(response => {
                    fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(res =>
                        res.json().then(response => {
                            const currentTeam = response.data.user_team[0] || {};
                            const currentTeamInfo = currentTeam.team || {};
                            const currentTeamRoleCollaboration = currentTeam.role_collaboration || {};
                            setCurrentTeamDataToLocalStorage({
                                id: currentTeamInfo.id,
                                name: currentTeamInfo.name,
                                role: currentTeamRoleCollaboration.title,
                            });
                            window.location.pathname = '/team';
                        })
                    );
                })
            );
        } else {
            window.location.pathname = '/team';
        }
    };

    getTeamsInfo() {
        const availableTeamsFromLocalStorage = getAvailableTeamsFromLocalStorage() || [];
        const currentTeamDataFromLocalStorage = getCurrentTeamDataFromLocalStorage() || {};
        this.setState({
            availableTeams: availableTeamsFromLocalStorage,
            currentTeamName: currentTeamDataFromLocalStorage.name,
            currentTeamId: currentTeamDataFromLocalStorage.id,
        });

        fetch(AppConfig.apiURL + `user/${getUserIdFromLocalStorage()}/teams`)
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                response => {
                    let availableTeams = response.data.user_team;
                    availableTeams = availableTeams.map(item => ({
                        id: item.team.id,
                        name: item.team.name,
                    }));

                    const availableTeamIdsFromLocalStorage = availableTeamsFromLocalStorage.map(
                        stateTeam => stateTeam.id
                    );
                    let differenceInAvailableTeamsFound =
                        availableTeamIdsFromLocalStorage.length !== availableTeams.length;
                    for (let i = 0; i < availableTeams.length; i++) {
                        const availableTeam = availableTeams[i];
                        if (availableTeamIdsFromLocalStorage.indexOf(availableTeam.id) === -1) {
                            differenceInAvailableTeamsFound = true;
                            break;
                        }
                    }

                    if (differenceInAvailableTeamsFound) {
                        this.setState({ availableTeams });
                        setAvailableTeamsToLocalStorage(availableTeams);
                    }

                    fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(res =>
                        res.json().then(response => {
                            const currentTeam = response.data.user_team[0] || {};
                            const currentTeamInfo = currentTeam.team || {};
                            const currentTeamRoleCollaboration = currentTeam.role_collaboration || {};
                            let differenceInCurrentTeamFound = false;
                            if (
                                !currentTeamDataFromLocalStorage.id ||
                                currentTeamDataFromLocalStorage.id !== currentTeamInfo.id
                            ) {
                                differenceInCurrentTeamFound = true;
                            }

                            if (differenceInCurrentTeamFound) {
                                this.setState({
                                    currentTeamId: currentTeamInfo.id,
                                    currentTeamName: currentTeamInfo.name,
                                });
                                setCurrentTeamDataToLocalStorage({
                                    id: currentTeamInfo.id,
                                    name: currentTeamInfo.name,
                                    role: currentTeamRoleCollaboration.title,
                                });
                            }
                        })
                    );
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => {
                            console.log(errorMessage);
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
    }

    componentDidMount() {
        this.getTeamsInfo();
    }

    componentDidUpdate(prevProps) {
        if (this.props.teamsUpdateTimestamp && this.props.teamsUpdateTimestamp !== prevProps.teamsUpdateTimestamp) {
            this.getTeamsInfo();
        }
    }

    render() {
        return (
            <div className="team_list">
                <ul>
                    {this.state.availableTeams.map((team, index) => {
                        const title =
                            this.state.currentTeamId === team.id ? `Default team` : `Set ${team.name} team as default`;

                        return (
                            <li key={'team_list-item_' + index} title={title}>
                                <div
                                    className="team_list-item"
                                    onClick={this.handleChange}
                                    data-id={team.id}
                                    data-name={team.name}
                                >
                                    {team.name + ' '}
                                    {this.state.availableTeams.length > 1 &&
                                        this.state.currentTeamId === team.id && <b>(default)</b>}
                                </div>
                            </li>
                        );
                    })}
                    <li>
                        <div className="team_list-item">
                            <TeamAdd
                                createTeamRequest={teamName => {
                                    fetch(AppConfig.apiURL + `team/add`, {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            userId: getUserIdFromLocalStorage(),
                                            teamName,
                                        }),
                                    }).then(res => (window.location.pathname = '/team'));
                                }}
                            />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    currentTeam: store.teamReducer.currentTeam,
});

const mapDispatchToProps = dispatch => {
    return {
        teamAction: (actionType, action) => dispatch(teamAction(actionType, action)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamSwitcher);
