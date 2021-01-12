import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import cn from 'classnames';

// Components
import CreateTeamModal from '../CreateTeamModal';
import ReactTooltip from 'react-tooltip';
import CustomScrollbar from '../../components/CustomScrollbar';
import ModalPortal from '../../components/ModalPortal';

// Actions
import teamAddPageAction from '../../actions/TeamAddPageAction';

// Queries

// Config

// Styles
import './style.css';

class TeamAdd extends Component {
    constructor(props) {
        super(props);
        this.teamListRef = React.createRef();
        this.activeTeamRef = React.createRef();
    }

    closeOnClickOutside() {}

    componentDidUpdate(prevProps) {
        this.activeTeamRef.current &&
            this.activeTeamRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
        if (prevProps.openTeamList !== this.props.openTeamList) {
            if (this.props.openTeamList) {
                document.addEventListener('click', this.closeDropdown);
            } else document.removeEventListener('click', this.closeDropdown);
        }
    }

    closeDropdown = e => {
        if (this.teamListRef.current && !this.teamListRef.current.contains(e.target)) {
            this.props.closeTeamList();
            document.removeEventListener('click', this.closeDropdown);
        }
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const {
            teamAddModalToggle,
            teamAddPageAction,
            vocabulary,
            isMobile,
            userTeams,
            currentTeam,
            handleChange,
            openTeamList,
            closeTeamList,
        } = this.props;
        const { v_new_team, v_default, v_set_default } = vocabulary;
        return (
            <>
                {teamAddModalToggle && (
                    <ModalPortal>
                        <CreateTeamModal
                            isMobile={isMobile}
                            teamAddPageAction={teamAddPageAction}
                            closeTeamList={closeTeamList}
                        />
                    </ModalPortal>
                )}
                {openTeamList && (
                    <div
                        ref={this.teamListRef}
                        className={cn({
                            customeTheme: !isMobile,
                            customTheme_mobile: isMobile,
                        })}
                    >
                        <div className="add_team_container" style={{ height: `${userTeams.data.length * 35}px` }}>
                            <CustomScrollbar disableTimeEntriesFetch>
                                {userTeams.data.map(team => (
                                    <div
                                        ref={team.id === currentTeam.data.id && this.activeTeamRef}
                                        key={team.id}
                                        data-id={team.id}
                                        onClick={e => handleChange(e)}
                                        className={cn('team_item', {
                                            team_item_selected: team.id === currentTeam.data.id,
                                        })}
                                    >
                                        <div className="team_item_name">{team.name}</div>
                                        <div
                                            className={cn({
                                                team_selection: team.id !== currentTeam.data.id,
                                                team_selection_default: team.id === currentTeam.data.id,
                                            })}
                                        >
                                            {team.id === currentTeam.data.id ? v_default : v_set_default}
                                        </div>
                                    </div>
                                ))}
                            </CustomScrollbar>
                        </div>
                        <div
                            className="add_team_btn"
                            onClick={e => {
                                teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: true });
                            }}
                        >
                            <i />
                            {v_new_team}
                        </div>
                    </div>
                )}
            </>
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
