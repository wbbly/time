import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';
import teamAddPageAction from '../../actions/TeamAddPageAction';
import CreateTeamModal from '../CreateTeamModal';

class TeamAdd extends Component {
    render() {
        const { teamAddModalToggle, teamAddPageAction, createTeamRequest } = this.props;

        return (
            <div>
                {teamAddModalToggle && (
                    <CreateTeamModal teamAddPageAction={teamAddPageAction} createTeamRequest={createTeamRequest} />
                )}
                <span className="team_add" onClick={e => teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: true })}>
                    Add team
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
