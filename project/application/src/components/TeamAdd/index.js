import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services

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
        const { teamAddModalToggle, teamAddPageAction } = this.props;

        return (
            <div className="team_add_wrapper">
                {teamAddModalToggle && <CreateTeamModal teamAddPageAction={teamAddPageAction} />}
                <span className="team_add" onClick={e => teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: true })}>
                    <i className="team_add_plus" />
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
