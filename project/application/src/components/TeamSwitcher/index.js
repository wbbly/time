import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppConfig } from '../../config';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import teamAction from '../../actions/TeamAction';

class TeamSwitcher extends Component {
    state = {
        currentTeamId: '',
        currentTeamName: '',
        availableTeams: [],
    };

    constructor(props) {
        super(props);
        this.selectRef = React.createRef();
    }

    handleChange = e => {
        e.preventDefault();
        //@TODO: Send request to server to change current team & update info on front

        this.setState({
            currentTeamId: this.selectRef.current.value,
        });

        fetch(AppConfig.apiURL + `team/switch`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: getUserIdFromLocalStorage(),
                teamId: this.selectRef.current.value,
            }),
        }).then(res =>
            res.json().then(response => {
                console.log(response);
            })
        );
    };

    componentDidMount() {
        fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(res =>
            res.json().then(response => {
                this.setState({
                    currentTeamId: response.data.user_team[0].team.id,
                    currentTeamName: response.data.user_team[0].team.name,
                });
                console.log(this.state);
            })
        );
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

                    console.log(availableTeamsParsed);
                    this.setState({
                        availableTeams: availableTeamsParsed,
                    });
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

    render() {
        return (
            <select ref={this.selectRef} value={this.state.currentTeamId} onChange={e => this.handleChange(e)}>
                {this.state.availableTeams.map(team => {
                    return <option value={team.id}>{team.name}</option>;
                })}
            </select>
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
