import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppConfig } from '../../config';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import teamAction from '../../actions/TeamAction';
import {
    getAvailableTeamsFromLocalStorage,
    setAvailableTeamsToLocalStorage,
    getCurrentTeamDataFromLocalStorage,
    setCurrentTeamDataToLocalStorage,
} from '../../services/teamStorageService';

class TeamSwitcher extends Component {
    state = {
        currentTeamId: '',
        currentTeamName: '',
        availableTeams: [],
    };

    constructor(props) {
        super(props);
    }

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
                            //
                            // Not required while we refresh the page
                            //
                            // this.setState({
                            //     currentTeamId: response.data.user_team[0].team.id,
                            //     currentTeamName: response.data.user_team[0].team.name,
                            // });

                            setCurrentTeamDataToLocalStorage({
                                id: response.data.user_team[0].team.id,
                                name: response.data.user_team[0].team.name,
                                role: response.data.user_team[0].role_collaboration.title,
                            });
                            window.location.reload(true);
                        })
                    );
                })
            );
        }
    };

    componentDidMount() {
        let teamsLocalData = getAvailableTeamsFromLocalStorage();
        let currentTeamData = getCurrentTeamDataFromLocalStorage();
        if (teamsLocalData) {
            this.setState({
                availableTeams: teamsLocalData,
                currentTeamName: currentTeamData.name,
                currentTeamId: currentTeamData.id,
            });
        } else {
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
                        let availableTeamsParsed = [];
                        availableTeams.map(item => {
                            return availableTeamsParsed.push({
                                id: item.team.id,
                                name: item.team.name,
                            });
                        });
                        this.setState({
                            availableTeams: availableTeamsParsed,
                        });
                        setAvailableTeamsToLocalStorage(availableTeamsParsed);

                        fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(res =>
                            res.json().then(response => {
                                this.setState({
                                    currentTeamId: response.data.user_team[0].team.id,
                                    currentTeamName: response.data.user_team[0].team.name,
                                });
                                setCurrentTeamDataToLocalStorage({
                                    id: response.data.user_team[0].team.id,
                                    name: response.data.user_team[0].team.name,
                                    role: response.data.user_team[0].role_collaboration.title,
                                });
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
    }

    componentDidUpdate() {
        let hasDataInStorage = getAvailableTeamsFromLocalStorage();
        if (!hasDataInStorage) {
            fetch(AppConfig.apiURL + `user/${getUserIdFromLocalStorage()}/teams`)
                .then(res => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then(response => {
                    let availableTeams = response.data.user_team;
                    let availableTeamsParsed = [];
                    availableTeams.map(item => {
                        return availableTeamsParsed.push({
                            id: item.team.id,
                            name: item.team.name,
                        });
                    });
                    this.setState({
                        availableTeams: availableTeamsParsed,
                    });
                    setAvailableTeamsToLocalStorage(availableTeamsParsed);
                });
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
                            <li
                                key={'team_list-item_' + index}
                                title={title}
                                onClick={this.handleChange}
                                data-id={team.id}
                                data-name={team.name}
                            >
                                {this.state.availableTeams.length > 1 && this.state.currentTeamId === team.id
                                    ? team.name + ' (default)'
                                    : team.name}
                            </li>
                        );
                    })}
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
