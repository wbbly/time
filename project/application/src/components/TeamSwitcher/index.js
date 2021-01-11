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
    state = { openTeamList: false };

    handleChange = e => {
        e.preventDefault();
        const { currentTeam, switchTeamRequestAction, history, switchMenu, currentTimer, isMobile } = this.props;
        let teamId = e.target.getAttribute('data-id');
        if (currentTeam.data.id !== teamId) {
            if (currentTimer) {
                stopTimerSocket();
            }
            switchTeamRequestAction({ teamId });
        }
        this.setState({ openTeamList: false });
        history.push('/team');

        if (isMobile) switchMenu();
    };

    render() {
        const { openTeamList } = this.state;
        const { isMobile, vocabulary, userTeams, currentTeam } = this.props;
        const { v_team } = vocabulary;

        return (
            <Loading flag={userTeams.isInitialFetching} withLogo={false} mode="inline">
                <div className="team_list">
                    <div
                        className="team_link"
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.setState({ openTeamList: !openTeamList });
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            <i className="team" />
                            <div className="team_text">{v_team}</div>
                        </div>
                        <i
                            className={classNames({
                                arrow_closed: !openTeamList && !isMobile,
                                arrow_open: openTeamList && !isMobile,
                                arrow_closed_mobile: !openTeamList && isMobile,
                                arrow_open_mobile: openTeamList && isMobile,
                            })}
                        />
                    </div>
                    <TeamAdd
                        isMobile={isMobile}
                        userTeams={userTeams}
                        currentTeam={currentTeam}
                        vocabulary={vocabulary}
                        handleChange={this.handleChange}
                        openTeamList={openTeamList}
                        closeTeamList={e => this.setState({ openTeamList: false })}
                    />
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
