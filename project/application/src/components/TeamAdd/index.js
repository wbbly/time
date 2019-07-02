import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { Trans } from 'react-i18next';

// Components
import CreateTeamModal from '../CreateTeamModal';

// Actions
import teamAddPageAction from '../../actions/TeamAddPageAction';

// Queries

// Config

// Styles
import './style.css';

class TeamAdd extends Component {
    render() {
        const { teamAddModalToggle, teamAddPageAction, createTeamRequest } = this.props;

        return (
            <div>
                {teamAddModalToggle && (
                    <CreateTeamModal teamAddPageAction={teamAddPageAction} createTeamRequest={createTeamRequest} />
                )}
                <span className="team_add" onClick={e => teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: true })}>
                   <Trans i18nKey="add_team">Add team</Trans>
                </span>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        teamAddModalToggle: store.teamAddReducer.teamAddModalToggle,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        teamAddPageAction: (actionType, toggle) => dispatch(teamAddPageAction(actionType, toggle))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamAdd);
