import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import classNames from 'classnames';

// Services

// Components
import TeamAdd from '../TeamAdd';
import { Loading } from '../Loading';

// Actions
import { switchTeamRequestAction } from '../../actions/TeamActions';
import { switchMenu } from '../../actions/ResponsiveActions';

// Queries

// Config
import { stopTimerSocket } from '../../configSocket';

// Styles
import './style.css';

class TeamSwitcher extends Component {
    handleChange = e => {
        e.preventDefault();
        const { currentTeam, switchTeamRequestAction, history, switchMenu, currentTimer } = this.props;
        let teamId = e.target.getAttribute('data-id');
        if (currentTeam.data.id !== teamId) {
            if (currentTimer) {
                stopTimerSocket();
            }
            switchTeamRequestAction({ teamId });
        }
        history.push('/team');
        switchMenu();
    };

    render() {
        const { isMobile, vocabulary, userTeams, currentTeam } = this.props;
        const { v_active_team, v_set, v_team_is_active } = vocabulary;
        return (
            <Loading flag={userTeams.isInitialFetching} withLogo={false} mode="inline">
                <div className="team_list">
                    <ul>
                        {userTeams.data.map((team, index) => {
                            const title =
                                currentTeam.data.id === team.id
                                    ? `${v_active_team}`
                                    : `${v_set} ${team.name} ${v_team_is_active}`;

                            return (
                                <li key={team.id} title={title}>
                                    <div
                                        className={classNames('team_list-item', {
                                            active: userTeams.data.length > 1 && currentTeam.data.id === team.id,
                                        })}
                                        onClick={this.handleChange}
                                        data-id={team.id}
                                        data-name={team.name}
                                    >
                                        {team.name + ' '}
                                        {userTeams.data.length > 1 &&
                                            currentTeam.data.id === team.id && <div className="active-point" />}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    {!isMobile && <TeamAdd />}
                </div>
            </Loading>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    userTeams: state.teamReducer.userTeams,
    currentTeam: state.teamReducer.currentTeam,
    currentTimer: state.mainPageReducer.currentTimer,
});

const mapDispatchToProps = {
    switchTeamRequestAction,
    switchMenu,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(TeamSwitcher)
);
