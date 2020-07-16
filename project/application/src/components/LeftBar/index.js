import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';

import classNames from 'classnames';

// Services
import { checkIsAdminByRole } from '../../services/authentication';

// Components
import TeamSwitcher from '../TeamSwitcher';
import UserMenu from '../UserMenu';

// Styles
import './style.scss';
import { switchMenu } from '../../actions/ResponsiveActions';

class LeftBar extends Component {
    renderTimer = () => {
        const { history, timerTick } = this.props;
        if (history.location.pathname !== '/timer') {
            return timerTick ? timerTick : '';
        }
    };

    render() {
        const { switchMenu, isMobile, vocabulary, currentTeam, isOwner } = this.props;
        const { v_timer, v_reports, v_projects, v_team, v_clients, v_invoices } = vocabulary;
        return (
            <div className={classNames('wrapper', { 'wrapper--mobile': isMobile })}>
                {!isMobile && (
                    <Link onClick={switchMenu} to="/timer">
                        <i className="logo_small" />
                    </Link>
                )}

                <div className="navigation_links_container">
                    <NavLink
                        activeClassName="active-link"
                        onClick={switchMenu}
                        to="/timer"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="navigation_links">
                            <i className="timer" />
                            <div className="links_text">{v_timer}</div>
                            <div className="timer_task">{this.renderTimer()}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        activeClassName="active-link"
                        isActive={() => {
                            const { match } = this.props;
                            return match.path.indexOf('/reports') >= 0;
                        }}
                        onClick={switchMenu}
                        to="/reports/summary"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="navigation_links">
                            <i className="reports" />
                            <div className="links_text">{v_reports}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        activeClassName="active-link"
                        onClick={switchMenu}
                        to="/projects"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="navigation_links">
                            <i className="projects" />
                            <div className="links_text">{v_projects}</div>
                        </div>
                    </NavLink>
                    {checkIsAdminByRole(currentTeam.data.role) && (
                        <NavLink
                            activeClassName="active-link"
                            onClick={switchMenu}
                            to="/clients"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="navigation_links">
                                <i className="clients" />
                                <div className="links_text">{v_clients}</div>
                            </div>
                        </NavLink>
                    )}
                    <div className="wrapper-position-add-team">
                        <NavLink
                            activeClassName="active-link"
                            onClick={switchMenu}
                            to="/team"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="navigation_links">
                                <i className="team" />
                                <div className="links_text">{v_team}</div>
                            </div>
                        </NavLink>
                        <TeamSwitcher isMobile={isMobile} />
                    </div>
                    {isOwner && (
                        <NavLink
                            activeClassName="active-link"
                            onClick={switchMenu}
                            to="/invoices"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="navigation_links">
                                <i className="invoices" />
                                <div className="links_text">{v_invoices}</div>
                            </div>
                        </NavLink>
                    )}
                </div>
                <UserMenu switchMenu={switchMenu} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentTimer: state.mainPageReducer.currentTimer,
    durationTimeFormat: state.userReducer.durationTimeFormat,
    currentTeam: state.teamReducer.currentTeam,
    timerTick: state.mainPageReducer.timerTick,
    isOwner: state.teamReducer.currentTeam.data.owner_id,
});

const mapDispatchToProps = {
    switchMenu,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LeftBar)
);
